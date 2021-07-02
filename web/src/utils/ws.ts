import Stomp from "stompjs";
// import SockJS from "sockjs-client";
import cache from "./cache";

export interface Subscribe {
  callback: Function;
  subscribed?: boolean;
  subscribe?: Stomp.Subscription;
}
export interface WSOptions {
  url: string;
  // 订阅集合 key 为主题，value { callback: function }
  subscribes?: Map<string, Subscribe>;

  // 连接成功回调
  connectCallback?: Function;
  // 断开连接回调
  errorCallback?: Function;
  // 是否断开重连
  isReconnect?: boolean;
  // 重连间隔
  reconnectInterval?: number;
  reconnectAttempts?: number;
  debug?: boolean;
}
export class WS {
  options: WSOptions = {
    url: "",
    subscribes: new Map(),
    connectCallback: (frame: any) => {},
    errorCallback: (error: any) => {},
    isReconnect: false,
    reconnectInterval: 5 * 1000,
    reconnectAttempts: 0,
    debug: false,
  };
  client: Stomp.Client;
  connected: boolean = false;
  timeoutId: NodeJS.Timeout = null;
  constructor(options?: WSOptions) {
    if (options) {
      Object.assign(this.options, options);
    }
  }
  /**
   * 创建一个客户端
   * @param url 
   */
  over(url?: string) {
    if(url) {
      this.options.url = url;
    }
    this.client = Stomp.over(new SockJS(this.options.url));
    if (!this.options.debug) {
      this.client.debug = () => {};
    }
  }
  /**
   * 连接
   * @param connectCallback
   * @param errorCallback
   * @returns
   */
  connect(connectCallback: Function, errorCallback: Function) {
    this.over();
    this.options.connectCallback = connectCallback;
    this.options.errorCallback = errorCallback;
    return this.client.connect(
      { Authorization: cache.get("token") },
      (frame: Stomp.Frame) => {
        this.connected = true;
        clearTimeout(this.timeoutId);
        if (connectCallback) {
          connectCallback(frame);
        }
        this.initSubscribes();
      },
      (error: any) => {
        this.connected = false;
        this.client.disconnect(() => {});
        if (errorCallback) {
          errorCallback(error);
        }
        if (this.options.isReconnect) {
          this.reconnect();
        }
      },
    );
  }
  /**
   * 订阅
   * @param destination
   * @param callback
   * @param headers
   * @returns
   */
  subscribe(destination: string, callback?: Function, headers?: {}) {
    if (!this.connected) {
      this.options.subscribes.set(destination, {
        callback: callback,
        subscribed: false,
      });
      return;
    }
    // 同一个客户端不重复订阅 alter by xingxiaowen on 2018/11/23
    if (this.options.subscribes.has(destination) && this.options.subscribes.get(destination).subscribed) {
      return;
    }
    let subscribe = this.client.subscribe(
      destination,
      res => {
        if (callback) {
          callback(res);
        }
      },
      headers,
    );
    this.options.subscribes.set(destination, {
      callback: callback,
      subscribed: true,
      subscribe: subscribe,
    });
  }
  /**
   * 取消订阅
   * @param destination
   */
  unsubscribe(destination: string) {
    if (this.options.subscribes.has(destination) && this.options.subscribes.get(destination).subscribed) {
      this.options.subscribes.get(destination).subscribe.unsubscribe();
      this.options.subscribes.get(destination).subscribed = false;
    }
  }
  /**
   * 初始化订阅所有的主题
   */
  initSubscribes() {
    this.options.subscribes.forEach((v: Subscribe, k: string) => {
      this.subscribe(k, v.callback);
    });
    Object.keys(this.options.subscribes).forEach(destination => {});
  }
  /**
   * 断线重连
   */
  reconnect() {
    // 断线清除订阅记录
    this.options.subscribes.forEach((v: Subscribe, k: string) => {
      v.subscribed = false;
    });
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.options.reconnectAttempts++;
      this.over();
      this.connect(this.options.connectCallback, this.options.errorCallback);
    }, this.options.reconnectInterval);
  }
  /**
   * 断开连接
   * @param disconnectCallback
   * @param headers
   */
   disconnect(disconnectCallback: Function, headers: {}) {
    this.options.isReconnect = false;
    this.client.disconnect(() => {
      if (disconnectCallback) {
        disconnectCallback();
      }
    }, headers);
  };
}

export default new WS();
import request from "/@/utils/request";

interface App {
  config: any;
  version: string;
}

export class AppService {
  Info() {
    return request({
      url: "/app/info",
      method: "GET",
    });
  }
}

export default new AppService()
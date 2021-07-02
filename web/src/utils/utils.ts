import dayjs from "dayjs";
import lodash from "lodash";
import { ElMessage, ElMessageBox } from "element-plus";
import { ElMessageBoxOptions, MessageBoxData } from "element-plus/lib/el-message-box/src/message-box.type";

/**
 * 格式化时间
 * @param date
 * @param pattern
 * @returns
 */
export const formatTime = (date?: dayjs.ConfigType, pattern?: string): string => {
  return dayjs(date).format(pattern);
};

/**
 * 判断是否是数字
 * @param value
 * @returns
 */
export const $isNaN = (value: any): boolean => {
  return typeof value === "undefined" || value === null || isNaN(value) || value === Infinity || value === -Infinity;
};

/**
 * 深度获取值
 * @param obj
 * @param path
 * @returns
 */
export const getValue = (obj: any, path: string): any => {
  let paths = path.split(".");
  for (let i = 0; i < paths.length; i++) {
    obj = obj[paths[i]];
    if (!obj) {
      break;
    }
  }
  return obj;
};
/**
 * 深度设置值
 * @param obj
 * @param path
 * @param value
 */
export const setValue = (obj: any, path: string, value: any) => {
  let paths = path.split(".");
  let i = 0;
  for (i = 0; i < paths.length - 1; i++) {
    if (!obj[paths[i]]) {
      obj[paths[i]] = {};
    }
    obj = obj[paths[i]];
  }
  obj[paths[i]] = value;
};

/**
 * 格式化数字
 * @param s 数字字符串
 * @param n 小数位数
 * @returns
 */
export const formatNum = (s: string | number, n: number): string => {
  if ($isNaN(s)) {
    return "--";
  }
  // 是否为负数
  let isNegative = false;
  s = s + "";
  if (s.indexOf("-") !== -1) {
    s = s.replace(/[-]/g, "");
    isNegative = true;
  }
  n = n >= 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(),
    r = s.split(".")[1];
  let t = "";
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? "," : "");
  }
  // 负数
  if (isNegative) {
    return "-" + t.split("").reverse().join("") + "." + r;
  }
  let result = t.split("").reverse().join("") + "." + r;
  if (n === 0) {
    result = result.substring(0, result.indexOf("."));
  }
  return result;
};

/**
 * 数字汇总
 * @param ns
 * @returns
 */
export const sum = (ns: number[]): number => {
  if (!ns || ns.length === 0) {
    return 0;
  }
  return ns.reduce((pre: number, cur: number): number => {
    return pre + cur;
  });
};

/**
 * 生成随机颜色, #FFFFFF
 * @returns
 */
export const randomColor = () => {
  var color = "#";
  //for循环中，如果后面仅有一条语句，{}可省略不写
  //随机生成6位0-15之间的数字，再用toString(16)将数字转成16进制
  for (var i = 0; i < 6; i++) color += parseInt(String(Math.random() * 16)).toString(16);
  return color;
};

/**
 * 根据前缀key,获取对象属性值,返回数组
 * @param obj
 * @param prefix
 * @returns
 */
export const getValueOfPrefix = (obj: any, prefix: string): any[] => {
  let r = [];
  for (let key in obj) {
    if (key.startsWith(prefix)) {
      r.push(obj[key]);
    }
  }
  return r;
};

/**
 * Merge a `source` object to a `target` recursively
 * @param target
 * @param source
 * @returns
 */
export const merge = (target: any, source: any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

/**
 * 成功弹窗
 * Add by xingxiaowen 2021-05-10
 *
 * @param message
 * @param duration
 */
export const success = (message?: string, duration?: number) => {
  ElMessage({
    type: "success",
    message: message || "操作成功",
    duration: duration || 5 * 1000,
  });
};

/**
 * 失败弹窗
 * Add by xingxiaowen 2021-05-10
 * @param message
 * @param duration
 */
export const failed = (message?: string, duration?: number) => {
  ElMessage({
    type: "error",
    message: message || "操作失败",
    duration: duration || 5 * 1000,
  });
};

/**
 * 警告弹窗
 * Add by xingxiaowen 2021-05-10
 * @param message
 * @param duration
 */
export const warning = (message: string, duration?: number) => {
  ElMessage({
    type: "warning",
    message: message,
    duration: duration || 5 * 1000,
  });
};
/**
 * 信息弹窗
 * Add by xingxiaowen 2021-05-10
 * @param message
 * @param duration
 */
export const info = (message: string, duration?: number) => {
  ElMessage({
    type: "info",
    message: message,
    duration: duration || 5 * 1000,
  });
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param message
 * @param title
 * @param options
 * @returns
 */
export const confirm = (message: string, title: string, options?: ElMessageBoxOptions): Promise<MessageBoxData> => {
  return ElMessageBox.confirm(message, title, options);
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param message
 * @param title
 * @param options
 * @returns
 */
export const prompt = (message: string, title: string, options?: ElMessageBoxOptions): Promise<MessageBoxData> => {
  return ElMessageBox.prompt(message, title, options);
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param obj
 * @returns
 */
export const clone = (obj: object) => {
  if (obj) {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return null;
  }
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param obj
 * @returns
 */
export const isEmpty = (obj: any) => {
  return typeof obj === "undefined" || obj === null || obj === "" || obj.length === 0;
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param array
 * @param callback
 * @param childName
 * @param stop
 */
export const recursive = (array: any[], callback: Function, childName: string, stop: boolean) => {
  childName = typeof childName === "undefined" || childName === null || childName === "" ? "children" : childName;
  if (array != null && array.length > 0 && !stop) {
    array.forEach((item) => {
      stop = callback(item);
      recursive(item[childName], callback, childName, stop);
    });
  }
};

/**
 * Add by xingxiaowen 2021-05-10
 * @param map
 * @returns
 */
export const mapToObject = (map: any) => {
  let obj = Object.create(null);
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};

/**
 * lodash
 */
export const _ = lodash;

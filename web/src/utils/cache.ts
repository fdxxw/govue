/**
 * 本地缓存
 * Add by xingxiaowen on 2020/04/07
 */
export class Cache {
    set(key: string, value: any) {
        return localStorage.setItem(key, value);
    }
    get(key: string) {
        return localStorage.getItem(key);
    }
    remove(key: string) {
        return localStorage.removeItem(key);
    }
}

export default new Cache();

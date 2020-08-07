/*
 * @Author: wwping
 * @Date: 2020-07-07 01:27:48
 * @LastEditTime: 2020-08-07 15:21:05
 * @LastEditors: Please set LastEditors
 * @Description: 消息订阅发布
 * @FilePath: \danmu\src\renderer\components\msgSubPusher.js
 */
const obj = {
    subs: {

    },
    //添加事件监听
    add: function (type, callback) {
        if (typeof callback == 'function') {
            if (!this.subs[type]) {
                this.subs[type] = [];
            }
            this.subs[type].push(callback);
        }
    },
    //删除事件的监听
    remove (type, callback) {
        let funcs = this.subs[type] || [];
        for (let i = funcs.length - 1; i >= 0; i--) {
            if (funcs[i] == callback) {
                funcs.splice(i, 1);
            }
        }
    },
    //推送消息
    push (type, data) {
        let funcs = this.subs[type] || [];
        for (let i = funcs.length - 1; i >= 0; i--) {
            funcs[i](data);
        }
    },
    //清除某个事件的所有监听
    clear (type) {
        this.subs[type] = [];
    }
}

export default obj;
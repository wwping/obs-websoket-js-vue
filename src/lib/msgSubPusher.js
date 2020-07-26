/*
 * @Author: wwping
 * @Date: 2020-07-07 01:27:48
 * @LastEditTime: 2020-07-26 15:27:06
 * @LastEditors: Please set LastEditors
 * @Description: 消息订阅发布
 * @FilePath: \danmu\src\renderer\components\msgSubPusher.js
 */ 
const obj = {
    subs:{
        
    },
    add:function(type,callback){
        if(typeof callback == 'function'){
            if(!this.subs[type]){
                this.subs[type] =  [];
            }
            this.subs[type].push(callback);
        }
    },
    remove(type,callback){
        let funcs = this.subs[type] || [];
        for(let i = funcs.length - 1; i >= 0; i--){
            if(funcs[i] == callback){
                funcs.splice(i,1);
            }
        }
    },
    push(type,data){
        let funcs = this.subs[type] || [];
        for(let i = funcs.length - 1; i >= 0; i--){
            funcs[i](data);
        }
    }
}

export default obj;
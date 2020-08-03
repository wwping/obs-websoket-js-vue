/*
 * @Author: your name
 * @Date: 2020-08-03 17:36:44
 * @LastEditTime: 2020-08-03 19:39:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\tasks\runtime.js
 */
import msgSubPusher from '../../lib/msgSubPusher'
export default class Runtime {
    print () {
        return new Promise((resolve, reject) => {
            console.log('打印测试');
            resolve(true);
        });
    }
    delay (param) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, param[0]);
        });
    }
    repeat (param, child, callback) {
        return new Promise((resolve, reject) => {
            const fn = (index = 0) => {
                if (index > param[0] - 1) {
                    resolve(true);
                    return false;
                }
                //拿循环里面的代码去搞一遍
                this.run(child, callback).then(() => {
                    //不要太快了
                    requestAnimationFrame(() => {
                        fn(++index);
                    })
                });
            }
            fn();
        });
    }
    changeScene (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command', {
                cmd: 'SetCurrentScene',
                params: { 'scene-name': param[0] },
                callback: () => {
                    resolve(true);
                }
            });
        });
    }
    changeTransition (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command', {
                cmd: 'SetCurrentTransition',
                params: { 'transition-name': param[0] },
                callback: () => {
                    resolve(true);
                }
            })
        });
    }
    changeDuration (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command', {
                cmd: 'SetTransitionDuration',
                params: { 'duration': param[0] },
                callback: () => {
                    resolve(true);
                }
            })
        });
    }
    sourceVisible (param) {
        return new Promise((resolve, reject) => {
            let params =  {
                'scene-name':param[0],item:param[1]
            };
            switch (param[2]) {
                case 'hidden':
                    params.visible = false;
                    break;
                case 'show':
                    params.visible = true;
                    break;
                case 'lock':
                    params.locked = true;
                    break;
                case 'unlock':
                    params.locked = false;
                    break;
            }

            msgSubPusher.push('obs-command',{
                cmd:'SetSceneItemProperties',
                params:params,
                callback:(data)=>{
                    resolve(true);
                }
            });
        });
    }
    sourceMuted(param){
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command',{
                cmd:'SetMute',
                params:{
                    source:param[1],
                    mute:param[2] == 1,
                },
                callback:()=>{
                    resolve(true);
                }
            })
        })
    }
    sourceVolume(param){
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command',{
                cmd:'SetVolume',
                params:{
                    source:param[1],
                    volume:param[2]*100 - 100,
                    useDecibel:true
                },
                callback:()=>{
                    resolve(true);
                }
            })
        })
    }
    run (code, callback) {
        const fn = (code, index = 0) => {
            return new Promise((resolve, reject) => {
                if (index > code.length - 1 || code.length == 0) {
                    resolve(false);
                    return false;
                };

                const [name, id, param, child] = code[index];

                if (typeof callback == 'function') {
                    callback(id);
                }

                if (this[name] && typeof this[name] == 'function') {
                    this[name](param, child, callback).then((res) => {
                        if (res)
                            fn(code, ++index).then(resolve);
                    });
                } else {
                    fn(code, ++index).then(resolve);
                }
            });
        }
        return fn(code);
    }
}
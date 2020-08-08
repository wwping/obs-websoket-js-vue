/*
 * @Author: your name
 * @Date: 2020-08-03 17:36:44
 * @LastEditTime: 2020-08-07 22:59:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\tasks\runtime.js
 */
import msgSubPusher from '../../lib/msgSubPusher'
import store from '../../store'
export default class Runtime {
    isrunning = false
    threadTotal = 0
    threadNum = 0
    transitioning = false
    //当开始过渡
    onTransition (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.add(`obs-on-transition-begin`, (data) => {
                resolve(data.name == param[0] || param[0] == 'any');
            });
        })
    }
    //当过渡结束
    onTransitionEnd (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.add(`obs-on-transition-end`, (data) => {
                resolve(data.name == param[0] || param[0] == 'any');
            });
        })
    }
    //当过渡播放的视频播放结束
    onTransitionVideoEnd (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.add(`obs-on-transition-videoEnd`, (data) => {
                resolve(data.name == param[0] || param[0] == 'any');
            });
        });
    }

    //打印测试
    print (param) {
        return new Promise((resolve, reject) => {
            console.log(param[0]);
            resolve(true);
        });
    }
    //延迟
    delay (param) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, param[0]);
        });
    }
    //重复执行
    repeat (param, child, callback) {
        return new Promise((resolve, reject) => {
            const fn = (index = 0) => {
                if (index > param[0] - 1 || !this.isrunning) {
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

    //切换场景
    changeScene (param) {
        return new Promise((resolve, reject) => {
            if (store.state.current_scene == param[0]) {
                resolve(true);
            } else {
                msgSubPusher.push('obs-command', {
                    cmd: 'SetCurrentScene',
                    params: { 'scene-name': param[0] },
                    callback: () => {
                        resolve(true);
                    }
                });
            }
        });
    }
    //更改过渡动画
    changeTransition (param) {
        return new Promise((resolve, reject) => {
            if (store.state.current_transition == param[0]) {
                resolve(true);
            } else {
                msgSubPusher.push('obs-command', {
                    cmd: 'SetCurrentTransition',
                    params: { 'transition-name': param[0] },
                    callback: () => {
                        resolve(true);
                    }
                })
            }
        });
    }
    //更改过渡事件
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
    //等待转场结束
    waitTransition () {
        return new Promise((resolve, reject) => {
            let fn = () => {
                if (!this.transitioning) {
                    resolve(true);
                } else if (!this.isrunning) {
                    resolve(false);
                } else {
                    setTimeout(fn);
                }
            }
            fn();
        });
    }

    //源可见性
    sourceVisible (param) {
        return new Promise((resolve, reject) => {
            let params = {
                'scene-name': param[0], item: param[1]
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

            msgSubPusher.push('obs-command', {
                cmd: 'SetSceneItemProperties',
                params: params,
                callback: (data) => {
                    resolve(true);
                }
            });
        });
    }
    //源静音
    sourceMuted (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command', {
                cmd: 'SetMute',
                params: {
                    source: param[1],
                    mute: param[2] == 1,
                },
                callback: () => {
                    resolve(true);
                }
            })
        })
    }
    //源音量
    sourceVolume (param) {
        return new Promise((resolve, reject) => {
            msgSubPusher.push('obs-command', {
                cmd: 'SetVolume',
                params: {
                    source: param[1],
                    volume: param[2] * 100 - 100,
                    useDecibel: true
                },
                callback: () => {
                    resolve(true);
                }
            })
        })
    }

    //最后的代码
    lastCode (param) {
        return new Promise((resolve) => {
            this.threadNum++;
            if (this.threadNum >= this.threadTotal) {
                this.stop();
            }
            resolve(true);
        })
    }
    start () {
        this.isrunning = true;
        msgSubPusher.add(`obs-on-transition-begin`, (data) => {
            this.transitioning = true;
            if (data.type == 'cut_transition') {
                setTimeout(() => {
                    msgSubPusher.push('obs-on-transition-end', {
                        name: data.name
                    })
                })
            }
        });
        msgSubPusher.add(`obs-on-transition-end`, (data) => {
            this.transitioning = false;
        });
    }
    stop () {
        this.isrunning = false;
        //先清除所有的过渡事件
        ['begin', 'end', 'videoEnd'].map(c => {
            msgSubPusher.clear(`obs-on-transition-${c}`);
        });
    }
    parseCode (strCode, callback) {

        this.stop();

        //由哪些块开始的代码块可以被运行
        //由别的块开始的代码块不应该被运行
        let canRunBeginNameList = ['onStart', 'onTransition', 'onTransitionEnd', 'onTransitionVideoEnd'];
        //字符串格式代码数组
        let codeStrList = strCode.split('\n');
        let codeList = [];

        for (let i = 0; i < codeStrList.length; i++) {
            try {
                let c = JSON.parse('[' + codeStrList[i] + ']');
                c.push(['lastCode', ''])
                codeList.push(c);
            } catch (e) {
            }
        }
        codeList = codeList.filter(c => canRunBeginNameList.indexOf(c[0][0]) >= 0);
        this.threadTotal = 1;
        if (JSON.stringify(codeList).indexOf('changeScene') >= 0) {
            this.threadTotal = codeList.length;
        }

        this.threadNum = 0;

        this.start();

        //开始跑所有的代码
        for (let i = 0; i < codeList.length; i++) {
            this.run(codeList[i], callback);
        }
    }
    run (code, callback) {

        if (!this.isrunning) {
            return new Promise((resolve) => {
                resolve(false);
            });
        }

        const fn = (code, index = 0) => {
            return new Promise((resolve, reject) => {
                if (index > code.length - 1 || code.length == 0 || !this.isrunning) {
                    resolve(false);
                    return false;
                };

                const [name, id, param, child] = code[index];

                if (typeof callback == 'function') {
                    callback(id);
                }

                if (this[name] && typeof this[name] == 'function') {
                    this[name](param, child, callback).then((res) => {
                        if (res) {
                            fn(code, ++index).then(resolve);
                        }
                    });
                } else {
                    fn(code, ++index).then(resolve);
                }
            });
        }
        return fn(code);
    }
}
<!--
 * @Author: your name
 * @Date: 2020-07-26 15:27:20
 * @LastEditTime: 2020-07-26 17:58:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Connect.vue
--> 
<template>
    <div></div>
</template>
<script>
import OBSWebSocket from 'obs-websocket-js';
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Connect',
    data(){
        return {
            obs:null
        }
    },
    computed:{
        ...mapState({
            connecting:state => state.connecting,
            connectConfig:state=>state.connectConfig,
            scenes:state=>state.scenes,
            current_scene:state=>state.current_scene,
        }),

    },
    mounted(){
        this.obs = new OBSWebSocket();

        this.obs.on('ConnectionClosed', this.close);

        this.obs.on('SourceCreated', this.sourceCreated);
        this.obs.on('SourceDestroyed', this.sourceDestroyed);

        this.obs.on('StreamStarted',this.streamStarted)
        this.obs.on('StreamStopped',this.streamStopped)

        this.obs.on('RecordingStarted',this.recordingStarted)
        this.obs.on('RecordingStopped',this.recordingStopped)

        this.obs.on('Exiting',this.exiting)
        this.obs.on('BroadcastCustomMessage',(data)=>{
            //msgSubPusher.push('obs-msg-'+data.realm ,data.data);
        });

        msgSubPusher.add('obs-command',this.command);
        msgSubPusher.add('obs-connect',this.connect);
        msgSubPusher.add('obs-disconnect',this.disconnect);
        msgSubPusher.add('obs-setCurrentScene',this.setCurrentScene);

        this.connect();

        this.updateSources();
    },
    methods:{
        connect(){
            let address = `${this.connectConfig.address}:${this.connectConfig.port}`;
            this.obs.connect({ address:address, password: this.connectConfig.secret }).then(()=>{
                this.success();
            }).catch(()=>{
                this.error();
            });
        },
        disconnect(){
            this.obs.disconnect();
        },
        setConnecting(boolVal){
            this.$store.dispatch('connecting',boolVal)
        },
        success(){
            this.setConnecting(true);
        },
        error(){this.setConnecting(false)},
        close(){this.setConnecting(false)},
        exiting(){this.setConnecting(false)},

        //scenes
        setCurrentScene(name){
            this.command({
                cmd:'SetCurrentScene',
                params:{'scene-name':name},
                callback:()=>{}
            })
            this.$store.dispatch('current_scene',name);
        },

        //soucres
        sourceCreated(){},
        sourceDestroyed(){},
        updateSources(){
            this.getScenes();
            this.getTransition();
            //this.getMedias();
            setTimeout(this.updateSources, 100);
        },
        getScenes(){
            this.command({
                cmd:'GetSceneList',
                callback:(data)=>{
                    if(data.status == 'ok'){
                        this.$store.dispatch('scenes',data.scenes);
                        this.$store.dispatch('current_scene',data.currentScene);
                    }
                }
            });
        },
        getMedias(){
            

            this.command({
                cmd:'GetSpecialSources',
                callback:(data)=>{
                    if(data.status == 'ok'){
                        let fields = ['desktop-1','desktop-2','mic-1','mic-2','mic-3'];
                        let _audios = [];
                        for(let j in data){
                            if(fields.indexOf(j)>=0){
                                _audios.push(data[j]);
                            }
                        }

                        this.command({
                            cmd:'GetSourceSettings',
                            params:{sourceName:_audios[0]},
                            callback:(data)=>{
                                console.log(data);
                            }
                        })

                        this.command({
                            cmd:'GetSourcesList',
                            callback:(data)=>{
                                if(data.status == 'ok'){
                                    
                                    let types = ['ffmpeg_source','dshow_input','wasapi_input_capture','wasapi_output_capture'];
                                    let allAudios = data.sources.filter(c=>types.indexOf(c.typeId)>=0).map(c=>c.name);
                                    
                                    console.log(data.sources);
                                    
                                    let currentSources = this.scenes.filter(c=>c.name == this.current_scene)[0];

                                    
                                    if(currentSources){
                                        currentSources = currentSources.sources;
                                    }else{
                                        currentSources = [];
                                    }



                                    //currentSources = currentSources.filter(c=>allAudios.indexOf(c.name)>=0 || _audios.indexOf(c.name)>=0);

                                    console.log(currentSources);

                                    //let audios = sources.filter(c=>c.)



                                    //this.$store.dispatch('scenes',data.scenes);
                                    //this.$store.dispatch('current_scene',data.currentScene);
                                }
                            }
                        });
                    }
                }
            });
            
        },

        //transtion
        getTransition(){
            this.command({
                cmd:'GetTransitionList',
                params:{},
                callback:(data)=>{
                    if(data.status == 'ok'){
                        this.$store.dispatch('transitions',data.transitions);
                        this.$store.dispatch('current_transition',data.currentTransition);
                    }
                }
            })

            this.command({
                cmd:'GetTransitionDuration',
                params:{},
                callback:(data)=>{
                    if(data.status == 'ok'){
                        this.$store.dispatch('transition_duration',data.transitionDuration);
                    }
                }
            })
        },

        //stream
        setStreaming(boolVal){this.$store.dispatch('streaming',boolVal)},
        streamStarted(){this.setStreaming(true)},
        streamStopped(){this.setStreaming(false)},

        //record
        setRecording(boolVal){this.$store.dispatch('recording',boolVal)},
        recordingStarted(){this.setRecording(true)},
        recordingStopped(){this.setRecording(false)},

        command({cmd,params,callback}){
            this.obs.send(cmd,params || {}).then(callback).catch(callback);
        }
    }
}
</script>
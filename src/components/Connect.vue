<!--
 * @Author: your name
 * @Date: 2020-07-26 15:27:20
 * @LastEditTime: 2020-08-07 19:21:47
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
    name: 'Connect',
    data () {
        return {
            obs: null
        }
    },
    computed: {
        ...mapState({
            connecting: state => state.connecting,
            connect_config: state => state.connect_config,
            scenes: state => state.scenes,
            current_scene: state => state.current_scene,
        }),
    },
    watch: {
        connecting (val) {
            this.updateSources();
        }
    },
    mounted () {
        this.obs = new OBSWebSocket();

        this.obs.on('ConnectionClosed', this.close);

        this.obs.on('StreamStarted', this.streamStarted)
        this.obs.on('StreamStopped', this.streamStopped)
        this.obs.on('RecordingPaused', this.recordingPaused)
        this.obs.on('RecordingResumed', this.recordingResumed)

        this.obs.on('RecordingStarted', this.recordingStarted)
        this.obs.on('RecordingStopped', this.recordingStopped)

        this.obs.on('Exiting', this.exiting)
        this.obs.on('BroadcastCustomMessage', (data) => {
        });

        //listener events to update sources
        [
            'SwitchScenes', 'ScenesChanged'
            , 'SceneCollectionChanged', 'SceneCollectionListChanged'
            , 'TransitionListChanged', 'TransitionDurationChanged'
            , 'ProfileChanged', 'ProfileListChanged'
            , 'StreamStarted', 'StreamStopped', 'StreamStatus'
            , 'RecordingStarted', 'RecordingStopped', 'RecordingPaused', 'RecordingResumed'
            , 'ReplayStarted', 'ReplayStopped'
            , 'SourceCreated', 'SourceDestroyed', 'SourceVolumeChanged', 'SourceMuteStateChanged'
            , 'SourceAudioActivated', 'SourceAudioDeactivated', 'SourceAudioActivated', 'SourceAudioSyncOffsetChanged', 'SourceAudioMixersChanged'
            , 'SourceRenamed', 'SourceFilterAdded', 'SourceFilterRemoved', 'SourceFilterVisibilityChanged', 'SourceFiltersReordered'
            , 'MediaPaused', 'MediaStopped', 'MediaNext', 'MediaPrevious', 'MediaStarted', 'MediaEnded'
            , 'SourceOrderChanged', 'SceneItemAdded', 'SceneItemRemoved', 'SceneItemVisibilityChanged', 'SceneItemLockChanged'
            , 'SceneItemTransformChanged', 'SceneItemSelected', 'SceneItemDeselected'
            , 'PreviewSceneChanged', 'StudioModeSwitched'
        ].map(c => {
            this.obs.on(c, () => {
                this.updateSources();
            })
        });

        //监听obs过渡事件，发送消息 给任务代码
        [
            { event: 'TransitionBegin', name: 'begin' },
            { event: 'TransitionEnd', name: 'end' },
            { event: 'TransitionVideoEnd', name: 'videoEnd' },
        ].map(c => {
            this.obs.on(c.event, (data) => {
                msgSubPusher.push(`obs-on-transition-${c.name}`, data);
            });
        });


        msgSubPusher.add('obs-command', this.command);
        msgSubPusher.add('obs-connect', this.connect);
        msgSubPusher.add('obs-disconnect', this.disconnect);
        msgSubPusher.add('obs-setCurrentScene', this.setCurrentScene);

        this.connect();
    },
    methods: {
        connect () {
            let address = `${this.connect_config.address}:${this.connect_config.port}`;
            this.obs.connect({ address: address, password: this.connect_config.secret }).then(() => {
                this.success();
            }).catch(() => {
                this.error();
                setTimeout(this.connect, 1000);
            });
        },
        disconnect () { this.obs.disconnect(); },
        setConnecting (boolVal) { this.$store.dispatch('connecting', boolVal) },
        success () { this.setConnecting(true); },
        error () { this.setConnecting(false) },
        close () { this.setConnecting(false) },
        exiting () { this.setConnecting(false); },

        //scenes
        setCurrentScene (name) {
            this.command({
                cmd: 'SetCurrentScene',
                params: { 'scene-name': name },
                callback: () => { }
            })
            this.$store.dispatch('current_scene', name);
        },

        //soucres
        updateSources () {
            this.getScenes();
            this.getTransition();
            this.getMedias();
            this.getRecordStatus();
            this.getStreamingStatus();
        },
        getScenes () {
            this.command({
                cmd: 'GetSceneList',
                callback: (data) => {
                    if (data.status == 'ok') {
                        this.$store.dispatch('scenes', data.scenes);
                        this.$store.dispatch('current_scene', data.currentScene);
                    }
                }
            });
        },
        getMedias () {
            this.command({
                cmd: 'GetSpecialSources',
                callback: (data) => {
                    if (data.status == 'ok') {
                        let fields = ['desktop-1', 'desktop-2', 'mic-1', 'mic-2', 'mic-3'];
                        let _audios = [];
                        for (let j in data) {
                            if (fields.indexOf(j) >= 0) {
                                _audios.push(data[j]);
                            }
                        }
                        this.$store.dispatch('special_sources', _audios);

                        this.command({
                            cmd: 'GetSourceTypesList',
                            callback: (data) => {
                                if (data.status == 'ok') {
                                    let types = data.types.filter(c => c.caps.hasAudio == true).map(c => c.typeId);
                                    this.$store.dispatch('audio_types', types);


                                    let currentSources = this.scenes.filter(c => c.name == this.current_scene)[0];
                                    let allAudios = currentSources.sources.filter(c => types.indexOf(c.type) >= 0 && c.render == true).map(c => c.name);
                                    allAudios = allAudios.concat(_audios);

                                    let audiosFunc = allAudios.map(c => {
                                        return new Promise((a, b) => {
                                            this.command({
                                                cmd: 'GetVolume',
                                                params: { source: c, useDecibel: true },
                                                callback: (data) => {
                                                    if (data.status == 'ok') {
                                                        a(data);
                                                    } else {
                                                        b();
                                                    }
                                                }
                                            })
                                        });
                                    })
                                    Promise.all(audiosFunc).then((data) => {
                                        this.$store.dispatch('sounds', data.map(c => {
                                            return {
                                                name: c.name,
                                                muted: c.muted,
                                                volume: c.volume,
                                            }
                                        }))
                                    })
                                } else {
                                    this.$store.dispatch('sounds', []);
                                }
                            }
                        })
                    } else {
                        this.$store.dispatch('sounds', []);
                    }
                }
            });
        },

        //transtion
        getTransition () {
            this.command({
                cmd: 'GetTransitionList',
                params: {},
                callback: (data) => {
                    if (data.status == 'ok') {
                        this.$store.dispatch('transitions', data.transitions);
                        this.$store.dispatch('current_transition', data.currentTransition);
                    }
                }
            })

            this.command({
                cmd: 'GetTransitionDuration',
                params: {},
                callback: (data) => {
                    if (data.status == 'ok') {
                        this.$store.dispatch('transition_duration', data.transitionDuration);
                    }
                }
            })
        },

        //stream
        setStreaming (boolVal) { this.$store.dispatch('streaming', boolVal) },
        streamStarted () { this.setStreaming(true) },
        streamStopped () { this.setStreaming(false) },
        getStreamingStatus () {
            this.command({
                cmd: 'GetStreamingStatus',
                callback: (data) => {
                    if (data.status == 'ok') {
                        this.setStreaming(data.streaming);
                    }
                }
            })
        },

        //record
        setRecording (boolVal) { this.$store.dispatch('recording', boolVal) },
        setRecordingPause (boolVal) { this.$store.dispatch('record_paused', boolVal) },
        recordingStarted () { this.setRecording(true) },
        recordingStopped () { this.setRecording(false) },
        recordingPaused () { this.setRecordingPause(true) },
        recordingResumed () { this.setRecordingPause(false) },
        getRecordStatus () {
            this.command({
                cmd: 'GetRecordingStatus',
                callback: (data) => {
                    if (data.status == 'ok') {
                        this.setRecording(data.isRecording);
                        this.setRecordingPause(data.isRecordingPaused);
                    }
                }
            })
        },

        command ({ cmd, params, callback }) {
            this.obs.send(cmd, params || {}).then(callback).catch(callback);
        }
    }
}
</script>
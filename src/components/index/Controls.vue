<!--
 * @Author: your name
 * @Date: 2020-07-26 15:20:08
 * @LastEditTime: 2020-07-27 22:55:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Controls.vue
--> 
<template>
    <div>
        <ul>
            <li>
                <Button type="warning" size="small" v-if="streaming" @click="stopStream">{{$t('df.stopStream')}}</Button>
                <Button size="small" v-else @click="startStream">{{$t('df.startStream')}}</Button>
            </li>
            <li>
                <span v-if="record_paused">
                    <Button type="warning" size="small" @click="stopRecord">{{$t('df.stopRecord')}}</Button>
                    <Button size="small" @click="resumeRecording">{{$t('df.resumeRecord')}}</Button>
                </span>
                <span v-else-if="recording">
                    <Button type="warning" size="small" @click="stopRecord">{{$t('df.stopRecord')}}</Button>
                    <Button size="small" @click="pauseRecording">{{$t('df.pauseRecord')}}</Button>
                </span>
                <span v-else>
                    <Button size="small" @click="startRecord">{{$t('df.startRecord')}}</Button>
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../../lib/msgSubPusher'
export default {
    name:'Controls',
    data(){
        return {
        }
    },
    computed:{
        ...mapState({
            streaming:state => state.streaming,
            recording:state => state.recording,
            record_paused:state => state.record_paused,
        })
    },
    methods:{
        startRecord(){
            msgSubPusher.push('obs-command',{
                cmd:'StartRecording',
                callback:()=>{}
            })
        },
        stopRecord(){
            msgSubPusher.push('obs-command',{
                cmd:'StopRecording',
                callback:()=>{}
            })
        },
        startStream(){
            msgSubPusher.push('obs-command',{
                cmd:'StartStreaming',
                callback:()=>{}
            })
        },
        stopStream(){
            msgSubPusher.push('obs-command',{
                cmd:'StopStreaming',
                callback:()=>{}
            })
        },
        pauseRecording(){
            msgSubPusher.push('obs-command',{
                cmd:'PauseRecording',
                callback:()=>{}
            })
        },
        resumeRecording(){
            msgSubPusher.push('obs-command',{
                cmd:'ResumeRecording',
                callback:()=>{}
            })
        },
    }
}
</script>
<style scoped>
ul{text-align: center;padding: 6px;}
li{margin-bottom: 6px;}
</style>
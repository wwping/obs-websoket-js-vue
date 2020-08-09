<!--
 * @Author: your name
 * @Date: 2020-08-09 18:09:57
 * @LastEditTime: 2020-08-09 18:57:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\CopyRight.vue
-->
<template>
    <div>
        <div class="copyright flex-display">
            <div>Author : wwping , QQ : <strong>1069410172</strong></div>
            <div class="flex-1"></div>
            <div class="stats">
                <span>fps <strong>{{fps}}</strong></span>
                <span>cpu <strong>{{cpu}}%</strong></span>
                <span>{{$t('stats.memory')}} <strong>{{memory}}MB</strong></span>
                <span v-if="streaming">{{$t('stats.dropFrames')}} <strong>{{dropFrames}} ({{strain}})%</strong></span>
                <span v-if="streaming">{{$t('stats.streamSpeed')}} <strong>{{kbits}} kb/s</strong></span>
                <span v-if="streaming">{{$t('stats.streamTime')}} <strong>{{times}}s</strong></span>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name: 'CopyRight',
    data () {
        return {
            fps: 0,
            cpu: 0,
            memory: 0,
            strain: 0,
            kbits: 0,
            alltime: 0,
            dropFrames: 0
        }
    },
    computed: {
        ...mapState({
            connecting: state => state.connecting,
            streaming: state => state.streaming,
        }),
        times () {
            return `${Math.floor(this.alltime / 3600)}:${Math.floor((this.alltime / 60 % 60))}:${Math.floor((this.alltime % 60))}`;
        }
    },
    mounted () {
        this.GetStats();
        this.StreamStatus();
    },
    methods: {
        StreamStatus () {
            msgSubPusher.add('obs-on-streamStatus', (data) => {
                this.strain = data.strain.toFixed(1);
                this.kbits = data['kbits-per-sec'];
                this.alltime = data['total-stream-time'];
                this.dropFrames = data['num-dropped-frames'];

                this.fps = Math.floor(data.fps);
                this.cpu = data['cpu-usage'].toFixed(1);
                this.memory = data['memory-usage'].toFixed(1);
            });
            /*
                {
                    streaming	布尔值	当前流状态。
                    recording	布尔值	当前记录状态。
                    replay-buffer-active	布尔值	重播缓冲区状态
                    bytes-per-sec	整型	流编码器每秒传输的数据量（以字节为单位）。
                    kbits-per-sec	整型	流编码器每秒传输的数据量（以千位为单位）。
                    strain	双	丢帧的百分比。
                    total-stream-time	整型	自流开始以来的总时间（以秒为单位）。
                    num-total-frames	整型	自流开始以来传输的帧总数。
                    num-dropped-frames	整型	自流开始以来编码器丢弃的帧数。
                    fps	双	当前帧率。
                    render-total-frames	整型	渲染的帧数
                    render-missed-frames	整型	由于渲染滞后而错过的帧数
                    output-total-frames	整型	输出的帧数
                    output-skipped-frames	整型	由于编码滞后而跳过的帧数
                    average-frame-time	双	平均帧时间（以毫秒为单位）
                    cpu-usage	双	当前的CPU使用率（百分比）
                    memory-usage	双	当前RAM使用量（以兆字节为单位）
                    free-disk-space	双	可用记录磁盘空间（以兆字节为单位）
                    preview-only	布尔值	始终为假（可逆兼容性）。
                }
            */
        },
        GetStats () {
            if (!this.connecting || this.streaming) {
                setTimeout(this.GetStats, 1000);
                return false;
            }
            msgSubPusher.push('obs-command', {
                cmd: 'GetStats',
                callback: (data) => {
                    console.log(data);
                    this.fps = Math.floor(data.stats.fps);
                    this.cpu = data.stats['cpu-usage'].toFixed(1);
                    this.memory = data.stats['memory-usage'].toFixed(1);
                    /*
                        {
                            average-frame-time: 0.353525 //平均帧渲染时间（以毫秒为单位）
                            cpu-usage: 4.682523881870736 //当前的CPU使用率（百分比）
                            fps: 30.000000300000007 //当前帧率
                            free-disk-space: 125327.82421875 //可用记录磁盘空间（以兆字节为单位）
                            memory-usage: 200.26953125 //当前RAM使用量（以兆字节为单位）
                            output-skipped-frames: 0 //由于编码滞后而跳过的帧数
                            output-total-frames: 0 //输出的帧数
                            render-missed-frames: 85 //由于渲染滞后而错过的帧数
                            render-total-frames: 350110 //渲染的帧数
                        }
                    */
                    setTimeout(this.GetStats, 1000);
                }
            })
        }
    }
}
</script>
<style scoped>
.copyright{border-top: 1px solid #ddd;padding:6px;}
.stats span{margin-left: 20px;}
</style>
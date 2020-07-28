<!--
 * @Author: your name
 * @Date: 2020-07-27 10:42:16
 * @LastEditTime: 2020-07-27 11:36:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Sounds.vue
--> 
<template>
    <div>
        <ul class="sounds-wrap">
            <li v-for="(item,index) in sounds" :key="index">
                <dl>
                    <dt>{{item.name}}</dt>
                    <dd class="flex-display">
                        <Slider v-model="item.volume" :step="0.01" :min="-100" :max="0" class="flex-1" @on-change="volumeChange(item)"></Slider>
                        <span class="mute">
                            <Icon type="md-volume-off" v-if="item.muted" @click="setMute(item)"/>
                            <Icon type="md-volume-up" v-else @click="setMute(item)"/>
                        </span>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../../lib/msgSubPusher'
export default {
    name:'Sounds',
    data(){
        return {
            sounds:[]
        }
    },
    computed:{
        ...mapState({
            obssounds:state => state.sounds,
        })
    },
    watch:{
        obssounds(val){
            this.sounds = JSON.parse(JSON.stringify(this.obssounds));
        }
    },
    mounted(){
    },
    methods:{
        volumeChange(item){
            msgSubPusher.push('obs-command',{
                cmd:'SetVolume',
                params:{
                    source:item.name,
                    volume:item.volume,
                    useDecibel:true
                }
            })
            this.$store.dispatch('sounds',this.sounds);
        },
        setMute(item){
            msgSubPusher.push('obs-command',{
                cmd:'SetMute',
                params:{
                    source:item.name,
                    mute:!item.muted,
                }
            })
            this.$store.dispatch('sounds',this.sounds);
        }
    }
}
</script>
<style>
.sounds-wrap .ivu-slider-wrap{margin: 6px 0;}
</style>
<style scoped>
ul{padding: 10px;}
span.mute{width: 30px;text-align: right;}
.ivu-icon-md-volume-off,.ivu-icon-md-volume-up{font-size: 20px;cursor: pointer;margin-top: -2px;}
.ivu-icon-md-volume-off{color:red;}
</style>
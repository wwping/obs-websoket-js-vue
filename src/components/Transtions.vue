<!--
 * @Author: your name
 * @Date: 2020-07-26 17:51:12
 * @LastEditTime: 2020-07-26 18:06:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Transtions.vue
--> 
<template>
    <div>
        <div class="transition">
            <ul>
                <li>
                    <Select :value="current_transition" @on-change="currentChange">
                        <Option v-for="item in transitions" :value="item.name" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </li>
                <li>
                    <InputNumber :min="0" :value="transition_duration" @on-change="durationChange"></InputNumber> ms
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Transtions',
    data(){
        return {
            transtion:''
        }
    },
    computed:{
        ...mapState({
            transitions:state => state.transitions,
            current_transition:state=>state.current_transition,
            transition_duration:state=>state.transition_duration,
        })
    },
    mounted(){
    },
    methods:{
        currentChange(val){
            msgSubPusher.push('obs-command',{
                cmd:'SetCurrentTransition',
                params:{'transition-name':val},
                callback:()=>{
                }
            })
        },
        durationChange(val){
            msgSubPusher.push('obs-command',{
                cmd:'SetTransitionDuration',
                params:{'duration':val},
                callback:()=>{
                }
            })
        }
    }
}
</script>
<style scoped>
.transition{padding: 10px;}
li{margin-bottom: 6px;}
</style>
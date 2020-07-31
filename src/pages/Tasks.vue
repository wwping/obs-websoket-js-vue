<!--
 * @Author: your name
 * @Date: 2020-07-31 16:24:00
 * @LastEditTime: 2020-07-31 17:14:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\pages\Tasks.vue
--> 
<template>
    <div>
        <ul>
            <li v-for="(item,key,index) in tasks" :key="index">
                <div class="title flex-display">
                    <span>{{item.name}}</span>
                    <span class="flex-1"></span>
                    <span>自动执行 : {{item.auto}}</span>
                    <span>自动次数 : {{item.loop}}</span>
                    <span>执行间隔 : {{item.autoSec}}</span>
                    <span></span>
                </div>
            </li>
            <li>
                <div class="add">
                    <Button @click="addTask"><Icon type="md-add" /> Add</Button>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Tasks',
    computed:{
        ...mapState({
            store_taks:state => state.tasks,
        })
    },
    watch:{
        store_taks(){
            this.init();
        }
    },
    data(){
        return {
            tasks:{}
        }
    },
    mounted(){
        this.init();


        var model = {
            excuteType:'asyn', //sync同步 asyn异步
            auto:false,
            autoTime:0, //s
            loop:-1, //-1 no  0 forever >0times
            list:[
                {
                    type:'',//sourceVisible,changeScene,changeVolume,changeMuted,changeTransition,changeTransitionDuration
                    values:[

                    ]
                }
            ]

        };

    },
    methods:{
        init(){
            this.tasks = JSON.parse(JSON.stringify(this.store_taks));
        },
        addTask(){
            this.$store.dispatch('tasks',{
                name:'新任务',
                auto:false,
                autoSec:0, //s
                autoTime:0, //s
                loop:-1, //-1 no  0 forever >0times
                list:[]
            })
        }
    }
}
</script>
<style scoped>
ul{padding: 10px;}
.add{text-align: center; }
</style>
<!--
 * @Author: your name
 * @Date: 2020-07-26 16:15:08
 * @LastEditTime: 2020-07-26 17:29:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Scenes.vue
--> 
<template>
    <div>
        <ul>
            <li v-for="(item,index) in scenes" :key="index" :class="{current:item.name == current_scene}" @click="change(item.name)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Scenes',
    computed:{
        ...mapState({
            scenes:state => state.scenes,
            current_scene:state=>state.current_scene
        })
    },
    methods:{
        change(name){
            msgSubPusher.push('obs-setCurrentScene',name);
        }
    }
}
</script>
<style scoped>
li{line-height: 24px;cursor: pointer;padding: 0 6px;transition: .3s;font-size:13px}
li.current{background-color: rgba(0,0,0,0.1);}
li:hover{background-color: rgba(0,0,0,0.05);}
</style>
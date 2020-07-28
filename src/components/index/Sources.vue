<!--
 * @Author: your name
 * @Date: 2020-07-26 16:20:34
 * @LastEditTime: 2020-07-27 22:55:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Sources.vue
--> 
<template>
    <div>
        <ul>
            <li v-for="(item,index) in sources" :key="index" class="flex-display">
                <span class="icon"></span>
                <span class="name">{{item.name}}</span>
                <span class="flex-1"></span>
                <span class="render">
                    <Icon v-if="item.render" type="md-eye" size="18" @click="setRender(item.name,false)" />
                    <Icon v-else type="ios-eye-off-outline" size="18" @click="setRender(item.name,true)"/>
                </span>
                <span class="lock">
                    <Icon v-if="item.locked" type="md-lock" size="18" @click="setLock(item.name,false)"/>
                    <Icon v-else type="ios-unlock-outline" size="18" @click="setLock(item.name,true)"/>
                </span>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../../lib/msgSubPusher'
export default {
    name:'Sources',
    computed:{
        ...mapState({
            scenes:state => state.scenes,
            current_scene:state=>state.current_scene
        }),
        sources:function(){
            let scene =  this.scenes.filter(c=>c.name == this.current_scene)[0];
            if(scene){
                return scene.sources;
            }
            return [];
        }
    },
    methods:{
        setRender(name,boolVal){
            msgSubPusher.push('obs-command',{
                cmd:'SetSceneItemProperties',
                params:{'scene-name':this.current_scene,item:{name:name},visible:boolVal},
                callback:(data)=>{
                }
            })
        },
        setLock(name,boolVal){
            msgSubPusher.push('obs-command',{
                cmd:'SetSceneItemProperties',
                params:{'scene-name':this.current_scene,item:{name:name},locked:boolVal},
                callback:(data)=>{
                }
            })
        }
    }
}
</script>
<style scoped>
li{line-height: 24px;cursor: pointer;padding: 0 6px;transition: .3s;font-size: 13px;}
li:hover{background-color: rgba(0,0,0,0.05);}
.lock i{margin-left: 6px;}
</style>
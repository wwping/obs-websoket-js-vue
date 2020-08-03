<!--
 * @Author: your name
 * @Date: 2020-07-26 16:20:34
 * @LastEditTime: 2020-08-01 12:35:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Sources.vue
--> 
<template>
    <div>
        <ul>
            <li v-for="(item,index) in sources" :key="index" >
                <div class="flex-display">
                    <span class="icon" v-if="item.type == 'group'" @click="triggerOpen(item)">
                        <Icon type="ios-arrow-down" v-if="opens[item.name]" />
                        <Icon type="ios-arrow-forward" v-else />
                    </span>
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
                </div>
                <ul v-if="item.groupChildren" :class="{open:opens[item.name]}">
                    <li v-for="(item1,index1) in item.groupChildren" :key="index1" >
                        <div class="flex-display">
                            <span class="icon"></span>
                            <span class="name">{{item1.name}}</span>
                            <span class="flex-1"></span>
                            <span class="render">
                                <Icon v-if="item1.render" type="md-eye" size="18" @click="setRender(item1.name,false)" />
                                <Icon v-else type="ios-eye-off-outline" size="18" @click="setRender(item1.name,true)"/>
                            </span>
                            <span class="lock">
                                <Icon v-if="item1.locked" type="md-lock" size="18" @click="setLock(item1.name,false)"/>
                                <Icon v-else type="ios-unlock-outline" size="18" @click="setLock(item1.name,true)"/>
                            </span>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../../lib/msgSubPusher'
export default {
    name:'Sources',
    data(){
        return {
        }
    },
    computed:{
        ...mapState({
            scenes:state => state.scenes,
            current_scene:state=>state.current_scene,
            opens:state=>state.opens
        }),
        sources:function(){
            let scene =  this.scenes.filter(c=>c.name == this.current_scene)[0];
            if(scene){
                return scene.sources;
            }
            return [];
        }
    },
    mounted(){
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
        },
        triggerOpen(item){
            this.$store.dispatch('opens',{
               name:item.name,
               val:this.opens[item.name]?false:true
            })
        }
    }
}
</script>
<style scoped>
li{line-height: 24px;cursor: pointer;padding: 0 6px;transition: .3s;font-size: 13px;}
li:hover{background-color: rgba(0,0,0,0.05);}
.lock i{margin-left: 6px;}
li span.name{max-width: 120px;overflow: hidden;}

li li{padding: 0 0 0 10px;}
li ul{height: 0;overflow: hidden;}
li ul.open{height: auto;}
</style>
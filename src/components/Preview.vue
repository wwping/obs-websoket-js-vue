<!--
 * @Author: your name
 * @Date: 2020-07-26 18:55:37
 * @LastEditTime: 2020-07-26 19:17:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Preview.vue
--> 
<template>
    <div>
        <div class="preview">
            <img :src="src" alt="">
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Preview',
    data(){
        return {
            src:''
        }
    },
    mounted(){
        this.takeScreenshot();
    },
    computed:{
        ...mapState({
            scenes:state => state.scenes,
            current_scene:state=>state.current_scene
        })
    },
    methods:{
        takeScreenshot(){
            msgSubPusher.push('obs-command',{
                cmd:'TakeSourceScreenshot',
                params:{
                    sourceName:this.current_scene,
                    embedPictureFormat:'jpg',
                    compressionQuality:100
                },
                callback:(data)=>{
                    if(data.status == 'ok'){
                        this.src = data.img;
                    }
                    setTimeout(this.takeScreenshot,1000);
                }
            })
        }
    }
}
</script>
<style scoped>
img{max-width: 100%;}
</style>
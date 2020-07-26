<!--
 * @Author: your name
 * @Date: 2020-07-26 13:49:06
 * @LastEditTime: 2020-07-26 19:18:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\pages\Index.vue
--> 
<template>
    <div>
        <div class="wrap">
            <div class="title">
                <Title></Title>
            </div>
            <div class="preview" ref="preview">
                <Preview></Preview>
            </div>
            <div class="manager">
                <Manager></Manager>
            </div>
        </div>
    </div>
</template>
<script>
import Title from '../components/Title'
import Manager from '../components/Manager'
import Preview from '../components/Preview'
export default {
    name:'Index',
    components:{Title,Manager,Preview},
    data(){
        return {
        }
    },
    watch:{
        width:function(){
            this.height = this.width / 16 * 9;
        }
    },
    mounted(){
    },
    methods:{
    }
}
</script>
<style scoped>
.wrap{width: 900px;border: 1px solid #ddd;margin:20px auto 0 auto;}
.title{height: 36px;line-height: 36px;border-bottom: 1px solid #ddd;}
.preview{text-align: center;padding: 10px;background-color: #eee;}
</style>
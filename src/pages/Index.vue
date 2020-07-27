<!--
 * @Author: your name
 * @Date: 2020-07-26 13:49:06
 * @LastEditTime: 2020-07-27 12:17:24
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
            <Tabs value="manager">
                <TabPane :label="$t('df.manager')" name="manager">
                    <div class="preview" ref="preview">
                        <Preview></Preview>
                    </div>
                    <div class="manager">
                        <Manager></Manager>
                    </div>
                </TabPane>
                <TabPane :label="$t('df.setting')" name="setting">
                    <Setting></Setting>
                </TabPane>
            </Tabs>
            
        </div>
    </div>
</template>
<script>
import Title from '../components/Title'
import Manager from '../components/Manager'
import Preview from '../components/Preview'
import Setting from '../components/Setting'
export default {
    name:'Index',
    components:{Title,Manager,Preview,Setting},
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
<style>
.ivu-tabs-bar{margin-bottom: 0;}
</style>
<style scoped>
.wrap{width: 900px;border: 1px solid #ddd;margin:20px auto 0 auto;}
.title{height: 40px;line-height: 40px;border-bottom: 1px solid #ddd;}
.preview{text-align: center;padding: 10px;}

@media screen and (max-width: 900px) {
    .wrap{width: 100%;margin: 0;border: 0;border-bottom: 1px solid #ddd;}
}
</style>
<!--
 * @Author: your name
 * @Date: 2020-07-26 13:39:46
 * @LastEditTime: 2020-07-28 14:15:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\App.vue
--> 
<template>
    <div id="app">
        <div class="wrap">
            <Connect></Connect>
            <div>
                <div class="title">
                    <Title></Title>
                </div>
                <div class="menu">
                    <MenuBar></MenuBar>
                </div>
                <div>
                    <router-view/>
                </div>
                <div class="copyright">Author : wwping , QQ : <strong>1069410172</strong></div>
            </div>
        </div>
    </div>
</template>

<script>
import Connect from './components/Connect'
import Menu from './components/Menu'
import Title from './components/Title'
export default {
    name: 'App',
    components:{Connect,MenuBar:Menu,Title}
}
</script>

<style>
.ivu-tabs-bar{margin-bottom: 0 !important;}
</style>
<style scoped>
.wrap{width: 900px;border: 1px solid #ddd;margin:20px auto 0 auto;}
.title{height: 40px;line-height: 40px;border-bottom: 1px solid #ddd;}

.copyright{border-top: 1px solid #ddd;padding:6px;}
@media screen and (max-width: 900px) {
    .wrap{width: 100%;margin: 0;border: 0;border-bottom: 1px solid #ddd;}
}
</style>
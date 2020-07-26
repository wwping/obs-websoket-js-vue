<!--
 * @Author: your name
 * @Date: 2020-07-26 13:39:46
 * @LastEditTime: 2020-07-26 15:53:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\App.vue
--> 
<template>
    <div id="app">
        <Connect></Connect>
        <router-view/>
    </div>
</template>

<script>
import Connect from './components/Connect'
export default {
    name: 'App',
    components:{Connect}
}
</script>

<style>
</style>

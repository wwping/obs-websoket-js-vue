<!--
 * @Author: your name
 * @Date: 2020-07-26 13:49:06
 * @LastEditTime: 2020-07-28 21:11:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\pages\Index.vue
--> 
<template>
    <div>
        <div class="wrap">
            <div class="preview"
                 ref="preview">
                <Preview></Preview>
            </div>
            <div class="manager">
                <Manager></Manager>
            </div>
        </div>
    </div>
</template>
<script>
import Manager from '../components/index/Manager'
import Preview from '../components/index/Preview'
// import axios from 'axios'
// import pako from 'pako'
export default {
    name: 'Index',
    components: { Manager, Preview },
    data () {
        return {
        }
    },
    mounted () {
    },
    methods: {
    }
}
</script>
<style scoped>
.preview{text-align: center;padding: 10px;}
</style>



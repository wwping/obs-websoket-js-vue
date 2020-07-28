<!--
 * @Author: your name
 * @Date: 2020-07-26 14:06:43
 * @LastEditTime: 2020-07-28 17:21:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Title.vue
--> 
<template>
    <div class="wrap-title flex-display">
        <div>
            <div class="status" :class="{connecting:connecting}">
                <span><Icon type="ios-infinite" size="16" /></span>
                <span>{{connectText}}</span>
                <span class="status-btn">
                    <a class="error" v-if="connecting" @click="disconnect">{{$t('df.unconnect')}}</a>
                    <a href="javascript:;" v-else @click="connect">{{$t('df.connect')}}</a>
                </span>
            </div>
        </div>
        <div class="flex-1"></div>
        <div>
            <Select v-model="language" style="width:auto;position:relative; z-index:99999" size="small" @on-change="languageChange">
                <Option v-for="item in languages" :value="item.name" :key="item.name">{{ item.txt }}</Option>
            </Select>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Title',
    data(){
        return {
            language:localStorage.getItem('local') || 'zh',
            languages:[
                {name:'en',txt:'English'},
                {name:'zh',txt:'简体中文'},
            ],
        }
    },
    computed:{
        connectText:function(){
            return this.connecting?this.$t("df.connecting"):this.$t("df.unconnecting")
        },
        ...mapState({
            connecting:state => state.connecting,
        })
    },
    mounted(){
    },
    methods:{
        connect(){
            msgSubPusher.push('obs-connect')
        },
        disconnect(){
            msgSubPusher.push('obs-disconnect')
        },
        languageChange(val){
            localStorage.setItem('local',val);
            window.location.reload();
        }
    }
}
</script>
<style>
.wrap-title .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
.wrap-title  .ivu-select-single .ivu-select-selection .ivu-select-selected-value{font-size: 12px;}
.wrap-title .ivu-select-selection{background-color: transparent;}
</style>
<style scoped>
.wrap-title{padding: 0 10px;background-color: #f5f5f5;height: 39px;}
.status.connecting{color: green;font-weight: bold;}
.config-input{width: auto;width: 80px;}
.config-input.port{width: 60px;}

.ivu-select{padding-top: 7px;vertical-align: inherit;border:0;font-size: 13px;}

.status-btn a{color:#333;border: 1px solid #ddd;padding: 2px 6px;border-radius: 2px;background-color: #f5f5f5;}
.status-btn a.error{color:red;}
</style>
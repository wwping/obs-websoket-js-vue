<!--
 * @Author: your name
 * @Date: 2020-07-26 14:06:43
 * @LastEditTime: 2020-07-26 16:05:32
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
            </div>
        </div>
        <div class="flex-1"></div>
        <div>
            <span>{{$t('df.address')}} : <Input v-model="config.address" size="small" placeholder="地址" class="config-input" /></span>
            <span>{{$t('df.port')}} : <Input v-model="config.port" size="small" placeholder="端口" class="config-input port"/></span>
            <span>{{$t('df.secret')}} : <Input v-model="config.secret" size="small" placeholder="密码" class="config-input port" type="password"/></span>
            <span>
                <Button size="small" type="error" v-if="connecting" @click="disconnect">{{$t('df.unconnect')}}</Button>
                <Button size="small" v-else @click="connect">{{$t('df.connect')}}</Button>
            </span>
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
            config:{
                address:'localhost',
                port:4444,
                secret:'',
            }
        }
    },
    computed:{
        connectText:function(){
            return this.connecting?this.$t("df.connecting"):this.$t("df.unconnecting")
        },
        ...mapState({
            connecting:state => state.connecting,
            connectConfig:state=>state.connectConfig
        })
    },
    mounted(){
        this.config = JSON.parse(JSON.stringify(this.connectConfig));
    },
    methods:{
        connect(){
            msgSubPusher.push('obs-connect')
        },
        disconnect(){
            msgSubPusher.push('obs-disconnect')
        }
    }
}
</script>
<style scoped>
.wrap-title{padding: 0 10px;}
.status.connecting{color: green;font-weight: bold;}
.config-input{width: auto;}
.config-input.port{width: 80px;}
</style>
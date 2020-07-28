<!--
 * @Author: your name
 * @Date: 2020-07-27 11:46:57
 * @LastEditTime: 2020-07-28 16:27:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Setting.vue
--> 
<template>
    <div>
        <div class="setting-wrap">
            <Form ref="formItem" :model="formItem" :rules="formItemRule" :label-width="80">
                <FormItem prop="address" :label="$t('df.address')">
                    <Input v-model="formItem.address" />
                </FormItem>
                <FormItem prop="port" :label="$t('df.port')">
                    <Input v-model="formItem.port" />
                </FormItem>
                <FormItem prop="secret" :label="$t('df.secret')">
                    <Input v-model="formItem.secret" type="password" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formItem')">{{$t('df.save')}}</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
export default {
    name:'Setting',
    data(){
        return {
            formItem:{
                address:'',
                port:'',
                secret:'',
            },
            formItemRule:{}
        }
    },
    computed:{
        ...mapState({
            connect_config:state => state.connect_config,
        })
    },
    mounted(){
        this.formItem = JSON.parse(JSON.stringify(this.connect_config))
    },
    methods:{
        handleSubmit(name){
            this.$store.dispatch('connect_config',this.formItem);

            msgSubPusher.push('obs-disconnect')
            msgSubPusher.push('obs-connect')
        },
    }
}
</script>
<style scoped>
.setting-wrap{width: 300px;margin:20px auto 0 auto;max-width: 80%;}
</style>

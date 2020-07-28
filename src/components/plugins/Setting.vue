<!--
 * @Author: your name
 * @Date: 2020-07-28 10:21:30
 * @LastEditTime: 2020-07-28 13:46:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\plugins\Setting.vue
--> 
<template>
    <div>
        <div class="setting-wrap" v-if="item.name">
            <h3>{{item.text}}</h3>
            <div>
                <Form ref="formValidate"
                      :model="formValidate"
                      :rules="ruleValidate"
                      :label-width="80">
                    <FormItem :label="item.text"
                              prop="name"
                              v-for="(item,key,index) in item.params"
                              :key="index">
                        <span v-if="item.type == 'number'">
                            <InputNumber v-model="formValidate[key]"></InputNumber>
                        </span>
                        <span v-else-if="item.type == 'text'">
                            <Input v-model="formValidate[key]"></Input>
                        </span>
                        <span v-else-if="item.type=='select'">
                            <Select v-model="formValidate[key]">
                                <Option v-for="op in item.options.split('|')"
                                        :value="op"
                                        :key="op">{{ op }}</Option>
                            </Select>
                        </span>
                        <span v-else-if="item.type =='color'">
                            <ColorPicker v-model="formValidate[key]" />
                        </span>
                    </FormItem>
                    <FormItem :label="$t('df.sources')">
                        <Select v-model="source">
                            <Option v-for="op in sources"
                                    :value="op"
                                    :key="op">{{ op }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary"
                                @click="handleSubmit('formValidate')">Submit</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../../lib/msgSubPusher'
export default {
    props: {
        info: {
            type: String,
            default: '{}'
        }
    },
    watch: {
        info (val) {
            this.item = JSON.parse(val);
            
            let json = {};
            for (let j in this.item.params) {
                json[j] = this.item.params[j].default;
            }
            this.formValidate = JSON.parse(JSON.stringify(json));

            this.filterSources();
        },
        current_scene(){
            this.filterSources();
        }
    },
    computed:{
        ...mapState({
            scenes:state => state.scenes,
            current_scene:state => state.current_scene,
        })
    },
    data () {
        return {
            item: {},
            formValidate: {},
            ruleValidate: {},
            source:'',
            sources:[]
        }
    },
    methods: {
        filterSources(){
            let scene = this.scenes.filter(c=>c.name == this.current_scene)[0];
            if(scene){
                this.sources = scene.sources.filter(c=>c.type == 'browser_source').map(c=>c.name);
                return;
            }
            this.sources = [];
        },
        getUrl(){
            let url = new URL(window.location);
            url = `${url.origin}${url.pathname.replace(/\/$/,'')}/static/plugins/${this.item.path}${this.item.name}.html`;

            let params = [];
            for(let j in this.formValidate){
                let val = this.formValidate[j];
                if(j == 'color'){
                    val = val.replace(/#/g,'');
                }
                params.push(`${j}=${val}`);
            }

            return url + '?' + (params.join('&'));
        },
        handleSubmit (name) {
            if(!this.source){
                return;
            }
            
            let settings = {
                width : this.item.size.w,
                height:this.item.size.h,
                is_local_file : false,
                url : this.getUrl(),
                shutdown : true
            };

            msgSubPusher.push('obs-command',{
                cmd:'SetSourceSettings',
                params:{
                    sourceName:this.source,
                    sourceSettings:settings
                },
                callback:(data)=>{}
            })
        }
    }
}
</script>
<style scoped>
.setting-wrap{padding: 20px;}
.setting-wrap h3{font-size: 16px;}
</style>
<!--
 * @Author: your name
 * @Date: 2020-07-28 10:21:30
 * @LastEditTime: 2020-08-05 16:44:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\plugins\Setting.vue
--> 
<template>
    <div>
        <div class="setting-wrap scroll"
             v-if="item.name">
            <h3>{{item.text}}</h3>
            <div>
                <Form ref="formValidate"
                      :model="formValidate"
                      :rules="ruleValidate"
                      :label-width="80">

                    <FormItem :label="item.text"
                              prop="name"
                              v-for="(item,key,index) in item.params"
                              :key="index"
                              :label-width="item.child?0:80">

                        <div v-if="item.child">
                            <Row>
                                <Col v-for="(itemsub,kk,index) in item.child"
                                     :span="24/Object.keys(item.child).length"
                                     :key="index">
                                <FormItem :label="itemsub.text"
                                          prop="name"
                                          :label-width="80">
                                    <span v-if="itemsub.type == 'number'">
                                        <InputNumber v-model="formValidate[kk]"
                                                     style="width:60px"
                                                     :min="itemsub.min === undefined ?-Infinity : itemsub.min"
                                                     :max="itemsub.max || Infinity"
                                                     :step="itemsub.step || 1"></InputNumber>
                                    </span>
                                    <span v-else-if="itemsub.type == 'text'">
                                        <Input v-model="formValidate[kk]"></Input>
                                    </span>
                                    <span v-else-if="itemsub.type=='select'">
                                        <Select v-model="formValidate[kk]">
                                            <Option v-for="(op,index) in itemsub.options.split('|')"
                                                    :value="op"
                                                    :key="index">{{ op }}</Option>
                                        </Select>
                                    </span>
                                    <span v-else-if="item.type =='font'"
                                          filterable
                                          allow-create
                                          @on-create="handleCreateFont">
                                        <Select v-model="formValidate[key]">
                                            <Option v-for="(op,index) in fontFunc(item)"
                                                    :value="op"
                                                    :key="index">{{ op }}</Option>
                                        </Select>
                                    </span>
                                    <span v-else-if="itemsub.type =='color'">
                                        <ColorPicker v-model="formValidate[kk]" />
                                    </span>
                                    <span v-else-if="itemsub.type =='bool'">
                                        <Checkbox v-model="formValidate[kk]"></Checkbox>
                                    </span>
                                </FormItem>
                                </Col>
                            </Row>
                        </div>
                        <div v-else>
                            <span v-if="item.type == 'number'">
                                <InputNumber v-model="formValidate[key]"
                                             :min="itemsub.min === undefined ?-Infinity : itemsub.min"
                                             :max="itemsub.max || Infinity"
                                             :step="itemsub.step || 1"></InputNumber>
                            </span>
                            <span v-else-if="item.type == 'text'">
                                <Input v-model="formValidate[key]"></Input>
                            </span>
                            <span v-else-if="item.type=='select'">
                                <Select v-model="formValidate[key]">
                                    <Option v-for="(op,index) in item.options.split('|')"
                                            :value="op"
                                            :key="index">{{ op }}</Option>
                                </Select>
                            </span>
                            <span v-else-if="item.type=='font'">
                                <Select v-model="formValidate[key]"
                                        filterable
                                        allow-create
                                        @on-create="handleCreateFont">
                                    <Option v-for="(op,index) in fontFunc(item)"
                                            :value="op"
                                            :key="index">{{ op }}</Option>
                                </Select>
                            </span>
                            <span v-else-if="item.type =='color'">
                                <ColorPicker v-model="formValidate[key]" />
                            </span>
                            <span v-else-if="item.type =='bool'">
                                <Checkbox v-model="formValidate[key]">{{item.text}}</Checkbox>
                            </span>
                        </div>
                    </FormItem>
                    <FormItem :label="$t('df.rerender')"
                              v-if="connecting">
                        <Checkbox v-model="shutdown">{{$t('df.obsshutdown')}}</Checkbox>
                    </FormItem>
                    <FormItem :label="'OBS' + $t('df.sources')"
                              v-if="connecting">
                        <Select v-model="source">
                            <Option v-for="op in sources"
                                    :value="op"
                                    :key="op">{{ op }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="url">
                        <Input type="textarea"
                               v-model="url"
                               readonly
                               :autosize="{minRows: 2,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary"
                                @click="handleSubmit('formValidate')">Submit</Button>
                        <Button v-if="isupdate"
                                type="default"
                                @click="update">Update</Button>
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
            if (val) {
                this.item = JSON.parse(val);
                let json = {};
                for (let j in this.item.params) {
                    if (this.item.params[j].child) {
                        for (let jj in this.item.params[j].child) {
                            json[jj] = this.item.params[j].child[jj].default;
                        }
                    } else {
                        json[j] = this.item.params[j].default;
                    }
                }

                this.formValidate = JSON.parse(JSON.stringify(json));

                if (this.item['obssource']) {
                    this.source = this.item['obssource'];
                }
                if (this.item['obsshutdown']) {
                    this.shutdown = this.item['obsshutdown'];
                }

                this.isupdate = this.item['update']

                this.filterSources();
            }

        },
        current_scene () {
            this.filterSources();
        },
        scenes () {
            this.filterSources();
        }
    },
    computed: {
        ...mapState({
            scenes: state => state.scenes,
            current_scene: state => state.current_scene,
            my_plugins: state => state.my_plugins,
            sfonts: state => state.fonts,
            connect_config: state => state.connect_config,
            connecting: state => state.connecting,
        })
    },
    data () {
        return {
            item: {},
            formValidate: {},
            ruleValidate: {},
            source: '',
            sources: [],
            shutdown: true,
            isupdate: false,
            fonts: ['宋体', '新宋体', '黑体', '微软雅黑', '幼圆', '楷体', '隶书', '华文彩云', '华文仿宋', '华文楷体', '华文隶书', '华文隶书', '华文琥珀', '华文宋体', '华文细黑', 'Helvetica', 'Arial', 'sans-serif', 'fantasy'],
            url: ''
        }
    },
    mounted () {
        this.fonts = this.fonts.concat(this.sfonts);
    },
    methods: {
        fontFunc (item) {
            let options = item.options.split('|').concat(this.fonts);
            return options.filter(c => c.length > 0);
        },
        handleCreateFont (val) {
            if (this.fonts.indexOf(val) == -1) {
                this.$store.dispatch('fonts', val);
                this.fonts.push(val)
            }
        },
        filterSources () {
            let scene = this.scenes.filter(c => c.name == this.current_scene)[0];
            if (scene) {
                this.sources = scene.sources.filter(c => c.type == 'browser_source').map(c => c.name);
                return;
            }
            this.sources = [];
        },
        getUrl () {
            let url = new URL(window.location);
            url = `${url.origin}${url.pathname.replace(/\/$/, '')}/static/plugins/${this.item.path}${this.item.name}.html`;

            let params = [`t=${new Date().getTime()}`];
            for (let j in this.formValidate) {
                let val = this.formValidate[j];
                if (typeof val == 'string') {
                    val = val.replace(/^#/, '');
                }
                params.push(`${j}=${val}`);
            }

            for (let j in this.connect_config) {
                params.push(`${j}=${this.connect_config[j]}`);
            }

            params.push(`obssource=${this.source}-${this.item.path}-${this.item.name}`);

            return url + '?' + (params.join('&'));
        },
        getParams () {
            this.url = this.getUrl();
            let settings = {
                width: this.item.size.w,
                height: this.item.size.h,
                is_local_file: false,
                url: this.url,
                shutdown: true
            };

            if (this.item.w) {
                settings.width = this.item.w
            }
            if (this.item.h) {
                settings.height = this.item.h
            }

            if (this.formValidate.width) {
                settings.width = this.formValidate.width;
            }
            if (this.formValidate.height) {
                settings.height = this.formValidate.height;
            }

            let data = JSON.parse(JSON.stringify(this.item));
            for (let j in this.formValidate) {
                let val = this.formValidate[j];
                for (let jj in data.params) {
                    let item = data.params[jj];

                    if (item.child) {
                        for (let jjj in item.child) {
                            if (jjj == j) {
                                item.child[jjj].default = val;
                            }
                        }
                    } else {
                        if (jj == j) {
                            item.default = val;
                        }
                    }
                }

            }
            data['obssource'] = this.source;
            data['obsshutdown'] = this.shutdown;

            this.$store.dispatch('my_plugins', {
                name: data.text + '-' + this.source,
                data: data
            });

            return settings;
        },
        handleSubmit (name) {
            if (!this.source) {
                this.getParams();
                return;
            }

            msgSubPusher.push('obs-command', {
                cmd: 'SetSourceSettings',
                params: {
                    sourceName: this.source,
                    sourceSettings: this.getParams()
                },
                callback: (data) => { }
            });
        },
        update () {
            if (!this.source) {
                return;
            }
            this.getParams();
            msgSubPusher.push('obs-command', {
                cmd: 'BroadcastCustomMessage',
                params: {
                    realm: `plugin-set-${this.source}-${this.item.path}-${this.item.name}`,
                    data: this.formValidate,
                },
                callback: (data) => {
                    console.log(data);
                }
            })
        },
    }
}
</script>
<style scoped>
.setting-wrap{padding: 20px;position: absolute;left: 0;top: 0;right: 0;bottom: 0;overflow: auto;}
.setting-wrap h3{font-size: 16px;}
</style>
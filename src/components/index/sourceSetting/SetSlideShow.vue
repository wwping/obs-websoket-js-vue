<!--
 * @Author: your name
 * @Date: 2020-08-09 13:30:13
 * @LastEditTime: 2020-08-09 16:06:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\index\sourceSetting\Text.vue
-->
<template>
    <div>
        <Modal v-model="visible"
               :title="name"
               :footer-hide="true">
            <div class="inner">
                <Form ref="formValidate"
                      class="add-form"
                      :label-width="0"
                      :model="formValidate"
                      :rules="ruleValidate"
                      @submit.native.prevent>

                    <FormItem :label="$t('sourceSetting.slideshow.playback_behavior')"
                              prop="playback_behavior"
                              :label-width="100">
                        <Select v-model="formValidate.playback_behavior">
                            <Option v-for="(op,index) in playback_behaviors"
                                    :value="op.value"
                                    :key="index">{{ op.text }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('sourceSetting.slideshow.slide_mode')"
                              prop="slide_mode"
                              :label-width="100">
                        <Select v-model="formValidate.slide_mode">
                            <Option v-for="(op,index) in slide_modes"
                                    :value="op.value"
                                    :key="index">{{ op.text }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem :label="$t('sourceSetting.slideshow.transition')"
                              prop="transition"
                              :label-width="100">
                        <Select v-model="formValidate.transition">
                            <Option v-for="(op,index) in transitions"
                                    :value="op.value"
                                    :key="index">{{ op.text }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label=""
                              :label-width="0">
                        <Row>
                            <Col :span="12">
                            <FormItem :label="$t('sourceSetting.slideshow.slide_time')"
                                      prop="slide_time"
                                      :label-width="140">
                                <InputNumber v-model="formValidate.slide_time"></InputNumber> ms
                            </FormItem>
                            </Col>
                            <Col :span="12">
                            <FormItem :label="$t('sourceSetting.slideshow.transition_speed')"
                                      prop="transition_speed"
                                      :label-width="80">
                                <InputNumber v-model="formValidate.transition_speed"></InputNumber> ms
                            </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label=""
                              :label-width="0">
                        <Row>
                            <Col :span="8">
                            <FormItem label=""
                                      prop="loop"
                                      :label-width="80">
                                <Checkbox v-model="formValidate.loop">{{$t('sourceSetting.slideshow.loop')}}</Checkbox>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem label=""
                                      prop="hide"
                                      :label-width="80">
                                <Checkbox v-model="formValidate.hide">{{$t('sourceSetting.slideshow.hide')}}</Checkbox>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem label=""
                                      prop="randomize"
                                      :label-width="80">
                                <Checkbox v-model="formValidate.randomize">{{$t('sourceSetting.slideshow.randomize')}}</Checkbox>
                            </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem :label="$t('sourceSetting.slideshow.files')"
                              prop="files"
                              :label-width="80">
                        <Input type="textarea"
                               :autosize="true"
                               v-model="formValidate.files"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem>
                        <div class="t-c">
                            <Button html-type="submit"
                                    type="success"
                                    :loading="loading"
                                    @click="handleSubmit('formValidate')">{{$t('df.save')}}</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>
<script>
import msgSubPusher from '../../../lib/msgSubPusher'
export default {
    name: 'SetSlideShow',
    props: {
        value: {
            type: Boolean,
            default: false
        },
        name: {
            type: String,
            default: ``
        }
    },
    watch: {
        value (val) {
            this.visible = val;
        },
        visible (val) {
            this.$refs['formValidate'].resetFields();
            this.$emit('on-visible-change', val);
            if (val) {
                msgSubPusher.push('obs-command', {
                    cmd: 'GetSourceSettings',
                    params: { sourceName: this.name },
                    callback: (data) => {
                        console.log(data);
                        this.formValidate.files = (data.sourceSettings.files || []).map(c => c.value).join('\n');
                        this.formValidate.loop = data.sourceSettings.loop || true;
                        this.formValidate.playback_behavior = data.sourceSettings.playback_behavior || 'always_play';
                        this.formValidate.randomize = data.sourceSettings.randomize || false;
                        this.formValidate.slide_mode = data.sourceSettings.slide_mode || 'mode_auto';
                        this.formValidate.slide_time = data.sourceSettings.slide_time || 8000;
                        this.formValidate.transition = data.sourceSettings.transition || 'fade';
                        this.formValidate.transition_speed = data.sourceSettings.transition_speed || 700;
                        this.formValidate.use_custom_size = data.sourceSettings.use_custom_size || '自动';
                    }
                })
            }
        }
    },
    data () {
        return {
            visible: this.value,
            loading: false,
            formValidate: {
                loop: true,
                hide: false,
                playback_behavior: 'always_play', //always_play stop_restart pause_unpause
                randomize: false,
                slide_mode: 'mode_auto', //mode_auto  mode_manual
                slide_time: 8000,
                transition: '',//cut fade swipe slide
                transition_speed: 700,
                use_custom_size: '自动', //16:9  16:10  4:3  1:1  1920:1080
                files: ''
            },
            ruleValidate: {},
            playback_behaviors: [
                { value: 'always_play', text: '一直播放' },
                { value: 'stop_restart', text: '不可见时停止，可见时重新播放' },
                { value: 'pause_unpause', text: '不可见时暂定，可见时取消暂停' },
            ],
            slide_modes: [
                { value: 'mode_auto', text: '自动' },
                { value: 'mode_manual', text: '使用热键控制' },
            ],
            transitions: [
                { value: 'cut', text: '剪切' },
                { value: 'fade', text: '淡出' },
                { value: 'swipe', text: '滑出' },
                { value: 'slide', text: '幻灯片' },
            ]
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return false;
                }
                let json = JSON.parse(JSON.stringify(this.formValidate));
                json.files = json.files.split('\n').filter(c => c && c.length > 0).map(c => {
                    return { hidden: false, selected: false, value: c.replace(/\\/g, '/') }
                });
                this.loading = true;
                msgSubPusher.push('obs-command', {
                    cmd: 'SetSourceSettings',
                    params: { sourceName: this.name, sourceSettings: json },
                    callback: (data) => {
                        this.loading = false;
                        this.visible = false;
                    }
                })
            });
        }
    }
}
</script>
<style scoped>

</style>
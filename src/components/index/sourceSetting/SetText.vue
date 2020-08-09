<!--
 * @Author: your name
 * @Date: 2020-08-09 13:30:13
 * @LastEditTime: 2020-08-09 14:41:53
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
                    <FormItem :label="$t('sourceSetting.text.text')"
                              prop="text"
                              :label-width="80">
                        <Input type="textarea"
                               :autosize="true"
                               v-model="formValidate.text"
                               placeholder=""></Input>
                    </FormItem>
                    <FormItem label=""
                              :label-width="0">
                        <Row>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.color')"
                                      prop="color"
                                      :label-width="80">
                                <ColorPicker v-model="formValidate.color" />
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.fontsize')"
                                      prop="font.size"
                                      :label-width="80">
                                <InputNumber v-model="formValidate.font.size"
                                             :min="0"
                                             :max="256"
                                             :step="1"></InputNumber>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.opacity')"
                                      prop="opacity"
                                      :label-width="80">
                                <InputNumber v-model="formValidate.opacity"
                                             :min="0"
                                             :max="100"
                                             :step="1"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label=""
                              :label-width="0">
                        <Row>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.outline')"
                                      prop="outline"
                                      :label-width="80">
                                <Checkbox v-model="formValidate.outline"></Checkbox>
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.outline_color')"
                                      prop="outline_color"
                                      :label-width="80">
                                <ColorPicker v-model="formValidate.outline_color" />
                            </FormItem>
                            </Col>
                            <Col :span="8">
                            <FormItem :label="$t('sourceSetting.text.outline_size')"
                                      prop="outline_size"
                                      :label-width="80">
                                <InputNumber v-model="formValidate.outline_size"
                                             :min="0"
                                             :max="100"
                                             :step="1"></InputNumber>
                            </FormItem>
                            </Col>
                        </Row>
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
    name: 'SetText',
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
                        this.formValidate.text = data.sourceSettings.text || '';
                        this.formValidate.outline = data.sourceSettings.outline || 0;
                        if (data.sourceSettings.outline_color) {
                            this.formValidate.outline_color = '#' + data.sourceSettings.outline_color.toString(16).substring(2).split(/(.{2})/).reverse().join('');
                        }

                        this.formValidate.outline_size = data.sourceSettings.outline_size || 0;
                        this.formValidate.opacity = data.sourceSettings.opacity || 100;
                        if (data.sourceSettings.font && data.sourceSettings.font.size) {
                            this.formValidate.font.size = data.sourceSettings.font.size;
                        }
                        if (data.sourceSettings.color) {
                            this.formValidate.color = '#' + data.sourceSettings.color.toString(16).substring(2).split(/(.{2})/).reverse().join('');
                        }
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
                text: '',
                outline: false,
                outline_color: '#fff',
                outline_size: 0,
                opacity: 100,
                color: '#fff',
                font: {
                    size: 256
                }
            },
            ruleValidate: {},
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return false;
                }
                let json = JSON.parse(JSON.stringify(this.formValidate));
                json.color = parseInt('ff' + json.color.substring(1).split(/(.{2})/).reverse().join(''), 16);
                json.outline_color = parseInt('ff' + json.outline_color.substring(1).split(/(.{2})/).reverse().join(''), 16);
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
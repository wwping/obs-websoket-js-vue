<!--
 * @Author: your name
 * @Date: 2020-08-09 13:30:13
 * @LastEditTime: 2020-08-09 15:02:21
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
                    <FormItem :label="$t('sourceSetting.image.file')"
                              prop="text"
                              :label-width="80">
                        <Input v-model="formValidate.file"
                               placeholder=""></Input>
                        <!-- <Button @click="selectFile">选择文件</Button> -->
                    </FormItem>
                    <FormItem label=""
                              prop="unload"
                              :label-width="80">
                        <Checkbox v-model="formValidate.unload">{{$t('sourceSetting.image.unload')}}</Checkbox>
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
            <input type="file"
                   id="files"
                   style="display: none"
                   @change="fileImport($event)"
                   ref="upload">
        </Modal>
    </div>
</template>
<script>
import msgSubPusher from '../../../lib/msgSubPusher'
export default {
    name: 'SetImage',
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
                        this.formValidate.file = data.sourceSettings.file;
                        this.formValidate.unload = data.sourceSettings.unload;
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
                file: '',
                unload: false
            },
            ruleValidate: {},
        }
    },
    methods: {
        selectFile () {
            this.$refs.upload.click();
        },
        fileImport (event) {
            const reader = new FileReader();
            reader.onload = () => {
                this.formValidate.file = reader.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (!valid) {
                    return false;
                }
                let json = JSON.parse(JSON.stringify(this.formValidate));
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
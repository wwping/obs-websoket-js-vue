/*
 * @Author: your name
 * @Date: 2020-07-26 15:12:43
 * @LastEditTime: 2020-07-26 19:42:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\lang\i18n.js
 */
import Vue from 'vue'
import I18n from 'vue-i18n'
import zh from './zh'
import en from './en'
import iviewEn from 'view-design/dist/locale/en-US'
import iviewZh from 'view-design/dist/locale/zh-CN'

Vue.use(I18n)
const messages = {
    en: Object.assign(en, iviewEn),
    zh: Object.assign(zh, iviewZh)
}

function getLocal () {
    let lang = localStorage.getItem('local') || 'zh';
    if (Vue.env && Vue.env.language) {
        lang = Vue.env.language
    }
    return lang
}

const i18n = new I18n({
    locale: getLocal(),
    messages
})

export default i18n
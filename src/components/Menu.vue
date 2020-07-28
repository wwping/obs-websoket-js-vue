<!--
 * @Author: your name
 * @Date: 2020-07-27 22:47:03
 * @LastEditTime: 2020-07-27 23:13:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Menu.vue
--> 
<template>
    <div>
        <div class="menu-bar">
            <Menu mode="horizontal" :active-name="$route.name">
                <MenuItem name="Index" :to="{name:'Index'}">{{$t('df.manager')}}</MenuItem>
                <MenuItem name="Setting" :to="{name:'Setting'}">{{$t('df.setting')}}</MenuItem>
                <MenuItem name="Plugins" :to="{name:'Plugins'}">{{$t('df.plugins')}}</MenuItem>
            </Menu>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
        }
    }
}
</script>
<style >
.menu-bar .ivu-menu-horizontal{height: 36px; line-height: 36px;}
</style>
<!--
 * @Author: your name
 * @Date: 2020-07-26 14:57:31
 * @LastEditTime: 2020-07-27 17:55:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Manager.vue
--> 
<template>
    <div>
        <div class="wrap-manager flex-display">
            <div class="scenes flex-1">
                <h3>{{$t('df.scenes')}}</h3>
                <div class="cont scroll">
                    <Scenes></Scenes>
                </div>
            </div>
            <div class="sources flex-1">
                <h3>{{$t('df.sources')}}</h3>
                <div class="cont scroll">
                    <Sources></Sources>
                </div>
            </div>
            <div class="sounds flex-1">
                <h3>{{$t('df.sounds')}}</h3>
                <div class="cont scroll">
                    <Sounds></Sounds>
                </div>
            </div>
            <div class="transtions flex-1">
                <h3>{{$t('df.transtions')}}</h3>
                <div class="cont scroll transition">
                    <Transtions></Transtions>
                </div>
            </div>
            <div class="contrls flex-1">
                <h3>{{$t('df.controls')}}</h3>
                <div class="cont scroll">
                    <Controls></Controls>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Controls from './Controls'
import Scenes from './Scenes'
import Sources from './Sources'
import Transtions from './Transtions'
import Sounds from './Sounds'

export default {
    components:{Controls,Scenes,Sources,Transtions,Sounds}
}
</script>
<style scoped>
.wrap-manager{border-top: 1px solid #ddd;}
.wrap-manager>div{width: 20%;border-left: 1px solid #eee;}
.wrap-manager>div:nth-child(1){border-left: 0;}
.wrap-manager>div>h3{padding:6px;border-bottom: 1px solid #eee;font-size: 14px;background-color: rgba(0,0,0,0.03);}
.wrap-manager>div>.cont{height: 160px;overflow: auto;}

@media screen and (max-width:768px) {
    .wrap-manager>div{width: 50%;border-bottom: 1px solid #eee;}
    .wrap-manager>div:nth-child(2n-1){border-left: 0;}
    .wrap-manager>div:last-child{border-bottom: 0;}
}
@media screen and (max-width:400px) {
    .wrap-manager>div{width: 100%;border-bottom: 1px solid #eee;border-left: 0;}
    .wrap-manager>div:last-child{border-bottom: 0;}
}
</style>
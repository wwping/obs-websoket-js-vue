<!--
 * @Author: your name
 * @Date: 2020-07-27 22:39:41
 * @LastEditTime: 2020-07-28 17:07:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\Plugins.vue
--> 
<template>
    <div>
        <div class="plugins-wrap">
            <Split v-model="split">
                <div slot="left">
                    <ul class="flex-display">
                        <li v-for="(item,index) in pluginsPage"
                            :key="index" @click="select(item)">
                            <dl>
                                <dt>
                                    <img :src="path + item.path + item.preview">
                                </dt>
                                <dd>
                                    <h3>
                                        <span>{{item.text}}-{{item.obssource}}</span>
                                        <a href="javascript:;" style="color:red;" @click="del(item)"><Icon type="ios-trash" /></a>
                                    </h3>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                    <div class="pages t-c">
                        <Page :total="total"
                              show-total
                              :current="pageIndex"
                              :page-size="pageSize"
                              @on-change="(page)=>pageIndex=page" />
                    </div>
                </div>
                <div slot="right">
                    <Setting :info="info"></Setting>
                </div>
            </Split>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import Setting from '../components/plugins/Setting'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    data () {
        return {
            pageIndex: 1,
            pageSize: 6,
            split: 0.6,
            path: './static/plugins/',
            info:'',
            total:0
        }
    },
    components:{Setting},
    computed: {
        pluginsPage () {
            
            let min = (this.pageIndex - 1) * this.pageSize;
            let max = min + this.pageSize;

            let keys = Object.keys(this.my_plugins);
            this.total = keys.length;

            keys = keys.filter((c, i) => i >= min && i < max);

            let res = [];
            for(let i = 0; i < keys.length; i++){
                res.push(this.my_plugins[keys[i]]);
            }
            return res;
        },
        ...mapState({
            my_plugins:state => state.my_plugins,
        })
    },
    mounted () {
    },
    methods:{
        select(item){
            this.info = JSON.stringify(item);
        },
        del(item){
            this.$store.dispatch('del_plugin',item.text + '-' + item.obssource);
        }
    }
}
</script>
<style scoped>
.plugins-wrap{height: 600px;}

ul{padding: 10px;}
ul li{width: 50%;padding: 6px;}
ul li dl{border: 1px solid #eee;transition: .3s;}
ul li dl:hover{box-shadow: 1px 1px 4px rgba(0,0,0,0.1);cursor: pointer;}
ul li dt{overflow-x:hidden;text-align: center;}
ul li img{height: 120px;}
dd h3{font-size: 13px;padding: 0 6px 6px 6px;}
</style>
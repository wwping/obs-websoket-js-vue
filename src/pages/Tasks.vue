<!--
 * @Author: your name
 * @Date: 2020-07-31 16:24:00
 * @LastEditTime: 2020-08-03 20:18:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\pages\Tasks.vue
--> 
<template>
    <div>
        <div class="wrap">

            <Split v-model="split">
                <div slot="left">
                    <div class="tasks">
                        <div class="head flex-display">
                            <Button @click="isNew = true" type="default" size="small">{{$t('df.newTask')}}</Button>
                            <span class="flex-1"></span>
                            <Button type="info" size="small" @click="saveTask">{{$t('df.saveTask')}}</Button>
                            <span class="flex-1"></span>
                            <Button @click="runCode" type="success" size="small">{{$t('df.excuteTask')}}</Button>
                        </div>
                        <ul class="list scroll">
                            <li v-for="(item,index) in tasks" :key="index" class="flex-display" :class="{current:item.id == currentid}" @click="select(item)">
                                <span class="name">{{item.name}}</span>
                                <span class="flex-1"></span>
                                <span class="time">{{item.time}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div slot="right">
                    <div id="blockly-wrap">
                        <div id="blockly"></div>
                    </div>
                </div>
            </Split>
        </div>
        <Modal
            v-model="isNew"
            :title="$t('df.newTask')"
            @on-ok="submitNew">
            <Input v-model="newName" :placeholder="$t('df.taskName')"/>
        </Modal>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import msgSubPusher from '../lib/msgSubPusher'
import Blocklys from '../components/tasks/blockly'
import Runtime from '../components/tasks/runtime'
import Dexie from 'dexie'
import '../components/tasks/blocks'
import '../components/tasks/jsvascript'
export default {
    name:'Tasks',
    computed:{
        ...mapState({
            store_taks:state => state.tasks,
        })
    },
    data(){
        return {
            split:0.3,
            blocklys:null,
            newName:'',
            isNew:false,
            tasksdb:null,
            runtime:null,
            tasks:[],
            currentid:0
        }
    },
    mounted(){
        this.blocklys = new Blocklys();
        this.runtime = new Runtime();
        
        this.initdb();
    },
    methods:{
        // blockly 
        runCode(){
            let code = Blockly.JavaScript.workspaceToCode(this.blocklys.workspace).split('\n').filter(c=>c.indexOf('onStart') > 0)[0];
            code = JSON.parse('[' + code + ']');
            this.runtime.run(code,this.highlightBlock);
        },
        getDom(){
            return Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.blocklys.workspace));
        },
        highlightBlock(id){
            if(id){
                this.blocklys.workspace.highlightBlock(id);
            }
        },

        // tasks 
        initdb(){
            this.tasksdb = new Dexie("tasksdb");
            this.tasksdb.version(1).stores({ tasks: "++id,name,time,xml" });
            //this.tasksdb.tasks.clear();
            this.getTasks();
        },
        getTasks(){
            this.tasksdb.tasks.toArray().then((data)=>{
                this.tasks = data;
                if(this.tasks.length > 0){
                    this.select(this.tasks[0]);
                }
            })
        },
        select(item){
            this.currentid = item.id;
            this.blocklys.init('blockly',item.xml);
            this.blocklys.init('blockly',item.xml);
        },
        saveTask(){
            this.tasksdb.tasks.where("id").equals(this.currentid).modify(value=>{
                value.xml = this.getDom();
                this.$Message.success(this.$t('df.saveSuccess'));
            });
        },
        submitNew(){
            if(this.newName){
                let d = new Date();
                let time = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
                this.tasksdb.tasks.add({name:this.newName,time:time,xml:''}).then(()=>{
                    this.getTasks();
                })
            }
        }
    }
}
</script>
<style>
.blocklyMainBackground{stroke: none;}
</style>
<style scoped>
.wrap{height: 500px;}
.head{padding: 10px;border-bottom: 1px solid #eee;}
#blockly{width: 100%; height: 500px;position: relative;}

.list{max-height: 455px;
    overflow: auto;}
.list li{padding: 10px 6px;cursor: pointer;}
.list li:hover,.list li.current{background-color: rgba(0,0,0,0.05);}
</style>

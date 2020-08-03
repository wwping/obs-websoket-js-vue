/*
 * @Author: your name
 * @Date: 2020-07-26 13:51:17
 * @LastEditTime: 2020-08-03 15:22:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\store\index.js
 */ 
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        connecting:false,
        streaming:false,
        recording:false,
        record_paused:false,
        connect_config:JSON.parse(localStorage.getItem('connect_config') || JSON.stringify({
            address:'127.0.0.1',
            port:4444,
            secret:''
        })),
        scenes:[],
        current_scene:'',
        transitions:[],
        current_transition:'',
        transition_duration:0,
        sounds:[],
        my_plugins:JSON.parse(localStorage.getItem('my_plugins') || JSON.stringify({})),
        fonts:JSON.parse(localStorage.getItem('fonts') || JSON.stringify([])),
        tasks:JSON.parse(localStorage.getItem('tasks') || JSON.stringify({})),
        opens:JSON.parse(localStorage.getItem('opens') || JSON.stringify({})),
        special_sources:[],
        audio_types:[],
    },
    getters: {
        transitionDuration:(state)=>()=>{
            return state.transition_duration;
        }
    },
    mutations: {
        connecting:(state,boolVal) =>state.connecting = boolVal,
        streaming:(state,boolVal)=>state.streaming = boolVal,
        recording:(state,boolVal)=>state.recording = boolVal,
        record_paused:(state,boolVal)=>state.record_paused = boolVal,
        scenes:(state,arrayVal)=>state.scenes = JSON.parse(JSON.stringify(arrayVal)),
        current_scene:(state,strVal)=>state.current_scene = strVal,
        transitions:(state,arrayVal)=>state.transitions = arrayVal,
        current_transition:(state,strVal)=>state.current_transition = strVal,
        transition_duration:(state,numberVal)=>state.transition_duration = numberVal,
        sounds:(state,arrayVal)=>state.sounds = JSON.parse(JSON.stringify(arrayVal)),
        connect_config:(state,jsonVal)=>{
            state.connect_config = JSON.parse(JSON.stringify(jsonVal));
            localStorage.setItem('connect_config',JSON.stringify(jsonVal));
        },
        my_plugins:(state,jsonVal)=>{
            state.my_plugins[jsonVal.name] = jsonVal.data;
            state.my_plugins = JSON.parse(JSON.stringify(state.my_plugins));
            localStorage.setItem('my_plugins',JSON.stringify(state.my_plugins));
        },
        del_plugin:(state,jsonVal)=>{
            delete state.my_plugins[jsonVal];
            state.my_plugins = JSON.parse(JSON.stringify(state.my_plugins));
            localStorage.setItem('my_plugins',JSON.stringify(state.my_plugins));
        },
        fonts:(state,strVal)=>{
            if(state.fonts.indexOf(strVal) == -1){
                state.fonts.push(strVal);
            }
            state.fonts = JSON.parse(JSON.stringify(state.fonts));
            localStorage.setItem('fonts',JSON.stringify(state.fonts));
        },
        tasks:(state,jsonVal)=>{
            state.tasks[jsonVal.name] = jsonVal;
            localStorage.setItem('tasks',JSON.stringify(state.tasks));
        },
        opens:(state,jsonVal)=>{
            state.opens[jsonVal.name] = jsonVal.val;
            state.opens = JSON.parse(JSON.stringify(state.opens));
            localStorage.setItem('opens',JSON.stringify(state.opens));
        },
        special_sources:(state,arrayVal)=>state.special_sources = JSON.parse(JSON.stringify(arrayVal)),
        audio_types:(state,arrayVal)=>state.audio_types = JSON.parse(JSON.stringify(arrayVal)),
    },
    actions: {
        connecting:(context,boolVal) =>context.commit("connecting",boolVal),
        streaming:(context,boolVal) =>context.commit("streaming",boolVal),
        recording :(context,boolVal) =>context.commit("recording",boolVal),
        record_paused :(context,boolVal) =>context.commit("record_paused",boolVal),
        scenes :(context,arrayVal) =>context.commit("scenes",arrayVal),
        current_scene :(context,strVal) =>context.commit("current_scene",strVal),
        transitions :(context,arrayVal) =>context.commit("transitions",arrayVal),
        current_transition :(context,strVal) =>context.commit("current_transition",strVal),
        transition_duration :(context,numberVal) =>context.commit("transition_duration",numberVal),
        sounds :(context,arrayVal) =>context.commit("sounds",arrayVal),
        connect_config :(context,jsonVal) =>context.commit("connect_config",jsonVal),
        my_plugins :(context,jsonVal) =>context.commit("my_plugins",jsonVal),
        del_plugin :(context,strVal) =>context.commit("del_plugin",strVal),
        fonts :(context,strVal) =>context.commit("fonts",strVal),
        tasks :(context,jsonVal) =>context.commit("tasks",jsonVal),
        opens :(context,jsonVal) =>context.commit("opens",jsonVal),
        special_sources :(context,arrayVal) =>context.commit("special_sources",arrayVal),
        audio_types :(context,arrayVal) =>context.commit("audio_types",arrayVal),
        
    }
});

export default store;
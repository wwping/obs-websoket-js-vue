/*
 * @Author: your name
 * @Date: 2020-08-03 13:14:28
 * @LastEditTime: 2020-08-03 17:45:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\tasks\jsvascript.js
 */
Blockly.JavaScript['onStart'] = function (block) {
    return `["onStart","${block.id}",[]]`;
};
Blockly.JavaScript['repeat'] = function (block) {
    const value_num = Blockly.JavaScript.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ATOMIC);
    let  child      = Blockly.JavaScript.statementToCode(block, 'child');
    if(child && child.length > 0){
        child =  child.replace(/^\s{1,}|\s{1,}$/g,'').replace(/^,|,$/g,'');
    }
    return `,["repeat","${block.id}",[${value_num}],[${child}]]`;
};

Blockly.JavaScript['print'] = function (block) {
    return `,["print","${block.id}"]`;
};



Blockly.JavaScript['delay'] = function (block) {
    const value_num = block.getFieldValue('time');
    return `,["delay","${block.id}",[${value_num}]]`;
};


Blockly.JavaScript['changeScene'] = function(block) {
    const scene = block.getFieldValue('scene');
    return `,["changeScene","${block.id}",["${scene}"]]`;
};

Blockly.JavaScript['changeTransition'] = function(block) {
    const transition = block.getFieldValue('transition');
    return `,["changeTransition","${block.id}",["${transition}"]]`;
};

Blockly.JavaScript['changeDuration'] = function(block) {
    const duration = block.getFieldValue('duration');
    return `,["changeDuration","${block.id}",[${duration}]]`;
};


Blockly.JavaScript['sourceVisible'] = function(block) {
    const scene = block.getFieldValue('scene');
    const sound = block.getFieldValue('sound');
    const visible = block.getFieldValue('visible');
    return `,["sourceVisible","${block.id}",["${scene}","${sound}","${visible}"]]`;
};

Blockly.JavaScript['sourceMuted'] = function(block) {
    const scene = block.getFieldValue('scene');
    const sound = block.getFieldValue('sound');
    const unmuted = block.getFieldValue('unmuted');
    return `,["sourceMuted","${block.id}",["${scene}","${sound}",${unmuted}]]`;
};

Blockly.JavaScript['sourceVolume'] = function(block) {
    const scene = block.getFieldValue('scene');
    const sound = block.getFieldValue('sound');
    const volume = block.getFieldValue('volume');
    return `,["sourceVolume","${block.id}",["${scene}","${sound}",${volume}]]`;
};



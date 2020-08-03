/*
 * @Author: your name
 * @Date: 2020-08-03 13:14:01
 * @LastEditTime: 2020-08-03 20:27:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\tasks\blocks.js
 */
import store from '../../store'
import i18n from '../../lang/i18n'

Blockly.Blocks['onStart'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(i18n.t('blockly.whenRun'));
        this.setNextStatement(true, null);
        this.setColour('#e69303');
        this.setTooltip('');
        this.setHelpUrl('');
        this.deletable_ = false;
        this.movable_ = false;
    }
};


Blockly.Blocks['repeat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(i18n.t('blockly.repeat'));
        this.appendValueInput("num")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField(i18n.t('blockly.times'));
        this.appendStatementInput("child")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#cd2377');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['print'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("打印");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#cd2377');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['delay'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(i18n.t('blockly.delay'))
          .appendField(new Blockly.FieldNumber(1000, 0, 9999999), "time").appendField("ms");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour('#cd2377');
      this.setTooltip('');
      this.setHelpUrl('http://www.example.com/');
    }
  };

Blockly.Blocks['changeScene'] = {
    init: function() {

        let options = store.state.scenes.map(c=>{
            return [c.name,c.name];
        }) ;
        if(options.length == 0){
            options = [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]]
        }

        this.appendDummyInput()
            .appendField(`${i18n.t('blockly.scene')} ${i18n.t('blockly.set2')}`)
            .appendField(new Blockly.FieldDropdown(options), "scene");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Blocks['changeTransition'] = {
    init: function() {

        let options = store.state.transitions.map(c=>{
            return [c.name,c.name];
        }) ;
        if(options.length == 0){
            options = [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]]
        }

        this.appendDummyInput()
            .appendField(i18n.t('blockly.changeTransitionTo'))
            .appendField(new Blockly.FieldDropdown(options), "transition");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};


Blockly.Blocks['changeDuration'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(i18n.t('blockly.changeTransitionDurationTo'))
            .appendField(new Blockly.FieldNumber(store.state.transition_duration, 0, 99999), "duration")
            .appendField("ms");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};


var sourceVisible_sources = [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]];
const sourceValidate = (newValue)=>{
    let scene =  store.state.scenes.filter(c=>c.name == newValue)[0];
    if(scene){
        sourceVisible_sources =  scene.sources.map(c=>{
            return [c.name,c.name];
        });
    }else{
        sourceVisible_sources =  [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]];
    }
    return newValue;
}
Blockly.Blocks['sourceVisible'] = {
    validate:sourceValidate,
    init: function() {
        this.appendDummyInput()
            .appendField(i18n.t('blockly.scene') + ':')
            .appendField(new Blockly.FieldDropdown(()=>{
                let scenes = store.state.scenes.map(c=>{
                    return [c.name,c.name];
                }) ;
                scenes.splice(0,0,[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]);
                return scenes;
            },this.validate), "scene")
            .appendField(i18n.t('blockly.source')+":")
            .appendField(new Blockly.FieldDropdown(()=>{
                return sourceVisible_sources;
            }), "source")
            .appendField(i18n.t('blockly.set2'))
            .appendField(new Blockly.FieldDropdown([[i18n.t('blockly.hidden'), "hidden"], [i18n.t('blockly.show'), "show"],[i18n.t('blockly.lock'), "lock"], [i18n.t('blockly.unlock'), "unlock"]]), "visible");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};





var sourceVisible_sounds = [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]];
const soundValidate = (newValue)=>{
    let currentSources = store.state.scenes.filter(c => c.name == newValue)[0];
        if(currentSources){
            let allAudios = currentSources.sources.filter(c => store.state.audio_types.indexOf(c.type) >= 0 && c.render == true).map(c => c.name);
            allAudios = allAudios.concat(store.state.special_sources);

            sourceVisible_sounds =  allAudios.map(c=>{
                return [c,c];
            });
        }else{
            sourceVisible_sounds =  [[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]];
        }
        return newValue;
}
Blockly.Blocks['sourceMuted'] = {
    validate:soundValidate,
    init: function() {

        this.appendDummyInput()
            .appendField(i18n.t('blockly.scene') + ':')
            .appendField(new Blockly.FieldDropdown(()=>{
                let scenes = store.state.scenes.map(c=>{
                    return [c.name,c.name];
                }) ;
                scenes.splice(0,0,[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]);
                return scenes;
            },this.validate), "scene")
            .appendField(i18n.t('blockly.sound')+":")
            .appendField(new Blockly.FieldDropdown(()=>{
                return sourceVisible_sounds;
            }), "sound")
            .appendField(i18n.t('blockly.set2'))
            .appendField(new Blockly.FieldDropdown([[i18n.t('blockly.muted'), "1"], [i18n.t('blockly.unmuted'), "0"]]), "unmuted");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};

Blockly.Blocks['sourceVolume'] = {
    validate:soundValidate,
    init: function() {
        this.appendDummyInput()
            .appendField(i18n.t('blockly.scene') + ':')
            .appendField(new Blockly.FieldDropdown(()=>{
                let scenes = store.state.scenes.map(c=>{
                    return [c.name,c.name];
                }) ;
                scenes.splice(0,0,[i18n.t('blockly.pleaseSelect'),i18n.t('blockly.pleaseSelect')]);
                return scenes;
            },this.validate), "scene")
            .appendField(i18n.t('blockly.sound')+":")
            .appendField(new Blockly.FieldDropdown(()=>{
                return sourceVisible_sounds;
            }), "sound")
            .appendField(i18n.t('blockly.volume'))
            .appendField(i18n.t('blockly.set2'))
            .appendField(new Blockly.FieldNumber(0.5, 0, 99999), "volume");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(65);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};



Blockly.Blocks['startRecord'] = {
    init: function() {

        this.appendDummyInput()
            .appendField(i18n.t('blockly.startRecord'))
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['stopRecord'] = {
    init: function() {

        this.appendDummyInput()
            .appendField(i18n.t('blockly.stopRecord'))
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['pauseRecord'] = {
    init: function() {

        this.appendDummyInput()
            .appendField(i18n.t('blockly.pauseRecord'))
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
Blockly.Blocks['resumeRecord'] = {
    init: function() {

        this.appendDummyInput()
            .appendField(i18n.t('blockly.resumeRecord'))
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('http://www.example.com/');
    }
};
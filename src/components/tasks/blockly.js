/*
 * @Author: your name
 * @Date: 2020-08-03 13:07:35
 * @LastEditTime: 2020-08-07 19:03:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \obs\src\components\tasks\blockly.js
 */
import i18n from '../../lang/i18n'
export default class Blocklys {
    constructor() {
        // Blockly.BlockSvg.START_HAT = true;
        this.workspace = null;
    }
    init (elem, xml) {
        document.getElementById(elem).innerHTML = '';

        let blocks = [
            `<category name="${i18n.t('blockly.event')}" colour="#e69303">`
            , `<block type="onTransition"></block>`
            , `<block type="onTransitionEnd"></block>`
            , `<block type="onTransitionVideoEnd"></block>`
            , `</category>`
            , `<category name="${i18n.t('blockly.control')}" colour="#cd2377">`
            , `<block type="repeat"><value name='num'><shadow type='math_number'><field name='NUM'>1</field></shadow></value></block>`
            , `<block type="delay"></block>`
            , `<block type="print"></block>`
            , `</category>`
            , `<category name="${i18n.t('blockly.scene')}" colour="120">`
            , `<block type="changeScene"></block>`
            , `<block type="changeTransition"></block>`
            , `<block type="changeDuration"></block>`
            , `<block type="waitTransition"></block>`
            , `</category>`
            , `<category name="${i18n.t('blockly.source')}" colour="65">`
            , `<block type="sourceVisible"></block>`
            , `<block type="sourceMuted"></block>`
            , `<block type="sourceVolume"></block>`
            , `</category>`
            , `<category name="${i18n.t('blockly.record')}" colour="230">`
            , `<block type="startRecord"></block>`
            , `<block type="stopRecord"></block>`
            , `<block type="pauseRecord"></block>`
            , `<block type="resumeRecord"></block>`
            , `</category>`
        ]

        this.workspace = Blockly.inject(elem, {
            media: 'static/blockly/media/',
            scrollbars: true,
            horizontalLayout: false,
            toolboxPosition: 'start',
            trashcan: false,
            disable: false,
            toolbox: `<xml>${blocks.join('')}</xml>`,
            grid: {
                spacing: 10,
                length: 1,
                colour: '#d0ead1'
            },
            zoom: {
                controls: true,
                scaleSpeed: 1.2
            }
        });

        if (xml) {
            this.xmlToWorkspace(xml);
        } else {
            this.xmlToWorkspace(`<xml xmlns="http://www.w3.org/1999/xhtml"><block type="onStart" x="10" y="10"></block></xml>`);
        }
    }
    xmlToWorkspace (xml) {
        this.workspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
    }
    resize () {
        Blockly.svgResize(this.workspace);
    }
}
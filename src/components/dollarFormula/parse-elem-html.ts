/**
 * @description parse elem html
 */

import {Descendant, Text} from 'slate'
import {DOMElement} from '../formular/utils/dom'
import {IDomEditor, SlateDescendant, SlateElement} from '@wangeditor/editor'
import {FormulaElement} from './custom-types'

function parseHtml(
    elem: DOMElement,
    children: SlateDescendant[],
    editor: IDomEditor
): SlateElement {
    // const $elem = $(elem)

    // children = children.filter(child => {
    //     if (Text.isText(child)) return true
    //     // if (editor.isInline(child)) return true
    //     return false
    // })
    //
    // // 无 children ，则用纯文本
    // if (children.length === 0) {
    //     children = [{text: $elem.text().replace(/\s+/gm, ' ')}]
    // }

    return {
        type: 'block-formula',
        children // void node 必须有一个空白 text
    } as FormulaElement
}

const parseHtmlConf = {
    selector: 'block-formula',
    parseElemHtml: parseHtml,
}

export default parseHtmlConf

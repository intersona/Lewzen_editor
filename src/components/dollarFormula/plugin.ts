/**
 * @description formula plugin
 * @author wangfupeng
 */

import {Editor, Transforms, Node, Point} from 'slate'
import {IDomEditor, DomEditor} from '@wangeditor/core'

function withBlockFormula<T extends IDomEditor>(editor: T) {
    const {insertBreak, insertText} = editor
    const newEditor = editor


    // 重写 insertBreak - 换行时插入 p
    newEditor.insertBreak = () => {
        // console.log('insertBreak')
        const {selection} = newEditor
        if (selection == null) return insertBreak()

        const [nodeEntry] = Editor.nodes(editor, {
            match: n => DomEditor.checkNodeType(n, 'block-formula'),
            universal: true,
        })
        if (!nodeEntry) {
            return insertBreak()
        }
        else {
            const p = {type: 'paragraph', children: [{text: ''}]}
            Transforms.insertNodes(newEditor, p, {mode: 'highest'})
            return
        }

    }

    return newEditor
}

export default withBlockFormula

/**
 * @description render elem
 */

import { h, VNode } from 'snabbdom'
import { DomEditor, IDomEditor, SlateElement } from '@wangeditor/editor'
import { FormulaElement } from './custom-types'

function renderFormula(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {
  // 当前节点是否选中
  const selected = DomEditor.isNodeSelected(editor, elem)

  // 构建 formula vnode
  const { value = '' } = elem as FormulaElement
  const formulaVnode = h(
    'formula-box',
    {
      dataset: { value },
    },
    null
  )

  // 构建容器 vnode
  const containerVnode = h(
    'div',
    {
      props: {
        contentEditable: false, // 不可编辑
      },
      style: {
        display: 'inline-block', // inline
        marginLeft: '3px',
        marginRight: '3px',
        border: selected // 选中/不选中，样式不一样
          ? '2px solid var(--w-e-textarea-selected-border-color)'
          : '2px solid transparent',
        borderRadius: '3px',
        padding: '3px 3px',
      },
    },
    [formulaVnode]
  )

  return containerVnode
}

const conf = {
  type: 'formula', // 节点 type ，重要！！！
  renderElem: renderFormula,
}

export default conf

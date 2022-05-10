/**
 * @description render elem
 */

 import { Element as SlateElement } from 'slate'
 import { h,jsx, VNode } from 'snabbdom'
 import { IDomEditor } from '@wangeditor/core'
function renderBlockFormula(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

  // 构建 formula vnode
  const vnode = h('span',{style:{}},children)

    // 构建容器 vnode
    const containerVnode = h(
      'p',
      {
        props: {
          // contentEditable: false, // 不可编辑
        },
        style: {
          // display: 'inline-block', // inline
          // marginLeft: '3px',
          // marginRight: '3px',
          border: '2px solid var(--w-e-textarea-selected-border-color)',
          borderRadius: '3px',
          padding: '3px 3px',
        },
      },
      [vnode]
    )

  return containerVnode
}

const conf = {
  type: 'block-formula', // 节点 type ，重要！！！
  renderElem: renderBlockFormula,
}

export default conf

import {h, VNode} from "snabbdom";
import {Boot, IDomEditor, SlateElement} from "@wangeditor/editor";

function renderMathML(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {

    const vnode = h('math', {}, children)
    return vnode
}

const renderElemConf = {
    type: 'mathml',
    renderElem: renderMathML
}

Boot.registerRenderElem(renderElemConf)

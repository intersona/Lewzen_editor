// 存放两个编辑器的Vue实例（this）
let integratedEditor = null
// let bodyEditor = null

const sendEditor = (_this) => {
    integratedEditor = _this
}

function setBody(html) {
    integratedEditor.setBodyContent(html);
}

function setTitle(html) {
    integratedEditor.setTitleContent(html);
}

export default {
    // sendBodyEditor,
    sendEditor,
    setBody,
    setTitle,
    description: 'utils of editor',

}

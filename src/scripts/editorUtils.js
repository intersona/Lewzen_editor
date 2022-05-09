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

function getReplacedDollarFormula(str){
    // var re = new RegExp("$[^>]*$")
    var array = str.match(/\$[^>]*\$/g)
    console.log(array);
    // str = str.replace(re,)
  }

export default {
    // sendBodyEditor,
    sendEditor,
    setBody,
    setTitle,
    getReplacedDollarFormula,
    description: 'utils of editor',

}

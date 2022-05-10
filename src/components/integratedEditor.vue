<template>
  <div>
    <Toolbar
        id="titleToolbar"
        v-bind:style="{ border: '1px solid #ccc' }"
        :editor=titleEditor
        :defaultConfig="titleToolbarConfig"
        :mode="mode"
        v-show="editingTitle"
    />
    <Toolbar
        id="bodyToolbar"
        v-bind:style="{ border: '1px solid #ccc' }"
        :editor=bodyEditor
        :defaultConfig="bodyToolbarConfig"
        :mode="mode"
        v-show="editingBody"
    />
    <Editor
        v-bind:style="{border:'1px solid #ccc'}"
        v-model="valueHtmlTitle"
        :mode="mode"
        :defaultConfig="titleEditorConfig"
        @onCreated="onCreatedTitle"
        @onFocus="onFocusTitle"
        @onChange="onTitleChange"
    />

    <Editor
        v-bind:style="{
      // 'z-index': 5,
      // bind css.height with data.height
      height: this.height +'px',
      // bind css.width with data.width
      // width: this.width +'px',
      // position: 'absolute',
      // // bind css.left with data.left
      // left: this.left + 'px',
      // // bind css.top with data.top
      // top: this.top + 'px',
      'overflow-y': 'hidden',
      border: '1px solid #ccc',
    }"
        v-model="bodyValueHtml"
        :defaultConfig="bodyEditorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onBlur="handleBlur"
        @onFocus="onFocusBody"
        @onChange="onBodyChange"
    />

  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
//eslint-disable-next-line
import {onBeforeUnmount, ref, shallowRef} from "vue";
import {Editor, Toolbar} from "@wangeditor/editor-for-vue";
import editorUtils from "@/scripts/editorUtils";

import {parseMath} from "@/scripts/LaTeXParser";

export default {
  name: "integratedEditor",
  //eslint-disable-next-line
  components: {
    Editor,
    Toolbar,
  },
  props: {},
  mounted() {
    editorUtils.sendEditor(this);
    setTimeout(() => {
      this.valueHtmlTitle ="<math data-value='\\frac{1}{2}'>123</math>"
    },1500)
  },
  data() {
    return {
      // body editor
      bodyEditor: null,
      // title editor
      titleEditor: null,
      // 标志哪一个编辑器处于编辑状态（focus），以显示其toolbar
      editingTitle: false,
      editingBody: false,
      // body编辑器的文本内容的HTML
      bodyValueHtml: "<p>content</p>",
      // title编辑器的文本内容的HTML
      valueHtmlTitle: "",
      // 编辑器模式，不显示hoverBar
      mode: "simple",
      // the height of BODY editor div
      height: 300,
      // the width of BODY editor div
      width: 100,
      // title editor的宽
      height2: 300,
      // the left distance of editor div from origin
      left: 0,
      // the top distance of editor div from origin
      top: 0,
      // 标记其的配置信息
      bodyEditorConfig: {
        placeholder: "请输入内容...",
        autoFocus: true,

        hoverbarKeys:
            {
              // formula:
              //     {
              //       menuKeys:
              //           ['editorFormula']
              //     }
            }
      },
      titleEditorConfig: {
        placeholder: "请输入内容...",
        autoFocus: true,
        hoverbarKeys:
            {
              // formula:
              //     {
              //       menuKeys:
              //           ['editorFormula']
              //     }
            }
      },
      // toolbar的配置信息
      bodyToolbarConfig: {
        toolbarKeys: [
          "fontSize",
          "fontFamily",
          "|",
          "bold",
          "italic",
          "underline",
          '|',
          "justifyLeft",
          "justifyRight",
          "justifyCenter",
          "justifyJustify",
          '|',
          'sub',
          'sup',
          // menu key
          "headerSelect",
          "insertFormula", // “插入公式”菜单
          "editFormula", // “编辑公式”菜单
          // group of menu items
          {
            key: "group-more-style",
            title: "更多样式",
            iconSvg: "<svg></svg>",
            menuKeys: ["through", "code", "clearStyle"],
          },
        ],
      },
      titleToolbarConfig: {
        toolbarKeys: [
          "fontSize",
          "fontFamily",
          "color",
          "bgColor",
          "|",
          "bold",
          "italic",
          "underline",
          '|',
          "justifyLeft",
          "justifyRight",
          "justifyCenter",
          "justifyJustify",
          '|',
          // "insertFormula", // “插入公式”菜单
          // "editFormula", // “编辑公式”菜单
          // group of menu items
          'through'
        ],
      },
    };
  },
  methods: {
    // 组件创建时的触发事件
    onCreated(editor) {
      this.bodyEditor = Object.seal(editor);
      // console.log(editor.getConfig())
      // console.log(this.editor.getAllMenuKeys());
      // console.log(editor.getMenuConfig('fontSize'))
    },
    onCreatedTitle(editor2) {
      this.titleEditor = Object.seal(editor2);
      // console.log(this.editor.getAllMenuKeys());
      // console.log(editor.getMenuConfig('fontSize'))
    },
    // set the height of editor div
    setHeight(newHeight) {
      this.height = newHeight;
    },
    // set the width of editor div
    setWidth(newWidth) {
      this.width = newWidth;
    },
    //set the left distance of editor
    setLeft(newLeft) {
      this.left = newLeft;
    },
    // set the top distance of editor
    setTop(newTop) {
      this.top = newTop;
    },
    // set the HTML content of editor
    setBodyContent(contentHTML) {
      this.bodyValueHtml = contentHTML;
    },
    // body editor：将文本HTML中的$$中的公式替换为mathml后，返回HTML
    getBodyContent() {
      return this.replaceDollarFormula(this.bodyValueHtml)
    },
    setTitleContent(titleHTML) {
      this.valueHtmlTitle = titleHTML;
    },
    // title editor：将文本HTML中的$$中的公式替换为mathml后，返回HTML
    getTitleContent() {
      return this.replaceDollarFormula(this.valueHtmlTitle);
    },
    // get the editor instance
    getEditor() {
      return this.bodyEditor;
    },
    focus() {
      this.bodyEditor.focus();
      this.bodyEditor.selectAll();
    },
    // the function when the editor lose focal(blur)
    handleBlur() {
      // emit the event:editorBlur for the parent component
      this.$emit("editorBlur");
    },
    onFocusBody() {
      this.editingBody = true;
      this.editingTitle = false;
    },
    onFocusTitle() {
      this.editingBody = false;
      this.editingTitle = true;
    },
    onTitleChange() {
      // console.log("title change")
      this.$emit('titleChange')
    },
    onBodyChange() {
      console.log(this.getBodyContent())
      // console.log("body change")
      // console.log(this.bodyValueHtml);
      this.$emit('bodyChange')
    },
    insertHTML2Title(html) {
      this.titleEditor.dangerouslyInsertHtml(html);
    },
    proceedDollar(str) {
      str = str.slice(1, -1)
      let mathStr = parseMath(str)
      return mathStr.outerHTML
    },
    /**
     *
     * @param {*} str HTML of editor value with replacing ${}$ with <math>
     */
    replaceDollarFormula(str) {
      let array = str.match(/\$[^>]*\$/g)
      let transStr = str
      for (let s in array) {
        transStr = transStr.replace(array[s], this.proceedDollar(array[s]))
      }
      // console.log(transStr);
      return transStr
    },


  },
  beforeDestroy() {
    const editor = this.bodyEditor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
  ,
}
</script>

<style scoped>
</style>

<template>
  <div>

    <Toolbar
        id="titleToolbar"
        v-bind:style="{ border: '1px solid #ccc' }"
        :editor=editor2
        :defaultConfig="titleToolbarConfig"
        :mode="mode"
        v-show="editingTitle"
    />
    <Toolbar
        id="bodyToolbar"
        v-bind:style="{ border: '1px solid #ccc' }"
        :editor=editor
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
// import editorUtils from "@/scripts/editorUtils";


// eslint-disable-next-line no-unused-vars
import Vue from "vue";
// import { Boot } from "@wangeditor/editor";
// import formulaModule from "@wangeditor/plugin-formula";

//eslint-disable-next-line
export default {
  name: "integratedEditor",
  //eslint-disable-next-line
  components: {
    Editor,
    Toolbar,
  },
  props: {},
  mounted() {
    // editorUtils.sendEditor(this);
    // editorUtils.sendBodyEditor(this.editor);
  },
  data() {
    return {
      editor: null,
      editor2: null,
      editingTitle: false,
      editingBody: false,
      focusedEditor: null,
      // body编辑器的文本内容的HTML
      bodyValueHtml: "<p>content</p>",
      // title编辑器的文本内容的HTML
      valueHtmlTitle: "",
      mode: "simple", // or 'simple'
      // the height of editor div
      height: 300,
      // the width of editor div
      width: 100,
      height2: 300,
      // the left distance of editor div from origin
      left: 0,
      // the top distance of editor div from origin
      top: 0,
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
    onCreated(editor) {
      this.editor = Object.seal(editor);
      // console.log(editor.getConfig())
      // console.log(this.editor.getAllMenuKeys());
      // console.log(editor.getMenuConfig('fontSize'))
    },
    onCreatedTitle(editor2) {
      this.editor2 = Object.seal(editor2);
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
    getBodyContent() {
      return this.bodyValueHtml
    },
    setTitleContent(titleHTML) {
      this.valueHtmlTitle = titleHTML;
    },
    getTitleContent() {
      return this.valueHtmlTitle;
    },
    // get the editor instance
    getEditor() {
      return this.editor;
    },
    focus() {
      this.editor.focus();
      this.editor.selectAll();
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
      // console.log("body change")
      // console.log(this.bodyValueHtml);
      this.$emit('bodyChange')
    }
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
}
</script>

<style scoped>

</style>

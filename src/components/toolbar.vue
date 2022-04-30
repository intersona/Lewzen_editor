<template>
  <Toolbar
      v-bind:style="{
      border: '1px solid #ccc',
      width: width + 'px',
      // hegiht: height + 'px',
      'z-index':99,
      position: 'absolute',
    }"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
  />
</template>
<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
//eslint-disable-next-line
import {onBeforeUnmount, ref, shallowRef, onMounted} from "vue";
import {Toolbar} from "@wangeditor/editor-for-vue";
import Vue from "vue";

export default Vue.extend({
  name: "editorToolbar",
  components: {Toolbar},
  methods: {
    setEditor(editor) {
      this.editorRef = editor;
    },
    // set the width of toolbar div
    setWidth(newWidth) {
      this.width = newWidth;
    },
  },
  mounted() {

    // console.log(this.getConfig());
  },
  data() {
    return {
      // the theme of toolbar
      mode: "simple",
      // // the height of toolbar menu row
      // height: 40,
      // the width of toolbar div
      width: 100,
      toolbarConfig: {
        toolbarKeys: [
          "fontSize",
          "fontFamily",
          "color",
          "bgColor",
          "|",
          "bold",
          "italic",
          "underline",
          // '|',
          // 'insertFormula',
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

          // "insertFormula", // “插入公式”菜单
          // "editFormula", // “编辑公式”菜单
          // group of menu items
          {
            key: "group-more-style",
            title: "更多样式",
            iconSvg: "<svg>....</svg>",
            menuKeys: ["through", "code", "clearStyle"],
          },
        ],
      },
      editorRef: null
    };
  },
});
</script>

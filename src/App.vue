<template>
  <div>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style=" width: 100%; height: 100%; "
    >
      <g>
        <foreignObject width="100%" height="100%" style="display: inline-block">
          <div
              xmlns="http://www.w3.org/1999/xhtml"
              style="display: inline-block"
              @dblclick="ondblclick"
          >
            <p>hel111111111111lo</p>
          </div>
        </foreignObject>
      </g>
    </svg>
    <GlobalTextEditor
        ref="editor"
        v-show="editting"
        @editorBlur="onEditorBlur"/>
    <editorToolbar ref="toolbar" v-show="editting"/>
  </div>
</template>

<script>
import GlobalTextEditor from './components/textEditor.vue'
import editorToolbar from './components/toolbar.vue'
import {editorHide, editorWake} from './scripts/editorListener.js'

export default {
  name: 'App',
  components: {
    GlobalTextEditor,
    editorToolbar
  },
  data() {
    return {message: "<h1> 123 </h1>", editting: false};
  },
  methods: {
    ondblclick(event) {
      // var newHeight =
      //     event.currentTarget.clientHeight > 300
      //         ? event.currentTarget.clientHeight
      //         : 300;
      // var newWdith = event.currentTarget.clientWidth + 30;
      // var newLeft =
      //     event.currentTarget.offsetLeft - 10 > 0
      //         ? event.currentTarget.offsetLeft - 10
      //         : event.currentTarget.offsetLeft;
      // var newTop = event.currentTarget.offsetTop;
      // var newContent = event.currentTarget.innerHTML;
      // // setTimeout(() => {
      // // console.log(event.currentTarget.clientHeight);
      // this.$refs.editor.setHeight(newHeight);
      // this.$refs.editor.setWidth(newWdith);
      // this.$refs.editor.setLeft(newLeft);
      // this.$refs.editor.setTop(newTop);
      // this.$refs.editor.setContent(newContent);
      // // error
      // // this.$refs.editor.focus();
      // this.$refs.toolbar.setEditor(this.$refs.editor.getEditor());
      // // console.log(this.$refs.editor.getEditor());
      // // }, 0);
      this.editting = editorWake(this.$refs.editor,
          this.$refs.toolbar,
          event.currentTarget.clientHeight > 300
              ? event.currentTarget.clientHeight
              : 300,
          event.currentTarget.clientWidth + 30,
          event.currentTarget.innerHTML,
          event.currentTarget.offsetLeft - 10 > 0
              ? event.currentTarget.offsetLeft - 10
              : event.currentTarget.offsetLeft,
          event.currentTarget.offsetTop);
    },
    onEditorBlur() {
      this.editting = editorHide();
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

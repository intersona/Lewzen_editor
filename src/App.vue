<template>
  <div>
    <div>
      <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          style=" width: 100%; height: 100%; "
      >
        <g>
          <rect @click="onclick1" height="100" width="100" x='30'></rect>
        </g>
        <g>
          <foreignObject width="1" height="1" style="overflow: visible">
            <div
                xmlns="http://www.w3.org/1999/xhtml"
                style="display: inline-block"
                @dblclick="ondblclick"
            >
              <p><em>hel11111</em><em><strong>111</strong></em><u><em><strong>111</strong></em></u><u><em>1lo</em></u>
              </p>
            </div>
          </foreignObject>
        </g>

        <g>
          <foreignObject width="100%" height="100%" style="display: inline-block;overflow: visible" x="100" y="100">
            <math xmlns="http://www.w3.org/1998/Math/MathML">
              <msubsup>
                <mo>&#x222B;<!-- 积分 --></mo>
                <mn>0</mn>
                <mn>1</mn>
              </msubsup>
            </math>
          </foreignObject>
        </g>
      </svg>
    </div>
    <div>
      <el-tabs tab-position="top" style="">

        <el-tab-pane label="text">
          <integrated-editor></integrated-editor>
        </el-tab-pane>
        <el-tab-pane label="123">123</el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>

// import GlobalTextEditor from './components/textEditor.vue'
// import editorToolbar from './components/toolbar.vue'
// eslint-disable-next-line
import {editorHide, editorWake} from './scripts/editorListener.js'
import {createText} from './scripts/createTextTest.js'
import IntegratedEditor from "@/components/integratedEditor";
import editorUtils from './scripts/editorUtils.js'

export default {
  name: 'App',
  components: {
    IntegratedEditor,
    // GlobalTextEditor,
    // editorToolbar,
    // eslint-disable-next-line vue/no-unused-components
  },
  data() {
    return {message: "<h1> 123 </h1>", editting: false};
  },
  mounted() {
    // this.$refs.toolbar.setEditor(this.$refs.editor.getEditor())
    console.log('mounted')
  },
  methods: {
    onclick1() {
      createText()
    },
    // eslint-disable-next-line no-unused-vars
    ondblclick(event) {
      editorUtils.setTitle(event.currentTarget.innerHTML)
    },
    onEditorBlur() {
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

<template>

  <div style="overflow: visible">
    <editorToolbar
        ref="toolbar"/>
    <GlobalTextEditor ref="editor"/>
  </div>
</template>

<script>
import GlobalTextEditor from './textEditor.vue'
import editorToolbar from './toolbar.vue'

export default {
  name: "EditorPane",
  // eslint-disable-next-line vue/no-unused-components
  components: {GlobalTextEditor, editorToolbar},
  created() {
  },
  mounted() {
    this.$refs.toolbar.setEditor(this.$refs.editor.getEditor())
    this.$forceUpdate()
  },
}

</script>


<style scoped>

</style>

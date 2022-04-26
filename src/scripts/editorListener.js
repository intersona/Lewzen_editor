// eslint-disable-next-line no-unused-vars
export function editorWake(editor, toolbar, newHeight, newWidth, newContent, newLeft, newTop) {
    // let newHeight =
    //     event.currentTarget.clientHeight > 300
    //         ? event.currentTarget.clientHeight
    //         : 300;
    // let newWidth = event.currentTarget.clientWidth + 30;
    // let newLeft =
    //     event.currentTarget.offsetLeft - 10 > 0
    //         ? event.currentTarget.offsetLeft - 10
    //         : event.currentTarget.offsetLeft;
    // let newTop = event.currentTarget.offsetTop;
    // let newContent = event.currentTarget.innerHTML;
    // setTimeout(() => {
    // console.log(event.currentTarget.clientHeight);
    editor.setHeight(newHeight);
    editor.setWidth(newWidth);
    editor.setLeft(newLeft);
    editor.setTop(newTop);
    editor.setContent(newContent);
    // error
    // this.$refs.editor.focus();
    toolbar.setEditor(editor.getEditor());
    // console.log(this.$refs.editor.getEditor());
    // }, 0);
    // this.editting = true;
    return true;
}


// eslint-disable-next-line no-unused-vars
export function editorHide() {
    return false;
}

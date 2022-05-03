# 前提

为实现嵌入前端，需要具备以下条件

- 前端可创建文本矢量图（画布SVG中的文本框）

  ```html
  <g>
      <forirgnObject>
          [表示文本的HTML语句]
      </forirgnObject>
  </g>
  ```

- 前端可向上述DOM对象绑定监听事件函数（eventListener）

- 前端导入组件及脚本

# TextEditor

与工具栏分离的富文本编辑器

- 基于wangEditor实现

## 使用方法

本组件用于编辑文本矢量图内容，监听到文本矢量图的某个事件（双击）时触发显示，编辑器失去焦点后隐藏。

- 因此在DOM树中应当与画布SVG同级

```
<div>
  <svg>...</svg>
  <GlobalTextEditor />
</div>
```

- 通过`v-show`属性实现隐藏与可见

## 实现方法

用户需要实现以下工作

- 组件的隐藏和渲染
  - v-show
- 文本矢量图触发事件监听函数
- 编辑器失焦事件监听函数
- 获取到被选中文本矢量图的内容、大小以及坐标

### 前提

- 需要向所有文本矢量图（画布SVG中的文本框）设置**`ondbclick`**事件
- 向文本编辑器组件TextEditor设置**`editorBlur`**的监听函数
- 导入`editorListener.js`文件
- 设置`v-show`属性控制可见性
- 设置ref属性以获取实例

### 监听函数

- ondbclick事件的监听函数

  调用editorWake方法，并设置v-show可见（将返回值赋给v-show属性）

- editorBlur事件的监听函数

  调用editorHide方法，并设置v-show不可见（将返回值赋给v-show属性）

### js函数

`editorWake(editor,toolbar,newHeight,newWidth,newContent,newLeft, newTop)`

- editor

  文本编辑器实例，可以在设置ref属性后通过`this.$refs`获得

- toolbar

  文本工具栏实例，获取方法同上

- newHeight newWidth

  文本编辑器的宽高，应传入被选中的文本框的宽高

- newContent

  文本编辑器的内容，应传入被选中文本框中的HTML文本

- newLeft newTop

  文本编辑器的坐标（距左端和顶端的距离），应传入被选中文本框在画布SVG中的坐标（x，y）

- 返回值

  返回true

`editorHide()`

- 返回值

  返回false

### 唤醒组件

通过向文本矢量图组件绑定事件监听函数，函数触发时完成以下过程

- 设置组件可见
- 设置被编辑文本的HTML内容
- 设置编辑器宽高
- 设置编辑器坐标
- 向工具栏toolbar设置文本编辑器editor

### 组件休眠

通过绑定事件监听函数，编辑器失焦时隐藏组件

- 监听`editorBlur`事件
- 设置组件隐藏

## 接口

组件向外提供设置相关属性的接口，用于组件唤醒时的渲染

### 文本内容

`setContent(String contentHTML)`

### 编辑器宽高

`setWidth(newWidth)`

设置编辑器的宽度

`setHeight(newHeight)`

设置编辑器的高度

- 编辑器宽高应略大与文本所在div宽高

### 编辑器坐标

`setLeft(newLeft)`

设置编辑器的css:left属性

`setTop(newTop)`

设置编辑器的css:top属性

- 编辑器的position为absolute，因此应是相对于父组件中的坐标

### 获取编辑器实例

`getEditor()`

返回编辑器实例

# Toolbar

将wangEditor的工具栏进行封装，显示为矩形的工具栏

## 问题

无法仅提供接口修改编辑器中文本属性，必须调用组件

## 使用方法

与文本编辑器同时显示和隐藏，在创建后需要调用文本编辑器的接口以显示二者绑定。可以将组件定义在任何位置，前提是必须能够获取到文本编辑器的实例。

- 设置v-show属性控制隐藏显示

- 在唤醒时调用`setEditor()`接口传入editor实例

  通过文本编辑器的`getEditor()`接口获取实例

### 前提

- 设置`v-show`属性控制可见性
- 设置ref属性以获取实例

### 监听函数

在`editorWake`方法中将其与文本编辑器绑定，因此无需额外实现

## 接口

### 设置对应文本编辑器

`setEditor(editor)`

传入文本编辑器的实例

- 需要在创建时传入文本编辑器的实例，才能够显示编辑器中文本的样式

### 工具栏宽度

`setWidth(newWidt)`

设置工具栏的宽度

# Demo

以v-if实现组件的隐藏为例

HTML部分

```HTML
<!-- 文本矢量图：绑定触发事件监听函数 -->
  <g>
    <foreignObject width="100%" height="100%">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style="display: inline-block"
        @dblclick="ondblclick"
      >
        <p>hel111111111111lo</p>
      </div>
    </foreignObject>
  </g>

<!-- 文本编辑器：设置隐藏与失焦监听函数 -->
<GlobalTextEditor
  ref="editor"
  v-show="editting"
  @editorBlur="onEditorBlur"
/>
<editorToolbar ref="toolbar" v-show="editting"/>
```

JS脚本

```javascript
    ondblclick(event) {
      this.editting = editorWake(this.$refs.editor,
          this.$refs.toolbar,
          event.currentTarget.clientHeight,
          event.currentTarget.clientWidth,
          event.currentTarget.innerHTML,
          event.currentTarget.offsetLeft,
          event.currentTarget.offsetTop);
    },
    onEditorBlur() {
      this.editting = editorHide();
    },
```


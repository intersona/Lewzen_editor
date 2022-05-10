# integratedEditor 集成编辑器

包含两个编辑器（标题和注释），及其工具栏。

- 用于作为侧边栏显示。

## 接口

### setTitleContent

传入HTML字符串，设置标题编辑器的内容

- 编辑器内渲染HTML后显示

### setBodyContent

同理，设置注释编辑器的内容

### getTitleContent

获取到标题编辑器的HTML字符串

- 当编辑器文本包含`${}$`形式的字符串时，会根据latex语法将其解析为MathML字符串并替换

### getBodyContent

同理，获取到注释编辑器的HTML字符串

### titleChange事件

当标题编辑器修改时，释放`titleChange`事件

### bodyChange事件

当注释编辑器修改时，释放`bodyChange`事件

## 获取到文本内容

### latex

- 从编辑器内获取到的公式对应的MathML格式如下

  ```
  <math data-value='{latex公式}'>
  	...
  </math>
  ```

- 能够正常在编辑器中回显的公式对应的HTML格式同理。

## 使用方法

### 富文本

参考工具栏

### LaTeX公式

- 使用工具栏插入公式。

  即时渲染；inline。

- 在行首输入`$`及空格。

  非即时渲染；block。

- 在行内使用`${}$`包裹

  非即时渲染；inline。

### markdown

- 标题

  > 行首`#`，分为五级

- 列表

  > `-` `+` `*`

- 引用

  > `>`

- 分割线

  > `---`

- 代码块

  > \```

- 公式

  > `$`
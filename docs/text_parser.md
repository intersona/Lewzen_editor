# 文本解析器

将输入的文本源代码转化为对应的HTML
- 在前端被文本编辑器调用


## 纯文本与Markdown解析

将文本内容根据样式解析渲染后输出为HTML

- Markdown样式实质为基于文本样式得到

### 文本样式 `TextStyle`

基于HTML标签属性以及CSS样式实现

## LaTeX公式解析

解析为HTML（MathML）

### 解析LaTeX语法

拆分LaTeX语法，获取到命令,参数及其树状结构
- 详见latexParser.js



`\命令`

`{参数}`

树状结构

  


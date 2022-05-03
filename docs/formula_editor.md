# 公式编辑器

对`LaTeX`公式进行编辑，并解析为`MathML`代码

## MathML的显示

通过`mamth.css`实现

## LaTeX语法的解析

将LaTeX的语法的公式解析为MathML语法的公式

- 对于语法错误的公式源代码，不进行解析直接显示

## 前端组件

基于（富）文本编辑器

- 公式化按钮 formulatingButton

  将编辑器中全部文本内容视为基于LaTeX语法的公式，并转化为MathML
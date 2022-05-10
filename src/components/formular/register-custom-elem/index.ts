/**
 * @description 注册自定义组件formula-box，用于渲染公式
 */

// @ts-ignore
import StyleContent from '!!raw-loader!../../../scripts/mathml.css'
import { parseMath } from '../../../scripts/LaTeXParser'
// import './native-shim'

class FormulaBox extends HTMLElement {
  private span: HTMLElement

  // 监听的 attr
  static get observedAttributes() {
    return ['data-value']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    const document = shadow.ownerDocument

    const style = document.createElement('style')
    style.innerHTML = StyleContent // 加载 css 文本
    shadow.appendChild(style)

    const span = document.createElement('span')
    span.style.display = 'inline-block'
    shadow.appendChild(span)
    this.span = span
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'data-value') {
      if (oldValue == newValue) return
      this.render(newValue || '')
    }
  }

  /**
   *
   * @param value 待渲染的latex公式代码
   */
  private render(value: string) {
    this.span.innerHTML=''
    this.span.appendChild(parseMath(value))
  }
}

window.customElements.define('formula-box', FormulaBox)

/**
 * @description formula module entry
 */



import { IModuleConf } from '@wangeditor/editor'
import renderElemConf from './render-elem'
import elemToHtmlConf from './elem-to-html'
import parseHtmlConf from './parse-elem-html'
import withBlockFormula from './plugin'


const blockformula: Partial<IModuleConf> = {
  renderElems: [renderElemConf],
  elemsToHtml: [elemToHtmlConf],
  parseElemsHtml: [parseHtmlConf],
  editorPlugin:withBlockFormula
}

export default blockformula

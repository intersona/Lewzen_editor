
import InsertFormulaMenu from './InsertFormula'
import EditFormulaMenu from './EditFormula'

export const insertFormulaMenuConf = {
  key: 'insertFormula', // menu key ，唯一。注册之后，可配置到工具栏
  factory() {
    return new InsertFormulaMenu()
  },
}

export const editFormulaMenuConf = {
  key: 'editFormula',
  factory() {
    return new EditFormulaMenu()
  },
}

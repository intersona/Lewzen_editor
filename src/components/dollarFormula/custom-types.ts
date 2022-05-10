/**
 * @description formula element
 */

import {Text} from 'slate'

export type FormulaElement = {
  type: 'block-formula'
  children: Text[]
}

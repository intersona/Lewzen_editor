import { Boot } from '@wangeditor/editor'
import formulaModule from '@/components/formular/index'
Boot.registerModule(formulaModule)

import markdownModule from '@/components/markdown'

Boot.registerModule(markdownModule)

import dollarFormula from '@/components/dollarFormula'
Boot.registerModule(dollarFormula)

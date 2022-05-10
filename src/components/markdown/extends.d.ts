import { SlateElement, SlateDescendant } from './extends'

declare module './extends' {
  interface SlateElement {
    type: string
    children: SlateDescendant[]
  }
}
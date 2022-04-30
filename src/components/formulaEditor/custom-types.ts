/**
 * @description formula element based on MathML
 */

type EmptyText =
    {
        text: ''
    }

export type MathMLText = {
    type: 'mathml formula'
    text: string
    value: string
    children: EmptyText[]
}

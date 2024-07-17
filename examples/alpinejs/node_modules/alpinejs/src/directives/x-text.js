import { directive } from '../directives'
import { mutateDom } from '../mutation'

directive('text', (el, { expression }, { effect, evaluateLater }) => {
    let evaluate = evaluateLater(expression)

    effect(() => {
        evaluate(value => {
            mutateDom(() => {
                el.textContent = value
            })
        })
    })
})

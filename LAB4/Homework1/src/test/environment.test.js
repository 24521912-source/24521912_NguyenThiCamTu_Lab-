import { describe, expect, it } from 'vitest'

describe('Test environment', () => {
  it('provides a working DOM environment', () => {
    const element = document.createElement('div')

    element.textContent = 'Gallery'

    expect(element).toHaveTextContent('Gallery')
  })
})
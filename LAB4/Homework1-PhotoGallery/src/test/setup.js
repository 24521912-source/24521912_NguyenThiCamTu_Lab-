import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  Object.defineProperty(
    HTMLDialogElement.prototype,
    'showModal',
    {
      configurable: true,
      writable: true,
      value: vi.fn(function () {
        this.setAttribute('open', '')
      }),
    },
  )
}

if (typeof HTMLDialogElement.prototype.close !== 'function') {
  Object.defineProperty(
    HTMLDialogElement.prototype,
    'close',
    {
      configurable: true,
      writable: true,
      value: vi.fn(function () {
        if (!this.open) {
          return
        }

        this.removeAttribute('open')
        this.dispatchEvent(new Event('close'))
      }),
    },
  )
}
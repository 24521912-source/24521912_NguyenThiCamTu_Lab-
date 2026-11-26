import { describe, expect, it } from 'vitest';

describe('Test environment', () => {
  it('provides a browser-like DOM environment', () => {
    const element = document.createElement('div');

    element.textContent = 'Swipe Deck';

    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Swipe Deck');

    element.remove();
  });
});
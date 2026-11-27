import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PaginationControls from '../components/PaginationControls.jsx'

describe('PaginationControls', () => {
  it('disables Previous on the first page', () => {
    render(
      <PaginationControls
        page={1}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeEnabled()
  })

  it('enables both buttons on a middle page', () => {
    render(
      <PaginationControls
        page={2}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeEnabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeEnabled()
  })

  it('disables Next on the last page', () => {
    render(
      <PaginationControls
        page={3}
        totalPages={3}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeEnabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeDisabled()
  })

  it('disables both buttons for a single page', () => {
    render(
      <PaginationControls
        page={1}
        totalPages={1}
        onPageChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeDisabled()

    expect(
      screen.getByRole('button', { name: 'Next' }),
    ).toBeDisabled()
  })

  it('requests the next page when Next is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('requests the previous page when Previous is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        page={2}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(onPageChange).toHaveBeenCalledTimes(1)
    expect(onPageChange).toHaveBeenCalledWith(1)
  })

  it('does not request a page before the first page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Previous' }),
    )

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('does not request a page after the last page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    render(
      <PaginationControls
        page={3}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    expect(onPageChange).not.toHaveBeenCalled()
  })

  it('remains controlled by the parent component', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()

    const { rerender } = render(
      <PaginationControls
        page={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Next' }),
    )

    expect(onPageChange).toHaveBeenCalledWith(2)

    expect(
      screen.getByText('Page 1 of 3'),
    ).toBeInTheDocument()

    rerender(
      <PaginationControls
        page={2}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    )

    expect(
      screen.getByText('Page 2 of 3'),
    ).toBeInTheDocument()
  })
})
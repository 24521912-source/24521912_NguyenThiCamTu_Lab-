import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  render,
  screen,
  within,
} from '@testing-library/react'

import SlaCountdown from '../components/SlaCountdown'

import {
  formatRemainingTime,
} from '../utils/slaTime'

function createTimer(
  remainingMs,
  overrides = {}
) {
  return {
    remainingMs,

    formattedTime:
      formatRemainingTime(remainingMs),

    isExpired: remainingMs === 0,

    isInvalid: remainingMs === null,

    syncStatus: 'synchronized',

    ...overrides,
  }
}

describe('SLA countdown component', () => {
  it('renders the formatted countdown', () => {
    render(
      <SlaCountdown
        timer={createTimer(3723000)}
        deadlineMs={1700003723000}
      />
    )

    const timer = screen.getByRole(
      'timer',
      {
        name: 'Remaining appeal time',
      }
    )

    expect(
      within(timer).getByText('01')
    ).toBeInTheDocument()

    expect(
      within(timer).getByText('02')
    ).toBeInTheDocument()

    expect(
      within(timer).getByText('03')
    ).toBeInTheDocument()
  })

  it('displays the active appeal status', () => {
    render(
      <SlaCountdown
        timer={createTimer(60000)}
        deadlineMs={1700000060000}
      />
    )

    expect(
      screen.getByText('Active')
    ).toBeInTheDocument()
  })

  it('displays an expired appeal warning', () => {
    render(
      <SlaCountdown
        timer={createTimer(0)}
        deadlineMs={1700000000000}
      />
    )

    expect(
      screen.getByText('Expired')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent(
      'The appeal window has expired.'
    )
  })

  it('handles an unavailable deadline', () => {
    render(
      <SlaCountdown
        timer={createTimer(null)}
        deadlineMs={null}
      />
    )

    expect(
      screen.getByText(
        'The appeal deadline is unavailable.'
      )
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('timer')
    ).not.toBeInTheDocument()
  })

  it('shows the remaining progress percentage', () => {
    render(
      <SlaCountdown
        timer={createTimer(30000)}
        deadlineMs={1700000030000}
        durationMs={60000}
      />
    )

    expect(
      screen.getByRole('progressbar')
    ).toHaveAttribute(
      'aria-valuenow',
      '50'
    )
  })

  it('displays clock synchronization errors', () => {
    render(
      <SlaCountdown
        timer={createTimer(
          60000,
          { syncStatus: 'error' }
        )}
        deadlineMs={1700000060000}
      />
    )

    expect(
      screen.getByText(
        /clock synchronization failed/i
      )
    ).toBeInTheDocument()
  })

  it('clearly identifies the demonstration clock', () => {
    render(
      <SlaCountdown
        timer={createTimer(60000)}
        deadlineMs={1700000060000}
      />
    )

    expect(
      screen.getByText('Demo clock')
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /demonstration timing only/i
      )
    ).toBeInTheDocument()
  })
})
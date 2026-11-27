export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
}) {
  const isFirstPage = page <= 1
  const isLastPage = page >= totalPages

  function handlePrevious() {
    if (!isFirstPage) {
      onPageChange(page - 1)
    }
  }

  function handleNext() {
    if (!isLastPage) {
      onPageChange(page + 1)
    }
  }

  return (
    <nav
      className="pagination-controls"
      aria-label="Evidence pagination"
    >
      <button
        type="button"
        className="pagination-button"
        disabled={isFirstPage}
        onClick={handlePrevious}
      >
        Previous
      </button>

      <span
        className="page-indicator"
        aria-live="polite"
        aria-atomic="true"
      >
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="pagination-button"
        disabled={isLastPage}
        onClick={handleNext}
      >
        Next
      </button>
    </nav>
  )
}
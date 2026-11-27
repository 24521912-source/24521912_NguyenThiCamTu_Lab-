const DEFAULT_PAGE_SIZE = 6

export function normalizePageSize(
  pageSize = DEFAULT_PAGE_SIZE,
) {
  if (!Number.isSafeInteger(pageSize) || pageSize <= 0) {
    return DEFAULT_PAGE_SIZE
  }

  return pageSize
}

export function normalizePage(page, totalPages) {
  if (!Number.isSafeInteger(page) || page < 1) {
    return 1
  }

  return Math.min(page, totalPages)
}

export function calculatePagination(
  clips,
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const sourceClips = Array.isArray(clips)
    ? clips
    : []

  const normalizedPageSize = normalizePageSize(pageSize)

  const totalPages =
    Math.ceil(sourceClips.length / normalizedPageSize) || 1

  const effectivePage = normalizePage(page, totalPages)

  const startIdx =
    (effectivePage - 1) * normalizedPageSize

  const visibleItems = sourceClips.slice(
    startIdx,
    startIdx + normalizedPageSize,
  )

  return {
    pageSize: normalizedPageSize,
    totalPages,
    effectivePage,
    startIdx,
    visibleItems,
  }
}
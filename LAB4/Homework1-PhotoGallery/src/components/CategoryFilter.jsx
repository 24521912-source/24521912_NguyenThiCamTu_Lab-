import { categories } from '../data/categories'

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div
      className="category-filter"
      role="group"
      aria-label="Filter photos by category"
    >
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className="category-button"
          aria-pressed={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
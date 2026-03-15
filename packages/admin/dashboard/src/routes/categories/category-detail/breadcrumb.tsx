import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

type CategoryWithParent = HttpTypes.AdminProductCategory & {
  parent_category?: CategoryWithParent | null
}

type CategoryDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminProductCategoryResponse>

export const categoryDetailBreadcrumbs = (
  props: CategoryDetailBreadcrumbProps
): { label: string; path: string }[] => {
  const data = props.data as
    | HttpTypes.AdminProductCategoryResponse
    | undefined
  const category = data?.product_category as CategoryWithParent | undefined

  if (!category) return []

  const items: { label: string; path: string }[] = []

  let current = category.parent_category
  while (current) {
    items.unshift({
      label: current.name,
      path: `/categories/${current.id}`,
    })
    current = current.parent_category
  }

  items.push({
    label: category.name,
    path: `/categories/${category.id}`,
  })

  return items
}

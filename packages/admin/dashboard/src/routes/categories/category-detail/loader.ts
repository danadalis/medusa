import { LoaderFunctionArgs } from "react-router-dom"

import { categoriesQueryKeys } from "../../../hooks/api/categories"
import { sdk } from "../../../lib/client"
import { queryClient } from "../../../lib/query-client"

const categoryDetailQuery = (id: string) => ({
  queryKey: categoriesQueryKeys.detail(id, {
    include_ancestors_tree: true,
    fields: "*parent_category",
  }),
  queryFn: async () =>
    sdk.admin.productCategory.retrieve(id, {
      include_ancestors_tree: true,
      fields: "*parent_category",
    }),
})

export const categoryLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = categoryDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

import { useLoaderData, useParams } from "react-router-dom"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useProduct } from "../../../hooks/api/products"
import { AiProposalProvider } from "../../../providers/ai-proposal-provider"
import { useExtension } from "../../../providers/extension-provider"
import { ProductAttributeSection } from "./components/product-attribute-section"
import { ProductFitmentSection } from "./components/product-fitment-section"
import { ProductGeneralSection } from "./components/product-general-section"
import { ProductIntentSection } from "./components/product-intent-section"
import { ProductMediaSection } from "./components/product-media-section"
import { ProductOptionSection } from "./components/product-option-section"
import { ProductOrganizationSection } from "./components/product-organization-section"
import { ProductSalesChannelSection } from "./components/product-sales-channel-section"
import { ProductShippingProfileSection } from "./components/product-shipping-profile-section"
import { ProductSpecificationSection } from "./components/product-specification-section"
import { ProductVariantSection } from "./components/product-variant-section"
import { PRODUCT_DETAIL_FIELDS } from "./constants"
import { productLoader } from "./loader"

export const ProductDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productLoader>
  >

  const { id } = useParams()
  const { product, isLoading, isError, error } = useProduct(
    id!,
    { fields: PRODUCT_DETAIL_FIELDS },
    {
      initialData: initialData,
    }
  )

  const { getWidgets } = useExtension()

  const after = getWidgets("product.details.after")
  const before = getWidgets("product.details.before")
  const sideAfter = getWidgets("product.details.side.after")
  const sideBefore = getWidgets("product.details.side.before")

  if (isLoading || !product) {
    return (
      <TwoColumnPageSkeleton
        mainSections={4}
        sidebarSections={3}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <AiProposalProvider productId={product.id}>
      <TwoColumnPage
        widgets={{
          after,
          before,
          sideAfter,
          sideBefore,
        }}
        showJSON
        showMetadata
        data={product}
      >
        <TwoColumnPage.Main>
          <ProductGeneralSection product={product} />
          <ProductSpecificationSection product={product} />
          <ProductMediaSection product={product} />
          <ProductOptionSection product={product} />
          <ProductVariantSection product={product} />
        </TwoColumnPage.Main>
        <TwoColumnPage.Sidebar>
          <ProductSalesChannelSection product={product} />
          <ProductShippingProfileSection product={product} />
          <ProductOrganizationSection product={product} />
          <ProductAttributeSection product={product} />
          <ProductIntentSection product={product} />
          <ProductFitmentSection product={product} />
        </TwoColumnPage.Sidebar>
      </TwoColumnPage>
    </AiProposalProvider>
  )
}

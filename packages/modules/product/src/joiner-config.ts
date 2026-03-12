import { defineJoinerConfig, Modules } from "@medusajs/framework/utils"
import {
  Brand,
  Product,
  ProductCategory,
  ProductCollection,
  ProductImage,
  ProductIntentTag,
  ProductOption,
  ProductOptionValue,
  ProductSpecification,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import { default as schema } from "./schema"

export const joinerConfig = defineJoinerConfig(Modules.PRODUCT, {
  schema,
  models: [
    Brand,
    Product,
    ProductVariant,
    ProductOption,
    ProductOptionValue,
    ProductType,
    ProductTag,
    ProductCollection,
    ProductCategory,
    ProductImage,
    ProductSpecification,
    ProductIntentTag,
  ],
  linkableKeys: {
    variant_id: "ProductVariant",
    brand_id: "Brand",
    product_specification_id: "ProductSpecification",
    product_intent_tag_id: "ProductIntentTag",
  },
  primaryKeys: ["id", "handle"],
  alias: [
    {
      name: ["product_variant", "product_variants", "variant", "variants"],
      entity: "ProductVariant",
      args: {
        methodSuffix: "ProductVariants",
      },
    },
    {
      name: ["brand", "brands"],
      entity: "Brand",
      args: {
        methodSuffix: "Brands",
      },
    },
    {
      name: ["product_specification", "product_specifications"],
      entity: "ProductSpecification",
      args: {
        methodSuffix: "ProductSpecifications",
      },
    },
    {
      name: ["product_intent_tag", "product_intent_tags"],
      entity: "ProductIntentTag",
      args: {
        methodSuffix: "ProductIntentTags",
      },
    },
  ],
})

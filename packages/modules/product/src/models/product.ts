import { model, ProductUtils } from "@medusajs/framework/utils"

import Brand from "./brand"
import ProductCategory from "./product-category"
import ProductCollection from "./product-collection"
import ProductImage from "./product-image"
import ProductIntentTag from "./product-intent-tag"
import ProductOption from "./product-option"
import ProductSpecification from "./product-specification"
import ProductTag from "./product-tag"
import ProductType from "./product-type"
import ProductVariant from "./product-variant"

const Product = model
  .define("Product", {
    id: model.id({ prefix: "prod" }).primaryKey(),
    title: model.text().searchable().translatable(),
    handle: model.text(),
    subtitle: model.text().searchable().translatable().nullable(),
    description: model.text().searchable().translatable().nullable(),
    is_giftcard: model.boolean().default(false),
    status: model
      .enum(ProductUtils.ProductStatus)
      .default(ProductUtils.ProductStatus.DRAFT),
    thumbnail: model.text().nullable(),
    weight: model.text().nullable(),
    length: model.text().nullable(),
    height: model.text().nullable(),
    width: model.text().nullable(),
    origin_country: model.text().nullable(),
    hs_code: model.text().nullable(),
    mid_code: model.text().nullable(),
    material: model.text().translatable().nullable(),
    discountable: model.boolean().default(true),
    external_id: model.text().nullable(),
    metadata: model.json().nullable(),
    brand: model
      .belongsTo(() => Brand, {
        mappedBy: "products",
      })
      .nullable(),
    part_type: model.text().nullable(),
    use_case: model.text().nullable(),
    skill_level: model.text().nullable(),
    assembly_context: model.text().nullable(),
    vehicle_ref_search: model.text().searchable().nullable(),
    specifications: model.hasMany(() => ProductSpecification, {
      mappedBy: "product",
    }),
    intent_tags: model.hasMany(() => ProductIntentTag, {
      mappedBy: "product",
    }),
    variants: model.hasMany(() => ProductVariant, {
      mappedBy: "product",
    }),
    type: model
      .belongsTo(() => ProductType, {
        mappedBy: "products",
      })
      .nullable(),
    tags: model.manyToMany(() => ProductTag, {
      mappedBy: "products",
      pivotTable: "product_tags",
    }),
    options: model.hasMany(() => ProductOption, {
      mappedBy: "product",
    }),
    images: model.hasMany(() => ProductImage, {
      mappedBy: "product",
    }),
    collection: model
      .belongsTo(() => ProductCollection, {
        mappedBy: "products",
      })
      .nullable(),
    categories: model.manyToMany(() => ProductCategory, {
      pivotTable: "product_category_product",
      mappedBy: "products",
    }),
  })
  .cascades({
    delete: ["variants", "options", "images", "specifications", "intent_tags"],
  })
  .indexes([
    {
      name: "IDX_product_handle_unique",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_type_id",
      on: ["type_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_brand_id",
      on: ["brand_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_part_type",
      on: ["part_type"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_collection_id",
      on: ["collection_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_status",
      on: ["status"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default Product

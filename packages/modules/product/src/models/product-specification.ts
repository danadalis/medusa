import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductSpecification = model
  .define(
    { tableName: "product_specification", name: "ProductSpecification" },
    {
      id: model.id({ prefix: "pspec" }).primaryKey(),
      spec_key: model.text().searchable(),
      value_text: model.text().nullable(),
      value_numeric: model.float().nullable(),
      unit: model.text().nullable(),
      source: model.text().default("manual"),
      confidence: model.float().nullable(),
      product: model.belongsTo(() => Product, {
        mappedBy: "specifications",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_product_spec_product_key_unique",
      on: ["product_id", "spec_key"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_spec_key",
      on: ["spec_key"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductSpecification

import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductIntentTag = model
  .define(
    { tableName: "product_intent_tag", name: "ProductIntentTag" },
    {
      id: model.id({ prefix: "pitag" }).primaryKey(),
      tag: model.text().searchable(),
      tag_type: model.text().default("intent"),
      product: model.belongsTo(() => Product, {
        mappedBy: "intent_tags",
      }),
    }
  )
  .indexes([
    {
      name: "IDX_product_intent_tag_product_tag",
      on: ["product_id", "tag", "tag_type"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_intent_tag_type",
      on: ["tag_type"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default ProductIntentTag

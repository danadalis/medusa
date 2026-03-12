import { model } from "@medusajs/framework/utils"
import Product from "./product"

const Brand = model
  .define("Brand", {
    id: model.id({ prefix: "brand" }).primaryKey(),
    name: model.text().searchable(),
    aliases: model.array().nullable(),
    logo_url: model.text().nullable(),
    metadata: model.json().nullable(),
    products: model.hasMany(() => Product, {
      mappedBy: "brand",
    }),
  })
  .indexes([
    {
      name: "IDX_brand_name_unique",
      on: ["name"],
      unique: true,
      where: "deleted_at IS NULL",
    },
  ])

export default Brand

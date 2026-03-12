import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type FitmentEntry = {
  vehicle_model: string
  vehicle_make: string
  year_from?: number
  year_to?: number
}

type Props = {
  product: HttpTypes.AdminProduct
}

export const ProductFitmentSection = ({ product }: Props) => {
  const [fitments, setFitments] = useState<FitmentEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/admin/fitment?product_id=${product.id}`, { credentials: "include" })
      .then((r) => r.ok ? r.json() : { fitments: [] })
      .then((d) => setFitments(d.fitments || []))
      .catch(() => setFitments([]))
      .finally(() => setLoading(false))
  }, [product.id])

  if (loading) return null
  if (fitments.length === 0) return null

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heading level="h2">Passning</Heading>
          <Badge color="blue" size="2xsmall">{fitments.length} fordon</Badge>
        </div>
      </div>
      {fitments.slice(0, 10).map((f, i) => (
        <div key={i} className="flex items-center gap-2 px-6 py-3">
          <Text size="small" weight="plus">{f.vehicle_make}</Text>
          <Text size="small">{f.vehicle_model}</Text>
          {(f.year_from || f.year_to) && (
            <Text size="small" className="text-ui-fg-muted">
              {f.year_from || "?"} – {f.year_to || "?"}
            </Text>
          )}
        </div>
      ))}
      {fitments.length > 10 && (
        <div className="px-6 py-3">
          <Text size="small" className="text-ui-fg-muted">
            + {fitments.length - 10} fler fordon
          </Text>
        </div>
      )}
    </Container>
  )
}

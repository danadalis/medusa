import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading } from "@medusajs/ui"
import { SectionRow, AiFieldProposalProps } from "../../../../../components/common/section"
import { useAiProposals } from "../../../../../providers/ai-proposal-provider"

const specLabels: Record<string, string> = {
  bore_mm: "Boring (mm)",
  stroke_mm: "Slag (mm)",
  displacement_cc: "Cylindervolym (cc)",
  material: "Material",
  color: "Färg",
  dimensions: "Mått",
  chain_type: "Kedjetyp",
  teeth_count: "Antal kuggar",
  thread_size: "Gängstorlek",
  weight_grams: "Vikt (g)",
}

type Props = {
  product: HttpTypes.AdminProduct & { specifications?: any[]; metadata?: Record<string, any> }
}

export const ProductSpecificationSection = ({ product }: Props) => {
  const aiCtx = useAiProposals()

  const specs: Record<string, any> = {}
  if ((product as any).specifications?.length > 0) {
    for (const s of (product as any).specifications) {
      specs[s.spec_key] = s.value_text ?? s.value_numeric
    }
  } else if (product.metadata?.extracted_specs) {
    Object.assign(specs, product.metadata.extracted_specs)
  }

  const getProposal = (fieldName: string): AiFieldProposalProps | undefined => {
    if (!aiCtx) return undefined
    const p = aiCtx.proposals.find((pr) => pr.field === fieldName)
    if (!p) return undefined
    return {
      proposalId: p.proposalId,
      proposedValue: p.proposedValue,
      confidence: p.confidence,
      onApprove: (value) => aiCtx.approveProposal(p.proposalId, p.field, value),
      onReject: () => aiCtx.rejectProposal(p.proposalId),
      onEdit: (value) => aiCtx.approveProposal(p.proposalId, p.field, value),
    }
  }

  const allKeys = new Set([
    ...Object.keys(specs),
    ...(aiCtx?.proposals.filter((p) => p.proposalType === "attribute_extraction").map((p) => p.field) || []),
  ])

  if (allKeys.size === 0) return null

  const pendingCount = aiCtx?.proposals.filter((p) => p.proposalType === "attribute_extraction").length || 0

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heading level="h2">Specifikationer</Heading>
          {pendingCount > 0 && (
            <Badge color="orange" size="2xsmall">{pendingCount} AI</Badge>
          )}
        </div>
      </div>
      {Array.from(allKeys).map((key) => (
        <SectionRow
          key={key}
          title={specLabels[key] || key}
          value={specs[key] != null ? String(specs[key]) : null}
          aiProposal={getProposal(key)}
        />
      ))}
    </Container>
  )
}

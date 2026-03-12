import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading } from "@medusajs/ui"
import { SectionRow, AiFieldProposalProps } from "../../../../../components/common/section"
import { useAiProposals } from "../../../../../providers/ai-proposal-provider"

const intentFieldLabels: Record<string, string> = {
  part_type: "Produkttyp",
  intent_tags: "Intenttaggar",
  symptom_tags: "Symptomtaggar",
  use_case: "Användning",
  skill_level: "Svårighetsgrad",
  assembly_context: "Monteringskontext",
}

type Props = {
  product: HttpTypes.AdminProduct & {
    part_type?: string
    use_case?: string
    skill_level?: string
    assembly_context?: string
    intent_tags?: any[]
    metadata?: Record<string, any>
  }
}

export const ProductIntentSection = ({ product }: Props) => {
  const aiCtx = useAiProposals()

  const fields: Record<string, any> = {
    part_type: (product as any).part_type || product.metadata?.part_type || null,
    use_case: (product as any).use_case || product.metadata?.use_case || null,
    skill_level: (product as any).skill_level || product.metadata?.skill_level || null,
    assembly_context: (product as any).assembly_context || product.metadata?.assembly_context || null,
  }

  const intentTags = (product as any).intent_tags?.filter((t: any) => t.tag_type === "intent").map((t: any) => t.tag) || product.metadata?.intent_tags || []
  const symptomTags = (product as any).intent_tags?.filter((t: any) => t.tag_type === "symptom").map((t: any) => t.tag) || product.metadata?.symptom_tags || []

  if (intentTags.length > 0) fields.intent_tags = intentTags
  if (symptomTags.length > 0) fields.symptom_tags = symptomTags

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
    ...Object.keys(fields).filter((k) => fields[k] != null),
    ...(aiCtx?.proposals.filter((p) => p.proposalType === "intent_tagging").map((p) => p.field) || []),
  ])

  if (allKeys.size === 0) return null

  const pendingCount = aiCtx?.proposals.filter((p) => p.proposalType === "intent_tagging").length || 0

  const displayValue = (v: any): string => {
    if (Array.isArray(v)) return v.join(", ")
    return v != null ? String(v) : "-"
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Heading level="h2">Intent & klassificering</Heading>
          {pendingCount > 0 && (
            <Badge color="orange" size="2xsmall">{pendingCount} AI</Badge>
          )}
        </div>
      </div>
      {Array.from(allKeys).map((key) => (
        <SectionRow
          key={key}
          title={intentFieldLabels[key] || key}
          value={displayValue(fields[key])}
          aiProposal={getProposal(key)}
        />
      ))}
    </Container>
  )
}

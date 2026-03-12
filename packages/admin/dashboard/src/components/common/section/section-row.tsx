import { Badge, Button, Input, Text, clx } from "@medusajs/ui"
import { ReactNode, useState } from "react"

export type AiFieldProposalProps = {
  proposalId: string
  proposedValue: any
  confidence: number
  onApprove: (value: any) => void
  onReject: () => void
  onEdit: (value: any) => void
}

export type SectionRowProps = {
  title: string
  value?: ReactNode | string | null
  actions?: ReactNode
  aiProposal?: AiFieldProposalProps
}

const displayValue = (v: any): string => {
  if (v == null) return ""
  if (Array.isArray(v)) return v.join(", ")
  if (typeof v === "object") return JSON.stringify(v)
  return String(v)
}

const AiInlineProposal = ({
  currentValue,
  proposal,
}: {
  currentValue: string | null
  proposal: AiFieldProposalProps
}) => {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(
    displayValue(proposal.proposedValue)
  )

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          size="small"
          className="flex-1"
        />
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            let parsed: any = editValue
            try {
              parsed = JSON.parse(editValue)
            } catch {
              /* keep as string */
            }
            proposal.onEdit(parsed)
            setEditing(false)
          }}
        >
          Spara
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setEditing(false)}
        >
          Avbryt
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {currentValue && currentValue !== "-" && (
        <Text
          size="small"
          leading="compact"
          className="text-ui-fg-muted line-through"
        >
          {currentValue}
        </Text>
      )}
      <Text size="small" leading="compact" weight="plus">
        {displayValue(proposal.proposedValue)}
      </Text>
      <Badge color="orange" size="2xsmall">
        {Math.round(proposal.confidence * 100)}% AI
      </Badge>
      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="primary"
          size="small"
          onClick={() => proposal.onApprove(proposal.proposedValue)}
        >
          Godkänn
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => setEditing(true)}
        >
          Redigera
        </Button>
        <Button variant="danger" size="small" onClick={proposal.onReject}>
          Avvisa
        </Button>
      </div>
    </div>
  )
}

export const SectionRow = ({
  title,
  value,
  actions,
  aiProposal,
}: SectionRowProps) => {
  const isValueString = typeof value === "string" || !value
  const hasProposal = !!aiProposal

  return (
    <div
      className={clx(
        `text-ui-fg-subtle grid w-full items-center gap-4 px-6 py-4`,
        {
          "grid-cols-2": !actions && !hasProposal,
          "grid-cols-[1fr_1fr_28px]": !!actions && !hasProposal,
          "grid-cols-[160px_1fr]": hasProposal,
          "border-l-[3px] border-l-orange-400": hasProposal,
        }
      )}
    >
      <Text size="small" weight="plus" leading="compact">
        {title}
      </Text>

      {hasProposal ? (
        <AiInlineProposal
          currentValue={isValueString ? String(value ?? "-") : null}
          proposal={aiProposal!}
        />
      ) : isValueString ? (
        <Text
          size="small"
          leading="compact"
          className="whitespace-pre-line text-pretty"
        >
          {value ?? "-"}
        </Text>
      ) : (
        <div className="flex flex-wrap gap-1">{value}</div>
      )}

      {!hasProposal && actions && <div>{actions}</div>}
    </div>
  )
}

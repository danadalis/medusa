import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react"
import { sdk } from "../../lib/client"

type AiFieldProposal = {
  proposalId: string
  proposalType: string
  field: string
  proposedValue: any
  currentValue: any
  confidence: number
  createdAt: string
}

type AiProposalContextType = {
  proposals: AiFieldProposal[]
  pendingCount: number
  isLoading: boolean
  approveProposal: (proposalId: string, field: string, value?: any) => Promise<void>
  rejectProposal: (proposalId: string) => Promise<void>
  refresh: () => void
}

const AiProposalContext = createContext<AiProposalContextType | null>(null)

export const useAiProposals = () => {
  return useContext(AiProposalContext)
}

export const useAiFieldProposal = (fieldName: string) => {
  const ctx = useContext(AiProposalContext)
  if (!ctx) return null
  return ctx.proposals.find((p) => p.field === fieldName) || null
}

export const AiProposalProvider = ({
  productId,
  children,
}: {
  productId: string
  children: ReactNode
}) => {
  const [proposals, setProposals] = useState<AiFieldProposal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadProposals = useCallback(async () => {
    if (!productId) return
    setIsLoading(true)
    try {
      const response = await fetch(`/admin/ai/products/${productId}`, {
        credentials: "include",
      })
      if (!response.ok) {
        setProposals([])
        return
      }
      const data = await response.json()
      const flat: AiFieldProposal[] = []

      for (const [proposalType, group] of Object.entries(data.proposals || {})) {
        for (const proposal of group as any[]) {
          if (proposal.status !== "pending") continue
          const changes = proposal.proposed_changes || {}
          for (const [field, value] of Object.entries(changes)) {
            if (field.startsWith("_")) continue
            flat.push({
              proposalId: proposal.id,
              proposalType,
              field,
              proposedValue: value,
              currentValue: null,
              confidence: proposal.confidence || 0,
              createdAt: proposal.created_at,
            })
          }
        }
      }

      setProposals(flat)
    } catch {
      setProposals([])
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  useEffect(() => {
    loadProposals()
  }, [loadProposals])

  const approveProposal = async (proposalId: string, field: string, value?: any) => {
    const body: any = { proposal_ids: [proposalId] }
    if (value !== undefined) {
      body.edits = { [proposalId]: { [field]: value } }
    }
    await fetch(`/admin/ai/products/${productId}/approve`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    loadProposals()
  }

  const rejectProposal = async (proposalId: string) => {
    await fetch(`/admin/ai/proposals/${proposalId}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Rejected from product detail" }),
    })
    loadProposals()
  }

  const pendingCount = proposals.length

  return (
    <AiProposalContext.Provider
      value={{ proposals, pendingCount, isLoading, approveProposal, rejectProposal, refresh: loadProposals }}
    >
      {children}
    </AiProposalContext.Provider>
  )
}

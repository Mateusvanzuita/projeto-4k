"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alimento } from "@/types/alimento"

interface AlimentoCardProps {
  alimento: Alimento
  onEdit: (alimento: Alimento) => void
  onDelete: (id: string) => void
}

const CATEGORIA_LABELS: Record<string, string> = {
  CARBOIDRATO: "Carboidrato",
  PROTEINA: "Proteína",
  GORDURA: "Gordura",
  FIBRA: "Fibra",
  VEGETAL: "Vegetal",
  FRUTA: "Fruta",
  LATICINIO: "Laticínio",
  OUTRO: "Outro",
}

const CATEGORIA_COLORS: Record<string, string> = {
  CARBOIDRATO: "bg-blue-500/10 text-blue-700 border-blue-200",
  PROTEINA: "bg-red-500/10 text-red-700 border-red-200",
  GORDURA: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  FIBRA: "bg-green-500/10 text-green-700 border-green-200",
  VEGETAL: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  FRUTA: "bg-purple-500/10 text-purple-700 border-purple-200",
  LATICINIO: "bg-orange-500/10 text-orange-700 border-orange-200",
  OUTRO: "bg-gray-500/10 text-gray-700 border-gray-200",
}

export function AlimentoCard({ alimento, onEdit, onDelete }: AlimentoCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header com título e botões */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{alimento.nome}</h3>
          <Badge 
            className={CATEGORIA_COLORS[alimento.categoria] || CATEGORIA_COLORS.OUTRO}
          >
            {CATEGORIA_LABELS[alimento.categoria] || alimento.categoria}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(alimento)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(alimento.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Observações */}
      {alimento.observacoes && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-1">Observações</p>
          <p className="text-sm line-clamp-2">{alimento.observacoes}</p>
        </div>
      )}
    </Card>
  )
}
"use client"

import type { Suplemento, CategoriaSuplemento } from "@/types/suplemento"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Pill } from "lucide-react"

interface SuplementoCardProps {
  suplemento: Suplemento
  onEdit: (suplemento: Suplemento) => void
  onDelete: (id: string) => void
}

const TIPO_COLORS: Record<string, string> = {
  suplemento: "bg-blue-500/10 text-blue-700 border-blue-200",
  manipulado: "bg-purple-500/10 text-purple-700 border-purple-200",
}

const CATEGORIA_LABELS: Record<CategoriaSuplemento, string> = {
  TERMOGENICO: "Termogênico",
  PRE_TREINO: "Pré-Treino",
  HORMONAL: "Hormonal",
  ANTIOXIDANTE: "Antioxidante",
  DIGESTIVO: "Digestivo",
  SONO: "Sono",
  VITAMINA: "Vitamina",
  MINERAL: "Mineral",
  PROTEINA: "Proteína",
  CREATINA: "Creatina",
  BCAA: "BCAA",
  OUTRO: "Outro",
}

const CATEGORIA_COLORS: Record<CategoriaSuplemento, string> = {
  TERMOGENICO: "bg-red-500/10 text-red-700 border-red-200",
  PRE_TREINO: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  HORMONAL: "bg-orange-500/10 text-orange-700 border-orange-200",
  ANTIOXIDANTE: "bg-green-500/10 text-green-700 border-green-200",
  DIGESTIVO: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  SONO: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  VITAMINA: "bg-purple-500/10 text-purple-700 border-purple-200",
  MINERAL: "bg-pink-500/10 text-pink-700 border-pink-200",
  PROTEINA: "bg-blue-500/10 text-blue-700 border-blue-200",
  CREATINA: "bg-teal-500/10 text-teal-700 border-teal-200",
  BCAA: "bg-lime-500/10 text-lime-700 border-lime-200",
  OUTRO: "bg-gray-500/10 text-gray-700 border-gray-200",
}

export function SuplementoCard({ suplemento, onEdit, onDelete }: SuplementoCardProps) {
  const tipoLower = suplemento.tipo.toLowerCase();
  const nomeExibicao = tipoLower === "suplemento" ? suplemento.nomeSuplemento : suplemento.nomeManipulado;
  const labelTipo = tipoLower === "suplemento" ? "Suplemento" : "Manipulado";
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header com título e botões */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Pill className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate" title={nomeExibicao}>
              {nomeExibicao || ''}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge 
                className={TIPO_COLORS[suplemento.tipo.toLowerCase()]}
              >
                {labelTipo}
              </Badge>
              {suplemento.categoria && (
                <Badge 
                  className={CATEGORIA_COLORS[suplemento.categoria]}
                >
                  {CATEGORIA_LABELS[suplemento.categoria]}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(suplemento)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(suplemento.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-2">
        {suplemento.observacoes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Observações</p>
            <p className="text-sm line-clamp-2">{suplemento.observacoes}</p>
          </div>
        )}

        {suplemento.contraindicacoes && (
          <div className="pt-2 border-t border-destructive/20">
            <p className="text-xs text-destructive font-medium mb-1">Contraindicações</p>
            <p className="text-sm line-clamp-2 text-destructive/90">{suplemento.contraindicacoes}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
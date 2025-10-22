"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Mail, Phone, Target } from "lucide-react"
import type { Aluno } from "@/types/aluno"
import { PLANO_LABELS, TIPO_PLANO_LABELS, OBJETIVO_LABELS } from "@/types/aluno"

interface AlunoCardProps {
  aluno: Aluno
  onEdit: (aluno: Aluno) => void
  onDelete: (id: string) => void
  onClick: (id: string) => void
}

const OBJETIVO_COLORS: Record<string, string> = {
  perda_peso: "bg-red-500/10 text-red-700 border-red-200",
  hipertrofia: "bg-blue-500/10 text-blue-700 border-blue-200",
  definicao: "bg-purple-500/10 text-purple-700 border-purple-200",
  saude: "bg-green-500/10 text-green-700 border-green-200",
  performance: "bg-orange-500/10 text-orange-700 border-orange-200",
  reabilitacao: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
}

const TIPO_PLANO_COLORS: Record<string, string> = {
  treino: "bg-blue-500/10 text-blue-700 border-blue-200",
  dieta: "bg-green-500/10 text-green-700 border-green-200",
  full: "bg-[#F2B139]/10 text-[#F2B139] border-[#F2B139]/20",
}

export function AlunoCard({ aluno, onEdit, onDelete, onClick }: AlunoCardProps) {
  const imc = (aluno.peso / (aluno.altura / 100) ** 2).toFixed(1)

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(aluno.id)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#003E63]/10 flex items-center justify-center">
            <User className="w-6 h-6 text-[#003E63]" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{aluno.nomeCompleto}</h3>
            <p className="text-sm text-muted-foreground">
              {aluno.idade} anos • {aluno.sexo}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(aluno)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(aluno.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{aluno.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{aluno.contato}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-4 h-4" />
          <span>
            {aluno.altura}cm • {aluno.peso}kg • IMC: {imc}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className={OBJETIVO_COLORS[aluno.objetivo]}>{OBJETIVO_LABELS[aluno.objetivo]}</Badge>
        <Badge className={TIPO_PLANO_COLORS[aluno.tipoPlano]}>{TIPO_PLANO_LABELS[aluno.tipoPlano]}</Badge>
        <Badge variant="outline">{PLANO_LABELS[aluno.plano]}</Badge>
        {!aluno.ativo && (
          <Badge variant="destructive" className="ml-auto">
            Inativo
          </Badge>
        )}
      </div>
    </Card>
  )
}

"use client"

import { Edit, Trash2, Dumbbell, SquarePlay } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Exercicio } from "@/types/exercicio"

interface ExercicioCardProps {
  exercicio: Exercicio
  onEdit: (exercicio: Exercicio) => void
  onDelete: (id: string) => void
}

const GRUPO_LABELS: Record<string, string> = {
  peito: "Peito",
  costas: "Costas",
  ombros: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  pernas: "Pernas",
  gluteos: "Glúteos",
  abdomen: "Abdômen",
  panturrilha: "Panturrilha",
  antebraco: "Antebraço",
  cardio: "Cardio",
  "corpo-inteiro": "Corpo Inteiro",
}

const GRUPO_COLORS: Record<string, string> = {
  peito: "bg-red-500/10 text-red-700 border-red-200",
  costas: "bg-blue-500/10 text-blue-700 border-blue-200",
  ombros: "bg-purple-500/10 text-purple-700 border-purple-200",
  biceps: "bg-green-500/10 text-green-700 border-green-200",
  triceps: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  pernas: "bg-orange-500/10 text-orange-700 border-orange-200",
  gluteos: "bg-pink-500/10 text-pink-700 border-pink-200",
  abdomen: "bg-cyan-500/10 text-cyan-700 border-cyan-200",
  panturrilha: "bg-indigo-500/10 text-indigo-700 border-indigo-200",
  antebraco: "bg-teal-500/10 text-teal-700 border-teal-200",
  cardio: "bg-rose-500/10 text-rose-700 border-rose-200",
  "corpo-inteiro": "bg-violet-500/10 text-violet-700 border-violet-200",
}

const DIFICULDADE_LABELS: Record<string, string> = {
  leve: "Leve",
  medio: "Médio",
  pesado: "Pesado",
}

const EQUIPAMENTO_LABELS: Record<string, string> = {
  "peso-livre": "Peso Livre",
  maquina: "Máquina",
  "peso-corporal": "Peso Corporal",
  elastico: "Elástico",
  cabo: "Cabo",
  outro: "Outro",
}

export function ExercicioCard({ exercicio, onEdit, onDelete }: ExercicioCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header com título e botões */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate">{exercicio.nome}</h3>
            <Badge className={GRUPO_COLORS[exercicio.grupoMuscular] || "bg-gray-500/10 text-gray-700"}>
              {GRUPO_LABELS[exercicio.grupoMuscular] || exercicio.grupoMuscular}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(exercicio)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(exercicio.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Informações do exercício */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Equipamento</p>
            <p className="font-medium">
              {EQUIPAMENTO_LABELS[exercicio.equipamento] || exercicio.equipamento}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Dificuldade</p>
            <p className="font-medium">{DIFICULDADE_LABELS[exercicio.dificuldade]}</p>
          </div>
        </div>

        {exercicio.videoUrl && (
          <a
            href={exercicio.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <SquarePlay className="h-4 w-4" />
            Ver vídeo demonstrativo
          </a>
        )}

        {exercicio.observacoes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Observações</p>
            <p className="text-sm line-clamp-2">{exercicio.observacoes}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
"use client"

import { Edit2, Trash2, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Exercicio } from "@/types/exercicio"

interface ExercicioCardProps {
  exercicio: Exercicio
  onEdit: (exercicio: Exercicio) => void
  onDelete: (id: string) => void
}

const grupoLabels: Record<string, string> = {
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

const grupoColors: Record<string, string> = {
  peito: "bg-red-100 text-red-800",
  costas: "bg-blue-100 text-blue-800",
  ombros: "bg-purple-100 text-purple-800",
  biceps: "bg-green-100 text-green-800",
  triceps: "bg-yellow-100 text-yellow-800",
  pernas: "bg-orange-100 text-orange-800",
  gluteos: "bg-pink-100 text-pink-800",
  abdomen: "bg-cyan-100 text-cyan-800",
  panturrilha: "bg-indigo-100 text-indigo-800",
  antebraco: "bg-teal-100 text-teal-800",
  cardio: "bg-rose-100 text-rose-800",
  "corpo-inteiro": "bg-violet-100 text-violet-800",
}

const dificuldadeLabels: Record<string, string> = {
  leve: "Leve",
  medio: "Médio",
  pesado: "Pesado",
}

export function ExercicioCard({ exercicio, onEdit, onDelete }: ExercicioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{exercicio.nome}</CardTitle>
          <Badge className={grupoColors[exercicio.grupoMuscular]} variant="secondary">
            {grupoLabels[exercicio.grupoMuscular]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Equipamento</p>
            <p className="font-semibold capitalize">{exercicio.equipamento.replace("-", " ")}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Dificuldade</p>
            <p className="font-semibold">{dificuldadeLabels[exercicio.dificuldade]}</p>
          </div>
        </div>

        {exercicio.videoUrl && (
          <a
            href={exercicio.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <Youtube className="h-4 w-4" />
            Ver vídeo
          </a>
        )}

        {exercicio.observacoes && (
          <div className="text-sm">
            <p className="text-muted-foreground">Observações</p>
            <p className="text-sm line-clamp-2">{exercicio.observacoes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(exercicio)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive bg-transparent"
          onClick={() => onDelete(exercicio.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}

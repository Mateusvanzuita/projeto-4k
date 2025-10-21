"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Alimento } from "@/types/alimento"

interface AlimentoCardProps {
  alimento: Alimento
  onEdit: (alimento: Alimento) => void
  onDelete: (id: string) => void
}

const tipoLabels: Record<string, string> = {
  carboidrato: "Carboidrato",
  proteina: "Proteína",
  gordura: "Gordura",
  fibra: "Fibra",
  vegetal: "Vegetal",
  fruta: "Fruta",
  outro: "Outro",
}

const tipoColors: Record<string, string> = {
  carboidrato: "bg-blue-100 text-blue-800",
  proteina: "bg-red-100 text-red-800",
  gordura: "bg-yellow-100 text-yellow-800",
  fibra: "bg-green-100 text-green-800",
  vegetal: "bg-emerald-100 text-emerald-800",
  fruta: "bg-purple-100 text-purple-800",
  outro: "bg-gray-100 text-gray-800",
}

export function AlimentoCard({ alimento, onEdit, onDelete }: AlimentoCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{alimento.nome}</CardTitle>
          <Badge className={tipoColors[alimento.tipo]} variant="secondary">
            {tipoLabels[alimento.tipo]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Calorias</p>
            <p className="font-semibold">{alimento.calorias} kcal</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantidade</p>
            <p className="font-semibold">
              {alimento.quantidadePadrao} {alimento.unidadeMedida}
            </p>
          </div>
        </div>

        {alimento.observacoes && (
          <div className="text-sm">
            <p className="text-muted-foreground">Observações</p>
            <p className="text-sm line-clamp-2">{alimento.observacoes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(alimento)}>
          <Edit2 className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive hover:text-destructive bg-transparent"
          onClick={() => onDelete(alimento.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  )
}

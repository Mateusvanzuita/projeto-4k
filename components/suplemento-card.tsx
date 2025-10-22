"use client"

import type { Suplemento } from "@/types/suplemento"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Pill } from "lucide-react"

interface SuplementoCardProps {
  suplemento: Suplemento
  onEdit: (suplemento: Suplemento) => void
  onDelete: (id: string) => void
}

const tipoColors = {
  suplemento: "bg-blue-500/10 text-blue-700 border-blue-200",
  manipulado: "bg-purple-500/10 text-purple-700 border-purple-200",
}

export function SuplementoCard({ suplemento, onEdit, onDelete }: SuplementoCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Pill className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base leading-tight mb-1 truncate">{suplemento.nome}</h3>
              <Badge variant="outline" className={tipoColors[suplemento.tipo]}>
                {suplemento.tipo === "suplemento" ? "Suplemento" : "Manipulado"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(suplemento)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(suplemento.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dose:</span>
          <span className="font-medium">{suplemento.doseRecomendada}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Marca:</span>
          <span className="font-medium truncate ml-2">{suplemento.marca}</span>
        </div>
        {suplemento.observacoes && (
          <div className="pt-2 border-t">
            <p className="text-muted-foreground text-xs line-clamp-2">{suplemento.observacoes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

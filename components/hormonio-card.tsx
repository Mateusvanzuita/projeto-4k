"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Pill, Syringe, Droplet, Tablet } from "lucide-react"
import type { Hormonio } from "@/types/hormonio"

interface HormonioCardProps {
  hormonio: Hormonio
  onEdit: (hormonio: Hormonio) => void
  onDelete: (id: string) => void
}

const categoriaConfig = {
  anabolico: { label: "Anabólico", color: "bg-red-500/10 text-red-700 border-red-200" },
  peptideo: { label: "Peptídeo", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  tireoidiano: { label: "Tireoidiano", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  gh: { label: "GH", color: "bg-green-500/10 text-green-700 border-green-200" },
  outro: { label: "Outro", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
}

const viaIcons = {
  oral: Tablet,
  injetavel: Syringe,
  topico: Droplet,
  sublingual: Pill,
}

export function HormonioCard({ hormonio, onEdit, onDelete }: HormonioCardProps) {
  const categoriaInfo = categoriaConfig[hormonio.categoria]
  const ViaIcon = viaIcons[hormonio.viaAdministracao]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate mb-1">{hormonio.nome}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={categoriaInfo.color}>
                {categoriaInfo.label}
              </Badge>
              <Badge variant="outline" className="bg-accent/50">
                <ViaIcon className="w-3 h-3 mr-1" />
                {hormonio.viaAdministracao}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(hormonio)}
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(hormonio.id)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Dose:</span>
            <span className="font-medium text-foreground">{hormonio.dose}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frequência:</span>
            <span className="font-medium text-foreground">{hormonio.frequencia}</span>
          </div>
          {hormonio.tempoMeiaVida && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meia-Vida:</span>
              <span className="font-medium text-foreground">{hormonio.tempoMeiaVida}</span>
            </div>
          )}
          {hormonio.fabricante && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fabricante:</span>
              <span className="font-medium text-foreground truncate ml-2">{hormonio.fabricante}</span>
            </div>
          )}
          {hormonio.observacoes && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground text-xs line-clamp-2">{hormonio.observacoes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

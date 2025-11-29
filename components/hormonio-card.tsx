"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Syringe, Droplet, Tablet, Pill, FlaskConical, Stethoscope } from "lucide-react"
import type { Hormonio } from "@/types/hormonio"

interface HormonioCardProps {
  hormonio: Hormonio
  onEdit: (hormonio: Hormonio) => void
  onDelete: (id: string) => void
}

// Mapeamento de Categorias
const CATEGORIA_CONFIG = {
  ANABOLICO: { label: "Anabólico", color: "bg-red-500/10 text-red-700 border-red-200" },
  PEPTIDEO_TERAPEUTICO: { label: "Peptídeo Terapêutico", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  T3: { label: "Tireoidiano", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  SOMATOTROPINA: { label: "GH", color: "bg-green-500/10 text-green-700 border-green-200" },
  MODULADOR_HORMONAL: { label: "Modulador", color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" },
  OUTRO: { label: "Outro", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
}

const VIA_ICONS = {
  ORAL: Tablet,
  INTRAMUSCULAR: Syringe,
  SUBCUTANEA: Droplet,
  TOPICA: Droplet,
  NASAL: FlaskConical,
  INTRAVENOSA: Stethoscope,
}

const VIA_LABELS: Record<string, string> = {
  ORAL: "Oral",
  INTRAMUSCULAR: "Intramuscular",
  SUBCUTANEA: "Subcutânea",
  TOPICA: "Tópica",
  NASAL: "Nasal",
  INTRAVENOSA: "Intravenosa",
}

export function HormonioCard({ hormonio, onEdit, onDelete }: HormonioCardProps) {
  const categoriaLabel = hormonio.categoria.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  const categoriaInfo = CATEGORIA_CONFIG[hormonio.categoria] || { 
    label: categoriaLabel, 
    color: "bg-gray-500/10 text-gray-700 border-gray-200" 
  }
  
  const ViaIcon = VIA_ICONS[hormonio.viaAdministracao] || Pill
  const viaLabel = VIA_LABELS[hormonio.viaAdministracao] || hormonio.viaAdministracao

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header com título e botões */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ViaIcon className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate" title={hormonio.nome}>
              {hormonio.nome}
            </h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <Badge className={categoriaInfo.color}>
                {categoriaInfo.label}
              </Badge>
              <Badge variant="outline" className="bg-accent/50">
                <ViaIcon className="w-3 h-3 mr-1" />
                {viaLabel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(hormonio)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(hormonio.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="space-y-2">
        {hormonio.observacoes && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">Observações</p>
            <p className="text-sm line-clamp-2">{hormonio.observacoes}</p>
          </div>
        )}
        
        {hormonio.contraindicacoes && (
          <div className="pt-2 border-t border-destructive/20">
            <p className="text-xs text-destructive font-medium mb-1">Contraindicações</p>
            <p className="text-sm line-clamp-2 text-destructive/90">{hormonio.contraindicacoes}</p>
          </div>
        )}
        
        {hormonio.efeitosColaterais && (
          <div className="pt-2 border-t border-yellow-500/20">
            <p className="text-xs text-yellow-700 font-medium mb-1">Efeitos Colaterais</p>
            <p className="text-sm line-clamp-2 text-yellow-700/90">{hormonio.efeitosColaterais}</p>
          </div>
        )}
      </div>
    </Card>
  )
}
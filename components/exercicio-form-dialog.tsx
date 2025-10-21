"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Exercicio, ExercicioFormData, GrupoMuscular, Equipamento, Dificuldade } from "@/types/exercicio"

interface ExercicioFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExercicioFormData) => Promise<void>
  exercicio?: Exercicio | null
  isLoading?: boolean
}

const gruposMusculares: { value: GrupoMuscular; label: string }[] = [
  { value: "peito", label: "Peito" },
  { value: "costas", label: "Costas" },
  { value: "ombros", label: "Ombros" },
  { value: "biceps", label: "Bíceps" },
  { value: "triceps", label: "Tríceps" },
  { value: "pernas", label: "Pernas" },
  { value: "gluteos", label: "Glúteos" },
  { value: "abdomen", label: "Abdômen" },
  { value: "panturrilha", label: "Panturrilha" },
  { value: "antebraco", label: "Antebraço" },
  { value: "cardio", label: "Cardio" },
  { value: "corpo-inteiro", label: "Corpo Inteiro" },
]

const equipamentos: { value: Equipamento; label: string }[] = [
  { value: "barra", label: "Barra" },
  { value: "halteres", label: "Halteres" },
  { value: "maquina", label: "Máquina" },
  { value: "peso-corporal", label: "Peso Corporal" },
  { value: "cabo", label: "Cabo" },
  { value: "kettlebell", label: "Kettlebell" },
  { value: "elastico", label: "Elástico" },
  { value: "medicine-ball", label: "Medicine Ball" },
  { value: "outros", label: "Outros" },
]

const dificuldades: { value: Dificuldade; label: string }[] = [
  { value: "leve", label: "Leve" },
  { value: "medio", label: "Médio" },
  { value: "pesado", label: "Pesado" },
]

export function ExercicioFormDialog({ open, onOpenChange, onSubmit, exercicio, isLoading }: ExercicioFormDialogProps) {
  const [formData, setFormData] = useState<ExercicioFormData>({
    nome: "",
    grupoMuscular: "peito",
    equipamento: "barra",
    dificuldade: "medio",
    videoUrl: "",
    observacoes: "",
  })

  useEffect(() => {
    if (exercicio) {
      setFormData({
        nome: exercicio.nome,
        grupoMuscular: exercicio.grupoMuscular,
        equipamento: exercicio.equipamento,
        dificuldade: exercicio.dificuldade,
        videoUrl: exercicio.videoUrl || "",
        observacoes: exercicio.observacoes || "",
      })
    } else {
      setFormData({
        nome: "",
        grupoMuscular: "peito",
        equipamento: "barra",
        dificuldade: "medio",
        videoUrl: "",
        observacoes: "",
      })
    }
  }, [exercicio, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{exercicio ? "Editar Exercício" : "Adicionar Exercício"}</DialogTitle>
          <DialogDescription>
            {exercicio ? "Atualize as informações do exercício." : "Preencha os dados do novo exercício."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Exercício *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Supino Reto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grupoMuscular">Grupo Muscular *</Label>
            <Select
              value={formData.grupoMuscular}
              onValueChange={(value: GrupoMuscular) => setFormData({ ...formData, grupoMuscular: value })}
            >
              <SelectTrigger id="grupoMuscular">
                <SelectValue placeholder="Selecione o grupo muscular" />
              </SelectTrigger>
              <SelectContent>
                {gruposMusculares.map((grupo) => (
                  <SelectItem key={grupo.value} value={grupo.value}>
                    {grupo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamento">Equipamento *</Label>
            <Select
              value={formData.equipamento}
              onValueChange={(value: Equipamento) => setFormData({ ...formData, equipamento: value })}
            >
              <SelectTrigger id="equipamento">
                <SelectValue placeholder="Selecione o equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipamentos.map((equip) => (
                  <SelectItem key={equip.value} value={equip.value}>
                    {equip.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dificuldade">Dificuldade *</Label>
            <Select
              value={formData.dificuldade}
              onValueChange={(value: Dificuldade) => setFormData({ ...formData, dificuldade: value })}
            >
              <SelectTrigger id="dificuldade">
                <SelectValue placeholder="Selecione a dificuldade" />
              </SelectTrigger>
              <SelectContent>
                {dificuldades.map((dif) => (
                  <SelectItem key={dif.value} value={dif.value}>
                    {dif.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl">Link do Vídeo (YouTube)</Label>
            <Input
              id="videoUrl"
              type="url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Dicas de execução, variações, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : exercicio ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

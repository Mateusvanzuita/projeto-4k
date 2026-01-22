"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface StepIdentidadeProps {
  data: {
    nome: string
    objetivo: string
    inicio: string
    validade: string
    descricao?: string
  }
  update: (data: any) => void
}

export function StepIdentidade({ data, update }: StepIdentidadeProps) {
  const handleChange = (campo: string, valor: string) => {
    update({ ...data, [campo]: valor })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Identidade do Protocolo</h2>
        <p className="text-muted-foreground">
          Defina o contexto geral e o objetivo principal deste planejamento.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Nome do Protocolo */}
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Protocolo</Label>
          <Input
            id="nome"
            placeholder="Ex: Cutting Fase 1 - Verão"
            value={data.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Objetivo Principal */}
          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo Principal</Label>
            <Select 
              value={data.objetivo} 
              onValueChange={(v) => handleChange("objetivo", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cutting">Cutting (Perda de Gordura)</SelectItem>
                <SelectItem value="Bulking">Bulking (Ganho de Massa)</SelectItem>
                <SelectItem value="Recomp">Recomp (Recomposição)</SelectItem>
                <SelectItem value="Manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duração/Vencimento */}
          <div className="space-y-2">
            <Label htmlFor="validade">Data de Vencimento (Opcional)</Label>
            <Input
              id="validade"
              type="date"
              value={data.validade}
              onChange={(e) => handleChange("validade", e.target.value)}
            />
          </div>
        </div>

        {/* Observação Curta */}
        <div className="space-y-2">
          <Label htmlFor="descricao">Observações Gerais (Curta)</Label>
          <Textarea
            id="descricao"
            placeholder="Breve resumo das regras deste protocolo..."
            className="resize-none"
            maxLength={300} // Limite conforme regra de UX
            value={data.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {data.descricao?.length || 0}/300 caracteres
          </p>
        </div>
      </div>
    </div>
  )
}
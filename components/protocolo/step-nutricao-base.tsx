"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Droplets, Target, ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StepNutricaoBaseProps {
  data: {
    estrategia: string
    macros: { p: number; c: number; g: number }
    totalCalorico: number
    consumoAgua: string
    regrasGerais?: string
  }
  update: (data: any) => void
}

export function StepNutricaoBase({ data, update }: StepNutricaoBaseProps) {
  const handleChange = (campo: string, valor: any) => {
    update({ ...data, [campo]: valor })
  }

  const handleMacroChange = (macro: string, valor: number) => {
    const novosMacros = { ...data.macros, [macro]: valor }
    // Cálculo simples de calorias: P*4 + C*4 + G*9
    const novoTotal = (novosMacros.p * 4) + (novosMacros.c * 4) + (novosMacros.g * 9)
    update({ ...data, macros: novosMacros, totalCalorico: novoTotal })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Estratégia Nutricional</h2>
        <p className="text-muted-foreground">
          Defina as metas de macronutrientes e as diretrizes globais do plano.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bloco de Macros */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" /> Alvos de Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase">Proteína (g)</Label>
                <Input 
                  type="number" 
                  value={data.macros.p || ""} 
                  onChange={(e) => handleMacroChange("p", Number(e.target.value))}
                  className="border-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase">Carbo (g)</Label>
                <Input 
                  type="number" 
                  value={data.macros.c || ""} 
                  onChange={(e) => handleMacroChange("c", Number(e.target.value))}
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase">Gordura (g)</Label>
                <Input 
                  type="number" 
                  value={data.macros.g || ""} 
                  onChange={(e) => handleMacroChange("g", Number(e.target.value))}
                  className="border-yellow-200 focus:border-yellow-500"
                />
              </div>
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground">Total Estimado:</span>
              <Badge variant="secondary" className="text-lg font-mono px-3">
                {data.totalCalorico || 0} <span className="text-[10px] ml-1">kcal</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Dieta */}
        <Card className="shadow-sm border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" /> Configuração do Plano
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Tipo de Dieta</Label>
              <Select value={data.estrategia} onValueChange={(v) => handleChange("estrategia", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estruturada">Estruturada (Refeições Fixas)</SelectItem>
                  <SelectItem value="Flexivel">Flexível (Macros Totais)</SelectItem>
                  <SelectItem value="Livre">Livre com Sugestões</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase flex items-center gap-1">
                <Droplets className="h-3 w-3 text-blue-500" /> Consumo de Água (Diário)
              </Label>
              <Input 
                placeholder="Ex: 4 a 5 litros" 
                value={data.consumoAgua} 
                onChange={(e) => handleChange("consumoAgua", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regras Gerais */}
      <Card className="shadow-sm border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Diretrizes e Regras Globais</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea 
            className="w-full min-h-[100px] p-3 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Ex: Refeição livre aos sábados à noite; Vegetais verdes liberados em todas as refeições; Não trocar fontes de gordura por carbo..."
            value={data.regrasGerais}
            onChange={(e) => handleChange("regrasGerais", e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
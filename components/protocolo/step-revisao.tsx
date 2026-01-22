"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Edit3, User, Utensils, Syringe, Dumbbell, 
  ClipboardCheck, Clock, Pill, Activity, Info 
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StepRevisaoProps {
  data: any
  onEdit: (step: number) => void
}

export function StepRevisao({ data, onEdit }: StepRevisaoProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-green-700">
          <ClipboardCheck className="h-6 w-6" /> Revisão do Protocolo
        </h2>
        <p className="text-muted-foreground text-sm">Confira todas as seções antes de finalizar e ativar o planejamento.</p>
      </div>

      <Accordion type="multiple" defaultValue={["identidade"]} className="w-full space-y-3">
        
        {/* 1 & 2. IDENTIDADE E ALUNO */}
        <AccordionItem value="identidade" className="border rounded-xl px-4 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex gap-3 items-center">
              <User className="h-5 w-5 text-[#004767]" />
              <div className="text-left">
                <p className="text-sm font-bold">Identidade e Aluno</p>
                <p className="text-[10px] text-muted-foreground uppercase">{data.identidade.nome || "Sem Nome"} • {data.identidade.objetivo}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 space-y-3 border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><span className="font-bold opacity-60">Aluno:</span> {data.aluno.nome || "Não selecionado"}</div>
              <div><span className="font-bold opacity-60">Peso/Altura:</span> {data.aluno.peso}kg / {data.aluno.altura}cm</div>
              <div className="col-span-2"><span className="font-bold opacity-60">Vencimento:</span> {data.identidade.validade || "Não definida"}</div>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="h-7 text-[10px] uppercase">
              <Edit3 className="h-3 w-3 mr-1" /> Editar Dados
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 3 & 4. NUTRIÇÃO E REFEIÇÕES */}
        <AccordionItem value="nutricao" className="border rounded-xl px-4 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex gap-3 items-center">
              <Utensils className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-bold">Plano Nutricional</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {data.nutricao.refeicoes?.length || 0} Refeições • Estratégia: {data.nutricao.estrategia}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 border-t pt-4 space-y-4">
            <div className="flex gap-2">
               <Badge variant="secondary">P: {data.nutricao.macros?.p}g</Badge>
               <Badge variant="secondary">C: {data.nutricao.macros?.c}g</Badge>
               <Badge variant="secondary">G: {data.nutricao.macros?.g}g</Badge>
            </div>
            <div className="space-y-2">
              {data.nutricao.refeicoes?.map((ref: any, i: number) => (
                <div key={i} className="text-xs p-2 bg-slate-50 rounded border">
                  <span className="font-bold text-green-700">{ref.horario} - {ref.nome}</span>
                  <p className="text-muted-foreground mt-1">{ref.itens?.map((it: any) => `${it.quantidade}${it.unidade} ${it.alimento}`).join(", ")}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)} className="h-7 text-[10px] uppercase">
              <Edit3 className="h-3 w-3 mr-1" /> Editar Dieta
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 5. SUPLEMENTOS E MANIPULADOS */}
        <AccordionItem value="suplementos" className="border rounded-xl px-4 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex gap-3 items-center">
              <Pill className="h-5 w-5 text-yellow-600" />
              <div className="text-left">
                <p className="text-sm font-bold">Suplementação</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {(data.suplementos?.length || 0) + (data.manipulados?.length || 0)} Itens prescritos
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 border-t pt-4 space-y-2">
            {[...data.suplementos, ...data.manipulados].map((sup: any, i: number) => (
              <div key={i} className="text-xs flex justify-between p-1 border-b last:border-0">
                <span className="font-medium">{sup.nome}</span>
                <span className="text-muted-foreground">{sup.dose} - {sup.horario}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => onEdit(5)} className="h-7 text-[10px] uppercase mt-2">
              <Edit3 className="h-3 w-3 mr-1" /> Editar Suplementos
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 6. HORMÔNIOS */}
        <AccordionItem value="hormonios" className="border rounded-xl px-4 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex gap-3 items-center">
              <Syringe className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <p className="text-sm font-bold">Recursos Hormonais</p>
                <p className="text-[10px] text-muted-foreground uppercase">{data.hormonios?.length || 0} Substâncias</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 border-t pt-4 space-y-2">
            {data.hormonios?.map((h: any, i: number) => (
              <div key={i} className="text-xs p-2 bg-purple-50 rounded border border-purple-100 flex justify-between">
                <span className="font-bold text-purple-700">{h.hormonioId}</span>
                <span>{h.doseSemanal}mg/sem - {h.duracao}</span>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => onEdit(6)} className="h-7 text-[10px] uppercase mt-2">
              <Edit3 className="h-3 w-3 mr-1" /> Editar Ciclo
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 7. TREINO */}
        <AccordionItem value="treino" className="border rounded-xl px-4 bg-white shadow-sm">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex gap-3 items-center">
              <Dumbbell className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-bold">Planejamento de Treino</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  {data.treino.divisoes?.length || 0} Divisões • Cardio: {data.treino.cardio?.tipo || "N/A"}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4 border-t pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-50 p-3 rounded">
              <div><span className="font-bold">CARDIO:</span> {data.treino.cardio?.frequencia}</div>
              <div><span className="font-bold">MOBILIDADE:</span> {data.treino.mobilidade?.quantidade}</div>
            </div>
            <div className="space-y-2">
              {data.treino.divisoes?.map((div: any, i: number) => (
                <div key={i} className="text-xs p-2 border rounded">
                  <span className="font-bold">TREINO {div.letra}</span>
                  <p className="text-muted-foreground italic">{div.exercicios?.length || 0} Exercícios selecionados</p>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(7)} className="h-7 text-[10px] uppercase">
              <Edit3 className="h-3 w-3 mr-1" /> Editar Treinos
            </Button>
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 mt-8">
        <Info className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <p className="text-xs text-green-800 leading-relaxed">
          <strong>Atenção:</strong> Ao finalizar o protocolo, os dados serão consolidados e enviados para o aplicativo do aluno <strong>Mateus vanzuita</strong>. Certifique-se de que todas as dosagens e volumes estão corretos.
        </p>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { coachMenuItems } from "@/lib/menu-items"
import { RelatorioKPICard } from "@/components/relatorio-kpi-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { relatorioService } from "@/services/relatorio-service"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, LabelList
} from "recharts"

const COLORS = ["#004767", "#F2B139", "#10b981", "#8b5cf6", "#ef4444", "#3b82f6"]

export default function RelatoriosPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [dados, setDados] = useState<any>(null)

  useEffect(() => { loadDados() }, [])

  const loadDados = async () => {
    try {
      setLoading(true)
      const res = await relatorioService.getDadosRelatorio({ periodo: "mes" })
      setDados(res)
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" })
    } finally { setLoading(false) }
  }

  if (loading) return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-[#004767]" /></div>
    </AppLayout>
  )

  return (
    <AppLayout menuItems={coachMenuItems}>
      <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#004767]">Relatórios Estratégicos</h1>
        </div>

        {/* KPIs principais */}
        <div className="grid gap-4 sm:grid-cols-3">
          {dados?.kpis?.map((kpi: any, i: number) => (
            <RelatorioKPICard key={i} kpi={kpi} />
          ))}
        </div>

        {/* Linha 1: Evolução e Sexo */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Evolução de Protocolos (Mensal)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dados?.evolucao} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="data" fontSize={10} tickMargin={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  <Line 
                    name="Qtd. Protocolos" 
                    type="monotone" 
                    dataKey="quantidade" 
                    stroke="#F2B139" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: "#F2B139" }}
                  >
                    <LabelList dataKey="quantidade" position="top" fontSize={10} offset={10} />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Distribuição por Sexo</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={dados?.sexo} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {dados?.sexo?.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Linha 2: Planos e Objetivos */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Tipos de Plano</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={dados?.tiposPlano} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={9} tickMargin={5} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#004767" radius={[4, 4, 0, 0]} name="Qtd. Alunos">
                    <LabelList dataKey="value" position="top" fontSize={10} fill="#666" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Planos mais Aderidos</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie 
                    data={dados?.planos} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={50} 
                    outerRadius={70} 
                    paddingAngle={5}
                    label={({ name, value }) => `${value}`}
                  >
                    {dados?.planos?.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" layout="horizontal" align="center" wrapperStyle={{ fontSize: '10px'}} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-bold">Objetivos Frequentes</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart 
                    layout="vertical" 
                    data={dados?.objetivos} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={9} width={80} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#F2B139" radius={[0, 4, 4, 0]} name="Alunos">
                    <LabelList dataKey="value" position="right" fontSize={10} fill="#666" offset={5} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
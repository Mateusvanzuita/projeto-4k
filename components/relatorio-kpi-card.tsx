import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Users, Activity, FileText } from "lucide-react"
import type { KPIData } from "@/types/relatorio"

interface RelatorioKPICardProps {
  kpi: KPIData
}

export function RelatorioKPICard({ kpi }: RelatorioKPICardProps) {
  const getIcon = () => {
    switch (kpi.icon) {
      case "users":
        return <Users className="h-5 w-5" />
      case "activity":
        return <Activity className="h-5 w-5" />
      case "file-text":
        return <FileText className="h-5 w-5" />
      case "trending-up":
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getTrendIcon = () => {
    if (!kpi.trend || !kpi.change) return null

    if (kpi.trend === "up") {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (kpi.trend === "down") {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getTrendColor = () => {
    if (!kpi.trend) return "text-gray-600"
    return kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-600" : "text-gray-600"
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold">{kpi.value}</p>
            {kpi.change !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {kpi.change > 0 ? "+" : ""}
                  {kpi.change}%
                </span>
                <span className="text-sm text-muted-foreground">vs. período anterior</span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">{getIcon()}</div>
        </div>
      </CardContent>
    </Card>
  )
}

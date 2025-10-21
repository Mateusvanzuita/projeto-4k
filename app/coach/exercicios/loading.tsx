import { AppLayout } from "@/components/app-layout"

export default function ExerciciosLoading() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        </div>

        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
          <div className="h-10 w-[200px] bg-muted animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}

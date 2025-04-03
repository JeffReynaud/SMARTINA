import { DashboardHeader } from "@/components/dashboard-header"
import { BoardView } from "@/components/board-view"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of all your projects across folders.</p>
        </div>
        <BoardView />
      </main>
    </div>
  )
}


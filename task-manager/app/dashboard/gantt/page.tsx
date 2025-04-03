import { DashboardHeader } from "@/components/dashboard-header"
import { GanttView } from "@/components/gantt-view"

export default function GanttPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <main className="flex-1 p-6 overflow-auto">
        <GanttView />
      </main>
    </div>
  )
}


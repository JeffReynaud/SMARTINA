import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectView } from "@/components/project-view"

export default function ProjectPage({
  params,
}: {
  params: { folderId: string; projectId: string }
}) {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <main className="flex-1 p-6 overflow-auto">
        <ProjectView folderId={params.folderId} projectId={params.projectId} />
      </main>
    </div>
  )
}


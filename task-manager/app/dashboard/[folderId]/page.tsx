import { DashboardHeader } from "@/components/dashboard-header"
import { FolderView } from "@/components/folder-view"

export default function FolderPage({ params }: { params: { folderId: string } }) {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader />
      <main className="flex-1 p-6 overflow-auto">
        <FolderView folderId={params.folderId} />
      </main>
    </div>
  )
}


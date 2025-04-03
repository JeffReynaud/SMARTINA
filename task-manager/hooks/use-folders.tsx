"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// Default statuses that will be available for all projects
export const DEFAULT_STATUSES = ["BACKLOG", "IN PROGRESS", "READY FOR REVIEW", "DONE"]

type Subproject = {
  id: string
  name: string
  description: string
  startDate: string | null
  endDate: string | null
  status: string
  customAttributes: Record<string, string>
}

type Project = {
  id: string
  name: string
  description: string
  startDate: string | null
  endDate: string | null
  status: string
  customAttributes: Record<string, string>
  subprojects: Subproject[]
}

type Folder = {
  id: string
  name: string
  projects: Project[]
}

type FoldersContextType = {
  folders: Folder[]
  customStatuses: string[]
  addFolder: (folder: Folder) => void
  updateFolder: (id: string, folder: Folder) => void
  deleteFolder: (id: string) => void
  addProject: (folderId: string, project: Project) => void
  updateProject: (folderId: string, projectId: string, project: Project) => void
  deleteProject: (folderId: string, projectId: string) => void
  addSubproject: (folderId: string, projectId: string, subproject: Subproject) => void
  updateSubproject: (folderId: string, projectId: string, subprojectId: string, subproject: Subproject) => void
  deleteSubproject: (folderId: string, projectId: string, subprojectId: string) => void
  addCustomStatus: (status: string) => void
  deleteCustomStatus: (status: string) => void
  getAllStatuses: () => string[]
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined)

export function FoldersProvider({ children }: { children: React.ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [customStatuses, setCustomStatuses] = useState<string[]>([])

  // Load folders and custom statuses from localStorage on initial render
  useEffect(() => {
    // Load custom statuses
    const storedCustomStatuses = localStorage.getItem("customStatuses")
    if (storedCustomStatuses) {
      try {
        setCustomStatuses(JSON.parse(storedCustomStatuses))
      } catch (error) {
        console.error("Failed to parse custom statuses from localStorage:", error)
      }
    }

    // Load folders
    const storedFolders = localStorage.getItem("folders")
    if (storedFolders) {
      try {
        setFolders(JSON.parse(storedFolders))
      } catch (error) {
        console.error("Failed to parse folders from localStorage:", error)
      }
    } else {
      // Add default folder and projects when no data exists
      const defaultFolders = [
        {
          id: "campaigns-folder",
          name: "Campaigns",
          projects: [
            {
              id: "bank-project",
              name: "Bank",
              description: "Banking campaign project",
              startDate: "2025-05-01T00:00:00.000Z",
              endDate: "2025-05-15T00:00:00.000Z",
              status: "IN PROGRESS",
              customAttributes: {
                Client: "Financial Services Inc.",
                Budget: "$25,000",
              },
              subprojects: [
                {
                  id: "red-bank-subproject",
                  name: "RED BANK",
                  description: "Red Bank promotional campaign",
                  startDate: "2025-05-03T00:00:00.000Z",
                  endDate: "2025-05-10T00:00:00.000Z",
                  status: "BACKLOG",
                  customAttributes: {
                    "Target Audience": "Young professionals",
                    "Budget Allocation": "$8,000",
                  },
                },
              ],
            },
            {
              id: "code-project",
              name: "Code",
              description: "Coding campaign project",
              startDate: "2025-05-07T00:00:00.000Z",
              endDate: "2025-05-13T00:00:00.000Z",
              status: "BACKLOG",
              customAttributes: {
                Platform: "Web & Mobile",
                "Team Size": "5 developers",
              },
              subprojects: [],
            },
          ],
        },
      ]
      setFolders(defaultFolders)
    }
  }, [])

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  // Save custom statuses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customStatuses", JSON.stringify(customStatuses))
  }, [customStatuses])

  const addFolder = (folder: Folder) => {
    setFolders((prev) => [...prev, folder])
  }

  const updateFolder = (id: string, updatedFolder: Folder) => {
    setFolders((prev) => prev.map((folder) => (folder.id === id ? updatedFolder : folder)))
  }

  const deleteFolder = (id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id))
  }

  const addProject = (folderId: string, project: Project) => {
    // Ensure subprojects array is initialized
    const projectWithSubprojects = {
      ...project,
      subprojects: project.subprojects || [],
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, projects: [...folder.projects, projectWithSubprojects] } : folder,
      ),
    )
  }

  const updateProject = (folderId: string, projectId: string, updatedProject: Project) => {
    // Ensure we preserve the subprojects if they're not included in the update
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              projects: folder.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...updatedProject,
                      subprojects: updatedProject.subprojects || project.subprojects || [],
                    }
                  : project,
              ),
            }
          : folder,
      ),
    )
  }

  const deleteProject = (folderId: string, projectId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              projects: folder.projects.filter((project) => project.id !== projectId),
            }
          : folder,
      ),
    )
  }

  const addSubproject = (folderId: string, projectId: string, subproject: Subproject) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              projects: folder.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      subprojects: [...(project.subprojects || []), subproject],
                    }
                  : project,
              ),
            }
          : folder,
      ),
    )
  }

  const updateSubproject = (
    folderId: string,
    projectId: string,
    subprojectId: string,
    updatedSubproject: Subproject,
  ) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              projects: folder.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      subprojects: (project.subprojects || []).map((subproject) =>
                        subproject.id === subprojectId ? updatedSubproject : subproject,
                      ),
                    }
                  : project,
              ),
            }
          : folder,
      ),
    )
  }

  const deleteSubproject = (folderId: string, projectId: string, subprojectId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              projects: folder.projects.map((project) =>
                project.id === projectId
                  ? {
                      ...project,
                      subprojects: (project.subprojects || []).filter((subproject) => subproject.id !== subprojectId),
                    }
                  : project,
              ),
            }
          : folder,
      ),
    )
  }

  const addCustomStatus = (status: string) => {
    if (!customStatuses.includes(status) && !DEFAULT_STATUSES.includes(status)) {
      setCustomStatuses((prev) => [...prev, status])
    }
  }

  const deleteCustomStatus = (status: string) => {
    // Don't allow deleting default statuses
    if (!DEFAULT_STATUSES.includes(status)) {
      setCustomStatuses((prev) => prev.filter((s) => s !== status))

      // Update any projects using this status to "BACKLOG"
      setFolders((prev) =>
        prev.map((folder) => ({
          ...folder,
          projects: folder.projects.map((project) => ({
            ...project,
            status: project.status === status ? "BACKLOG" : project.status,
            subprojects: (project.subprojects || []).map((subproject) => ({
              ...subproject,
              status: subproject.status === status ? "BACKLOG" : subproject.status,
            })),
          })),
        })),
      )
    }
  }

  const getAllStatuses = () => {
    return [...DEFAULT_STATUSES, ...customStatuses]
  }

  return (
    <FoldersContext.Provider
      value={{
        folders,
        customStatuses,
        addFolder,
        updateFolder,
        deleteFolder,
        addProject,
        updateProject,
        deleteProject,
        addSubproject,
        updateSubproject,
        deleteSubproject,
        addCustomStatus,
        deleteCustomStatus,
        getAllStatuses,
      }}
    >
      {children}
    </FoldersContext.Provider>
  )
}

export function useFolders() {
  const context = useContext(FoldersContext)
  if (context === undefined) {
    throw new Error("useFolders must be used within a FoldersProvider")
  }
  return context
}


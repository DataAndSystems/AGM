interface Project {
  id: number
  name: string
  type?: string
  owner_name?: string
  owner?: User
  project_members?: number
  finished_count?: number
  total_count?: number
}
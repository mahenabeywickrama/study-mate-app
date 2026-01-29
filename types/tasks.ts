export interface Task {
  id: string,
  title: string,
  description?: string
  subjectId: string,
  date: string,
  priority: 'High' | 'Medium' | 'Low',
  completed: boolean,
  userId: string
}

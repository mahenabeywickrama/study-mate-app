// (dashboard)/tasks/[id].tsx

import { View, Text, ScrollView } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { getTaskById } from "@/services/taskService"
import { getSubjectById } from "@/services/subjectService"
import { Task } from "@/types/tasks"
import { Subject } from "@/types/subjects"

const TaskDetail = () => {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    if (id) {
      getTaskById(id as string)
        .then((t: Task) => {
          setTask(t)
          return getSubjectById(t.subjectId)
        })
        .then((subj: Subject) => setSubject(subj))
        .catch(() => alert("Failed to load task"))
    }
  }, [id])

  if (!task) return <Text>Loading...</Text>

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View className="bg-white p-6 rounded-2xl shadow-md">
        <Text className="text-xl font-bold mb-2">{task.title}</Text>
        {subject && <Text className="text-gray-600 mb-2">Subject: {subject.name}</Text>}
        <Text className="text-gray-600 mb-2">Priority: {task.priority}</Text>
        <Text className="text-gray-600 mb-2">
          Date: {new Date(task.date).toLocaleString()}
        </Text>
        <Text className="text-gray-600 mb-2">
          Status: {task.completed ? "Completed" : "Pending"}
        </Text>
        {task.description && <Text className="text-gray-800 mt-2">{task.description}</Text>}
      </View>
    </ScrollView>
  )
}

export default TaskDetail

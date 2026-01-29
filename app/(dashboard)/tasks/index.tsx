// (dashboard)/tasks/index.tsx

import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getAllTasks, setTaskCompleted, deleteTask } from "@/services/taskService"
import { getSubjectById } from "@/services/subjectService"
import { Task } from "@/types/tasks"

type Tab = "All" | "Completed" | "Pending"

const Tasks = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("All")
  const [subjectsMap, setSubjectsMap] = useState<Record<string, string>>({})

  const fetchTasks = async () => {
    showLoader()
    try {
      const allTasks = await getAllTasks()

      // Filter by tab
      let filteredTasks = allTasks
      if (activeTab === "Completed") filteredTasks = allTasks.filter(t => t.completed)
      if (activeTab === "Pending") filteredTasks = allTasks.filter(t => !t.completed)

      setTasks(filteredTasks)

      // Load subject names
      const map: Record<string, string> = {}
      for (const t of filteredTasks) {
        if (!map[t.subjectId]) {
          try {
            const subj = await getSubjectById(t.subjectId)
            map[t.subjectId] = subj.name
          } catch { map[t.subjectId] = "Unknown" }
        }
      }
      setSubjectsMap(map)
    } catch (err) {
      Alert.alert("Error", "Failed to load tasks")
      console.log("Error", err)
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(useCallback(() => { fetchTasks() }, [activeTab]))

  const handleComplete = async (id: string, status: boolean) => {
    showLoader()
    try {
      await setTaskCompleted(id, !status)
      fetchTasks()
    } catch { Alert.alert("Error", "Could not update task") }
    finally { hideLoader() }
  }

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          showLoader()
          try { await deleteTask(id); fetchTasks() }
          catch { Alert.alert("Error", "Could not delete task") }
          finally { hideLoader() }
      } }
    ])
  }

  const handleEdit = (id: string) => router.push({ pathname: "/tasks/form", params: { taskId: id } })
  const formatDate = (d: string) => new Date(d).toLocaleString()

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tabs */}
      <View className="flex-row justify-around py-3 bg-white border-b border-gray-200">
        {(["All", "Completed", "Pending"] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text className={`text-lg font-semibold ${activeTab===tab ? "text-blue-600" : "text-gray-500"}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Add Task Button */}
      <TouchableOpacity
        className="bg-blue-600/80 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-2 z-50"
        onPress={() => router.push("/tasks/form")}
      >
        <MaterialIcons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {tasks.length === 0 ? (
          <Text className="text-gray-600 text-center mt-10">No tasks found.</Text>
        ) : (
          tasks.map(task => (
            <View key={task.id} className="bg-white p-4 rounded-2xl mb-4 border border-gray-300 shadow-md">
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/tasks/[id]", params: { id: task.id } })}
                className="flex-row justify-between items-center mb-2"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-800 text-lg font-semibold mb-1">{task.title}</Text>
                  <Text className="text-gray-500 mb-1">Subject: {subjectsMap[task.subjectId]}</Text>
                  <Text className="text-gray-600 mb-1">Priority: {task.priority}</Text>
                  <Text className={`font-medium ${task.completed ? "text-green-600" : "text-yellow-600"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </Text>
                  <Text className="text-gray-400 text-sm">Date: {formatDate(task.date)}</Text>
                </View>

                <TouchableOpacity
                  onPress={e => { e.stopPropagation(); handleComplete(task.id, task.completed) }}
                  className={`p-2 rounded-full ${task.completed ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <MaterialIcons
                    name={task.completed ? "check-circle" : "radio-button-unchecked"}
                    size={28}
                    color={task.completed ? "#16A34A" : "#6B7280"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              <View className="flex-row justify-end mt-2 space-x-3">
                <TouchableOpacity onPress={() => handleEdit(task.id)} className="p-2 rounded-full bg-yellow-500">
                  <MaterialIcons name="edit" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(task.id)} className="p-2 rounded-full bg-red-500">
                  <MaterialIcons name="delete" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Tasks

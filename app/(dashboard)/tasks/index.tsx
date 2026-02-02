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

      let filteredTasks = allTasks
      if (activeTab === "Completed") filteredTasks = allTasks.filter(t => t.completed)
      if (activeTab === "Pending") filteredTasks = allTasks.filter(t => !t.completed)

      setTasks(filteredTasks)

      const map: Record<string, string> = {}
      for (const t of filteredTasks) {
        if (!map[t.subjectId]) {
          try {
            const subj = await getSubjectById(t.subjectId)
            map[t.subjectId] = subj.name
          } catch {
            map[t.subjectId] = "Unknown"
          }
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
    <View className="flex-1 bg-gray-50 relative">
    {/* Tabs */}
    <View className="flex-row justify-around py-4">
      {(["All", "Completed", "Pending"] as Tab[]).map(tab => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-full ${
            activeTab === tab
              ? "bg-blue-600 shadow-md"
              : "bg-gray-200"
          }`}
        >
          <Text className={`text-sm font-semibold ${
            activeTab === tab ? "text-white" : "text-gray-600"
          }`}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

      {/* Add Task Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 z-50"
        onPress={() => router.push("/tasks/form")}
        activeOpacity={0.8}
      >
        <View className="bg-blue-500 p-4 rounded-full shadow-lg items-center justify-center">
          <MaterialIcons name="add" size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        {tasks.length === 0 ? (
          <View className="mt-12 items-center">
            <MaterialIcons name="task" size={60} color="#cbd5e1" />
            <Text className="text-gray-400 text-lg mt-4">No tasks found</Text>
            <Text className="text-gray-500 mt-1">Tap + to add a task</Text>
          </View>
        ) : (
          tasks.map(task => (
            <View
              key={task.id}
              className="p-5 rounded-2xl mb-4 shadow-md border border-gray-200"
              style={{ backgroundColor: task.completed ? "#d1fae5" : "#fff" }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text className={`text-lg font-bold ${task.completed ? "text-green-700" : "text-gray-800"}`}>
                    {task.title}
                  </Text>
                  <Text className="text-gray-500 mt-1">Subject: {subjectsMap[task.subjectId]}</Text>
                  <Text className="text-gray-500 mt-1">Priority: {task.priority}</Text>
                  <Text className={`font-semibold mt-2 ${task.completed ? "text-green-600" : "text-yellow-600"}`}>
                    {task.completed ? "Completed" : "Pending"}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">Date: {formatDate(task.date)}</Text>
                </View>

                <TouchableOpacity
                  onPress={e => { e.stopPropagation(); handleComplete(task.id, task.completed) }}
                  className={`p-2 rounded-full ${task.completed ? "bg-green-200" : "bg-gray-200"}`}
                >
                  <MaterialIcons
                    name={task.completed ? "check-circle" : "radio-button-unchecked"}
                    size={28}
                    color={task.completed ? "#16A34A" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-end mt-3 space-x-3 gap-2">
                <TouchableOpacity onPress={() => handleEdit(task.id)} className="p-2 rounded-full bg-yellow-500 shadow-md">
                  <MaterialIcons name="edit" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(task.id)} className="p-2 rounded-full bg-red-500 shadow-md">
                  <MaterialIcons name="delete" size={22} color="#fff" />
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

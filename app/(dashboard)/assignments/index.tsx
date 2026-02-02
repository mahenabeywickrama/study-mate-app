import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import {
  getAllAssignments,
  deleteAssignment,
  toggleAssignmentCompleted
} from "@/services/assignmentsService"
import { getSubjectById } from "@/services/subjectService"
import { Assignment } from "@/types/assignments"

type Tab = "All" | "Completed" | "Pending" | "Overdue"

const Assignments = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("All")
  const [subjectsMap, setSubjectsMap] = useState<Record<string, string>>({})

  const fetchAssignments = async () => {
    showLoader()
    try {
      const all = await getAllAssignments()
      const now = new Date()

      let filtered = all
      if (activeTab === "Completed") filtered = all.filter(a => a.completed)
      if (activeTab === "Pending") filtered = all.filter(a => !a.completed)
      if (activeTab === "Overdue")
        filtered = all.filter(a => !a.completed && new Date(a.dueDate) < now)

      setAssignments(filtered)

      const map: Record<string, string> = {}
      for (const a of filtered) {
        if (!map[a.subjectId]) {
          try {
            const subj = await getSubjectById(a.subjectId)
            map[a.subjectId] = subj.name
          } catch {
            map[a.subjectId] = "Unknown"
          }
        }
      }
      setSubjectsMap(map)
    } catch {
      Alert.alert("Error", "Failed to load assignments")
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(useCallback(() => { fetchAssignments() }, [activeTab]))

  const formatDate = (d: string) => new Date(d).toLocaleString()

  const getStatusText = (a: Assignment) => {
    if (a.completed) return "Completed"
    if (new Date(a.dueDate) < new Date()) return "Overdue"
    return "Pending"
  }

  return (
    <View className="flex-1 bg-gray-50">

    {/* Tabs */}
    <View className="flex-row justify-around py-4">
      {(["All", "Completed", "Pending", "Overdue"] as Tab[]).map(tab => (
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
          <Text
            className={`text-sm font-semibold ${
              activeTab === tab ? "text-white" : "text-gray-600"
            }`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

      {/* Add Assignment */}
      <TouchableOpacity
        className="bg-blue-600/80 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-2 z-50"
        onPress={() => router.push("/assignments/form")}
      >
        <MaterialIcons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {assignments.length === 0 ? (
          <Text className="text-gray-600 text-center mt-10">
            No assignments found.
          </Text>
        ) : (
          assignments.map(a => (
            <View
              key={a.id}
              className="p-5 rounded-2xl mb-4 shadow-md border border-gray-200"
              style={{
                backgroundColor:
                  a.completed ? "#d1fae5" : new Date(a.dueDate) < new Date() ? "#fee2e2" : "#fff"
              }}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text
                    className={`text-lg font-bold ${
                      a.completed ? "text-green-700" :
                      new Date(a.dueDate) < new Date() ? "text-red-700" : "text-gray-800"
                    }`}
                  >
                    {a.title}
                  </Text>
                  <Text className="text-gray-500 mt-1">Subject: {subjectsMap[a.subjectId]}</Text>
                  <Text
                    className={`font-semibold mt-2 ${
                      getStatusText(a) === "Completed" ? "text-green-600" :
                      getStatusText(a) === "Overdue" ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {getStatusText(a)}
                  </Text>
                  <Text className="text-gray-400 text-sm mt-1">Due: {formatDate(a.dueDate)}</Text>
                </View>

                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation()
                    toggleAssignmentCompleted(a.id, !a.completed).then(fetchAssignments)
                  }}
                  className={`p-2 rounded-full ${
                    a.completed ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  <MaterialIcons
                    name={a.completed ? "check-circle" : "radio-button-unchecked"}
                    size={28}
                    color={a.completed ? "#16A34A" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-end mt-3 space-x-3 gap-2">
                <TouchableOpacity
                  onPress={() =>
                    router.push({ pathname: "/assignments/form", params: { id: a.id } })
                  }
                  className="p-2 rounded-full bg-yellow-500 shadow-md"
                >
                  <MaterialIcons name="edit" size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Delete Assignment", "Are you sure?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => deleteAssignment(a.id).then(fetchAssignments) }
                    ])
                  }
                  className="p-2 rounded-full bg-red-500 shadow-md"
                >
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

export default Assignments

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

      {/* Tabs (same as Tasks) */}
      <View className="flex-row justify-around py-3 bg-white border-b border-gray-200">
        {(["All", "Completed", "Pending", "Overdue"] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              className={`text-lg font-semibold ${
                activeTab === tab ? "text-blue-600" : "text-gray-500"
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
              className="bg-white p-4 rounded-2xl mb-4 border border-gray-300 shadow-md"
            >
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/assignments/[id]", params: { id: a.id } })
                }
                className="flex-row justify-between items-center mb-2"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-800 text-lg font-semibold mb-1">
                    {a.title}
                  </Text>
                  <Text className="text-gray-500 mb-1">
                    Subject: {subjectsMap[a.subjectId]}
                  </Text>
                  <Text
                    className={`font-medium mb-1 ${
                      getStatusText(a) === "Completed"
                        ? "text-green-600"
                        : getStatusText(a) === "Overdue"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getStatusText(a)}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Due: {formatDate(a.dueDate)}
                  </Text>
                </View>

                {/* Complete toggle (same UX as Tasks) */}
                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation()
                    toggleAssignmentCompleted(a.id, !a.completed).then(fetchAssignments)
                  }}
                  className={`p-2 rounded-full ${
                    a.completed ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  <MaterialIcons
                    name={a.completed ? "check-circle" : "radio-button-unchecked"}
                    size={28}
                    color={a.completed ? "#16A34A" : "#6B7280"}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Actions (identical to Tasks) */}
              <View className="flex-row justify-end mt-2 space-x-3">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/assignments/form",
                      params: { id: a.id }
                    })
                  }
                  className="p-2 rounded-full bg-yellow-500"
                >
                  <MaterialIcons name="edit" size={28} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert("Delete Assignment", "Are you sure?", [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () =>
                          deleteAssignment(a.id).then(fetchAssignments)
                      }
                    ])
                  }
                  className="p-2 rounded-full bg-red-500"
                >
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

export default Assignments

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, useFocusEffect } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

import { getAllTasks } from "@/services/taskService"
import { getAllAssignments } from "@/services/assignmentsService"
import { getAllSubjects } from "@/services/subjectService"
import { getMyProfile } from "@/services/profilesService"

const Home = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [stats, setStats] = useState({
    tasksToday: 0,
    pendingTasks: 0,
    dueAssignments: 0,
    subjects: 0
  })

  const loadData = async () => {
    const profile = await getMyProfile()
    const tasks = await getAllTasks()
    const assignments = await getAllAssignments()
    const subjects = await getAllSubjects()

    const today = new Date().toDateString()

    setName(profile.name)

    setStats({
      tasksToday: tasks.filter(t => new Date(t.date).toDateString() === today).length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      dueAssignments: assignments.filter(
        a =>
          !a.completed &&
          new Date(a.dueDate) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
      ).length,
      subjects: subjects.length
    })
  }

  useFocusEffect(useCallback(() => { loadData() }, []))

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-gray-100"
    >

      {/* ================================= */}
      {/* Gradient Header */}
      {/* ================================= */}
      <LinearGradient
        colors={["#2563EB", "#1E40AF"]}
        className="px-6 pt-16 pb-10 rounded-b-3xl"
      >
        <Text className="text-white text-3xl font-bold">
          Hi {name || "Student"} 👋
        </Text>
        <Text className="text-blue-100 mt-2">
          Let's stay productive today
        </Text>
      </LinearGradient>

      {/* ================================= */}
      {/* Stats */}
      {/* ================================= */}
      <View className="px-5 mt-6">
        <Text className="text-lg font-semibold mb-3 text-gray-800">
          Overview
        </Text>

        <View className="flex-row flex-wrap justify-between">
          <StatCard label="Today" value={stats.tasksToday} icon="today" color="#2563EB" />
          <StatCard label="Pending" value={stats.pendingTasks} icon="schedule" color="#F59E0B" />
          <StatCard label="Due Soon" value={stats.dueAssignments} icon="warning" color="#EF4444" />
          <StatCard label="Subjects" value={stats.subjects} icon="menu-book" color="#10B981" />
        </View>
      </View>

      {/* ================================= */}
      {/* Quick Actions */}
      {/* ================================= */}
      <View className="px-5 mt-6 mb-10">
        <Text className="text-lg font-semibold mb-3 text-gray-800">
          Quick Actions
        </Text>

        <View className="space-y-4">
          <ActionBtn
            icon="add-task"
            label="Add Task"
            onPress={() => router.push("/tasks/form")}
          />

          <ActionBtn
            icon="assignment"
            label="Add Assignment"
            onPress={() => router.push("/assignments/form")}
          />

          <ActionBtn
            icon="class"
            label="Add Subject"
            onPress={() => router.push("/subjects/form")}
          />
        </View>
      </View>
    </ScrollView>
  )
}

export default Home

/* ===================================================== */
/* Components */
/* ===================================================== */

const StatCard = ({
  label,
  value,
  icon,
  color
}: {
  label: string
  value: number
  icon: any
  color: string
}) => (
  <View className="bg-white w-[48%] p-5 rounded-3xl mb-4 shadow-lg">
    <View
      className="w-10 h-10 rounded-xl items-center justify-center mb-3"
      style={{ backgroundColor: color + "20" }}
    >
      <MaterialIcons name={icon} size={22} color={color} />
    </View>

    <Text className="text-3xl font-bold text-gray-900">{value}</Text>
    <Text className="text-gray-500 mt-1">{label}</Text>
  </View>
)

const ActionBtn = ({
  label,
  icon,
  onPress
}: {
  label: string
  icon: any
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    className="bg-white flex-row items-center p-5 rounded-2xl shadow-md active:scale-95"
  >
    <View className="bg-blue-100 p-2 rounded-xl">
      <MaterialIcons name={icon} size={22} color="#2563EB" />
    </View>

    <Text className="ml-4 text-lg font-semibold text-gray-800">
      {label}
    </Text>

    <MaterialIcons
      name="chevron-right"
      size={20}
      color="#9CA3AF"
      style={{ marginLeft: "auto" }}
    />
  </Pressable>
)

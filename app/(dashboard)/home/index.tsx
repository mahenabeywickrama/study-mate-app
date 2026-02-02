import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
  RefreshControl
} from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter, useFocusEffect } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Swipeable } from "react-native-gesture-handler"

import { getAllTasks } from "@/services/taskService"
import { getAllAssignments } from "@/services/assignmentsService"
import { getAllSubjects } from "@/services/subjectService"
import { getMyProfile } from "@/services/profilesService"

const Home = () => {
  const router = useRouter()

  const [refreshing, setRefreshing] = useState(false)

  const [profile, setProfile] = useState({ name: "", photoURL: "" })
  const [allTasks, setAllTasks] = useState<any[]>([])
  const [tasksToday, setTasksToday] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [streak, setStreak] = useState(0)

  const [stats, setStats] = useState({
    tasksToday: 0,
    pendingTasks: 0,
    dueAssignments: 0,
    subjects: 0
  })

  /* ================================================= */
  /* LOAD DATA */
  /* ================================================= */

  const loadData = async () => {
    const prof = await getMyProfile()
    const tasks = await getAllTasks()
    const assignments = await getAllAssignments()
    const subjects = await getAllSubjects()

    setProfile({ name: prof.name, photoURL: prof.photoUrl ?? "" })
    setAllTasks(tasks)

    filterTasksByDate(tasks, selectedDate)
    calculateStreak(tasks)

    setStats({
      tasksToday: tasks.filter(
        t => new Date(t.date).toDateString() === new Date().toDateString()
      ).length,
      pendingTasks: tasks.filter(t => !t.completed).length,
      dueAssignments: assignments.filter(a => !a.completed).length,
      subjects: subjects.length
    })
  }

  useFocusEffect(useCallback(() => { loadData() }, []))

  /* ================================================= */
  /* REFRESH */
  /* ================================================= */

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  /* ================================================= */
  /* DATE FILTER */
  /* ================================================= */

  const filterTasksByDate = (tasks: any[], date: Date) => {
    const dayStr = date.toDateString()
    const filtered = tasks.filter(
      t => new Date(t.date).toDateString() === dayStr
    )
    setTasksToday(filtered)
  }

  /* ================================================= */
  /* STREAK LOGIC */
  /* ================================================= */

  const calculateStreak = (tasks: any[]) => {
    let count = 0

    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)

      const dayTasks = tasks.filter(
        t => new Date(t.date).toDateString() === d.toDateString()
      )

      if (dayTasks.length && dayTasks.every(t => t.completed)) count++
      else break
    }

    setStreak(count)
  }

  /* ================================================= */
  /* CALENDAR */
  /* ================================================= */

  const getNext7Days = () =>
    Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() + i)
      return d
    })

  const hasTask = (date: Date) =>
    allTasks.some(t => new Date(t.date).toDateString() === date.toDateString())

  /* ================================================= */
  /* PROGRESS */
  /* ================================================= */

  const completedToday = tasksToday.filter(t => t.completed).length
  const progress =
    tasksToday.length === 0 ? 0 : completedToday / tasksToday.length

  /* ================================================= */
  /* UI */
  /* ================================================= */

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 bg-slate-100"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* ================= HEADER ================= */}

      <LinearGradient
        colors={["#2563EB", "#1E3A8A"]}
        className="px-6 pt-16 pb-14 rounded-b-[40px]"
      >
        <View className="flex-row justify-between items-center">

          <View>
            <Text className="text-white text-3xl font-bold">
              Hi {profile.name || "Student"} 👋
            </Text>
            <Text className="text-blue-200 text-sm">
              🔥 {streak} day streak
            </Text>
          </View>

          <TouchableOpacity onPress={() => router.push("/profile")}>
            {profile.photoURL ? (
              <Image
                source={{ uri: profile.photoURL }}
                className="w-16 h-16 rounded-full border-2 border-white"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center">
                <MaterialIcons name="person" size={30} color="white" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View className="mt-6">
          <Text className="text-blue-200 text-xs mb-1">
            Today's Progress
          </Text>

          <View className="h-2 bg-white/30 rounded-full overflow-hidden">
            <View
              style={{ width: `${progress * 100}%` }}
              className="h-2 bg-white rounded-full"
            />
          </View>
        </View>
      </LinearGradient>

      {/* ================= CALENDAR ================= */}

      <View className="px-5 -mt-6">
        <View className="bg-white p-4 rounded-3xl shadow-sm">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getNext7Days().map((date, i) => {
              const selected =
                date.toDateString() === selectedDate.toDateString()

              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    setSelectedDate(date)
                    filterTasksByDate(allTasks, date)
                  }}
                  className={`items-center mr-4 px-3 py-2 rounded-xl ${
                    selected ? "bg-blue-600" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      selected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>

                  <Text
                    className={`font-bold ${
                      selected ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {date.getDate()}
                  </Text>

                  {hasTask(date) && (
                    <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1" />
                  )}
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      </View>

      {/* ================= TASKS ================= */}

      <Section title="Tasks">

        {tasksToday.length === 0 ? (
          <EmptyCard text="No tasks for this day 🎉" icon="event-available" />
        ) : (
          tasksToday.map(task => (
            <Swipeable
              key={task.id}
              renderRightActions={() => (
                <View className="bg-emerald-500 justify-center items-center w-20 rounded-3xl">
                  <MaterialIcons name="check" size={26} color="white" />
                </View>
              )}
            >
              <Pressable
                onPress={() => router.push(`/tasks/${task.id}`)}
                className="bg-white p-5 rounded-3xl mb-3 shadow-sm"
              >
                <Text
                  className={`font-semibold ${
                    task.completed ? "line-through text-gray-400" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </Text>

                <Text className="text-gray-400 text-xs mt-1">
                  {task.subject}
                </Text>
              </Pressable>
            </Swipeable>
          ))
        )}
      </Section>

      {/* ================= QUICK ACTIONS ================= */}

      <Section title="Quick Actions">

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
      </Section>

      <View className="h-16" />
    </ScrollView>
  )
}

export default Home

/* ================================================= */
/* COMPONENTS */
/* ================================================= */

const Section = ({ title, children }: any) => (
  <View className="px-5 mt-7">
    <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
    {children}
  </View>
)

const EmptyCard = ({ text, icon }: any) => (
  <View className="bg-white rounded-3xl p-6 items-center shadow-sm">
    <MaterialIcons name={icon} size={38} color="#9CA3AF" />
    <Text className="text-gray-500 mt-2 text-sm">{text}</Text>
  </View>
)

const ActionBtn = ({ label, icon, onPress }: any) => (
  <Pressable
    onPress={onPress}
    className="bg-white flex-row items-center p-5 rounded-3xl shadow-sm mb-3 active:scale-95"
  >
    <View className="bg-blue-100 p-3 rounded-xl">
      <MaterialIcons name={icon} size={20} color="#2563EB" />
    </View>

    <Text className="ml-4 text-base font-semibold text-gray-800">
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

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import { addTask, getTaskById, updateTask } from "@/services/taskService"
import { getAllSubjects } from "@/services/subjectService"
import { Task } from "@/types/tasks"
import { Subject } from "@/types/subjects"
import DateTimePickerModal from "react-native-modal-datetime-picker"

const TaskForm = () => {
  const router = useRouter()
  const { taskId } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [title, setTitle] = useState("")
  const [subjectId, setSubjectId] = useState<string>("")
  const [date, setDate] = useState(new Date())
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium")
  const [description, setDescription] = useState("")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)

  // Load subjects
  useEffect(() => {
    getAllSubjects()
      .then(setSubjects)
      .catch(() => Alert.alert("Error", "Failed to load subjects"))
  }, [])

  // Load task if editing
  useEffect(() => {
    if (taskId) {
      showLoader()
      getTaskById(taskId as string)
        .then((task: Task) => {
          setTitle(task.title)
          setDescription(task.description || "")
          setSubjectId(task.subjectId)
          setPriority(task.priority)
          setDate(new Date(task.date))
        })
        .catch(() => Alert.alert("Error", "Failed to load task"))
        .finally(() => hideLoader())
    }
  }, [taskId])

  const handleSubmit = async () => {
    if (!title.trim() || !subjectId) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    showLoader()
    try {
      const taskData = { title, description, subjectId, date: date.toISOString(), priority }
      if (taskId) {
        await updateTask(taskId as string, taskData)
        Alert.alert("Success", "Task updated successfully")
      } else {
        await addTask(title, description, subjectId, date.toISOString(), priority)
        Alert.alert("Success", "Task added successfully")
      }
      router.back()
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong")
    } finally {
      hideLoader()
    }
  }

  const showDatePicker = () => setDatePickerVisible(true)
  const hideDatePicker = () => setDatePickerVisible(false)
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate)
    hideDatePicker()
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
        <Text className="text-gray-800 font-medium ml-1">Back</Text>
      </TouchableOpacity>

      <View className="p-6 rounded-2xl bg-white border border-gray-300 shadow-md">
        {/* Title */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">Task Title</Text>
        <TextInput
          placeholder="Enter task title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium"
        />

        {/* Subject */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">Subject</Text>
        <View className="mb-5 border border-gray-300 rounded-xl bg-gray-100">
          {subjects.map((subj) => (
            <TouchableOpacity
              key={subj.id}
              className={`p-4 ${subjectId === subj.id ? "bg-blue-200" : ""}`}
              onPress={() => setSubjectId(subj.id)}
            >
              <Text className="text-gray-800">{subj.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">Date</Text>
        <TouchableOpacity
          className="mb-5 p-4 rounded-xl bg-gray-100 border border-gray-300"
          onPress={showDatePicker}
        >
          <Text>{date.toLocaleString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Priority */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">Priority</Text>
        <View className="flex-row mb-6 space-x-3">
          {["High", "Medium", "Low"].map((level) => (
            <TouchableOpacity
              key={level}
              className={`flex-1 p-3 rounded-xl border border-gray-300 ${
                priority === level ? "bg-blue-600" : "bg-gray-100"
              }`}
              onPress={() => setPriority(level as "High" | "Medium" | "Low")}
            >
              <Text className={`text-center ${priority === level ? "text-white" : "text-gray-800"}`}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">Description</Text>
        <TextInput
          placeholder="Enter description"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          className="mb-6 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 text-base font-medium h-32"
        />

        <Pressable
          className={`px-6 py-3 rounded-2xl ${taskId ? "bg-blue-600/80" : "bg-green-600/80"}`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {isLoading ? "Please wait..." : taskId ? "Update Task" : "Add Task"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default TaskForm

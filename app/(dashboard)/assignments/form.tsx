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
import { useLocalSearchParams, useRouter } from "expo-router"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { useLoader } from "@/hooks/useLoader"
import {
  addAssignment,
  getAssignmentById,
  updateAssignment
} from "@/services/assignmentsService"
import { getAllSubjects } from "@/services/subjectService"
import { Assignment } from "@/types/assignments"
import { Subject } from "@/types/subjects"

const AssignmentForm = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [title, setTitle] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isDatePickerVisible, setDatePickerVisible] = useState(false)

  useEffect(() => {
    getAllSubjects()
      .then(setSubjects)
      .catch(() => Alert.alert("Error", "Failed to load subjects"))
  }, [])

  useEffect(() => {
    if (!id) return

    showLoader()
    getAssignmentById(id as string)
      .then((a: Assignment) => {
        setTitle(a.title)
        setSubjectId(a.subjectId)
        setDueDate(new Date(a.dueDate))
      })
      .catch(() => Alert.alert("Error", "Failed to load assignment"))
      .finally(hideLoader)
  }, [id])

  const handleSubmit = async () => {
    if (!title.trim() || !subjectId) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    showLoader()
    try {
      if (id) {
        await updateAssignment(
          id as string,
          title,
          dueDate.toISOString(),
          subjectId,
          false
        )
      } else {
        await addAssignment(
          title,
          dueDate.toISOString(),
          subjectId
        )
      }
      router.back()
    } catch {
      Alert.alert("Error", "Could not save assignment")
    } finally {
      hideLoader()
    }
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
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Assignment Title
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter assignment title"
          className="mb-5 p-4 rounded-xl bg-gray-100 border border-gray-300"
        />

        {/* Subject */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Subject
        </Text>
        <View className="mb-5 border border-gray-300 rounded-xl bg-gray-100">
          {subjects.map(subj => (
            <TouchableOpacity
              key={subj.id}
              className={`p-4 ${subjectId === subj.id ? "bg-blue-200" : ""}`}
              onPress={() => setSubjectId(subj.id)}
            >
              <Text>{subj.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Due Date */}
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Due Date
        </Text>
        <TouchableOpacity
          className="mb-5 p-4 rounded-xl bg-gray-100 border border-gray-300"
          onPress={() => setDatePickerVisible(true)}
        >
          <Text>{dueDate.toLocaleString()}</Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={date => {
            setDueDate(date)
            setDatePickerVisible(false)
          }}
          onCancel={() => setDatePickerVisible(false)}
        />

        <Pressable
          className={`px-6 py-3 rounded-2xl ${
            id ? "bg-blue-600/80" : "bg-green-600/80"
          }`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {isLoading ? "Please wait..." : id ? "Update Assignment" : "Add Assignment"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default AssignmentForm

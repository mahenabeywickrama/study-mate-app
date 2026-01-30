import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  addSubject,
  getSubjectById,
  updateSubject
} from "@/services/subjectService"

const SubjectForm = () => {
  const router = useRouter()
  const { subjectId } = useLocalSearchParams()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [name, setName] = useState("")
  const [color, setColor] = useState("")

  useEffect(() => {
    if (subjectId) {
      showLoader()
      getSubjectById(subjectId as string)
        .then(subject => {
          setName(subject.name)
          setColor(subject.color || "")
        })
        .catch(() => Alert.alert("Error", "Failed to load subject"))
        .finally(() => hideLoader())
    }
  }, [subjectId])

  const handleSubmit = async () => {
    if (isLoading) return
    if (!name.trim()) {
      Alert.alert("Error", "Subject name is required")
      return
    }

    showLoader()
    try {
      if (subjectId) {
        await updateSubject(subjectId as string, name, color)
        Alert.alert("Success", "Subject updated")
      } else {
        await addSubject(name, color)
        Alert.alert("Success", "Subject added")
      }
      router.back()
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong")
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
      <View className="p-6 rounded-2xl bg-white border border-gray-300 shadow-md">
        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Subject Name
        </Text>
        <TextInput
          placeholder="Enter subject name"
          value={name}
          onChangeText={setName}
          className="mb-5 p-4 rounded-xl bg-gray-100 border border-gray-300"
        />

        <Text className="text-gray-800 text-lg font-semibold mb-2">
          Color (optional)
        </Text>
        <TextInput
          placeholder="e.g. Blue, Red"
          value={color}
          onChangeText={setColor}
          className="mb-6 p-4 rounded-xl bg-gray-100 border border-gray-300"
        />

        <Pressable
          className={`px-6 py-3 rounded-2xl ${
            subjectId ? "bg-blue-600/80" : "bg-green-600/80"
          }`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg text-center">
            {isLoading
              ? "Please wait..."
              : subjectId
              ? "Update Subject"
              : "Add Subject"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default SubjectForm

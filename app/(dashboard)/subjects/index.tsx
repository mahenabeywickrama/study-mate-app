import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { getSubjectsWithTaskCount, deleteSubject, SubjectWithTaskCount } from "@/services/subjectService"

const Subjects = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [subjects, setSubjects] = useState<SubjectWithTaskCount[]>([])

  const fetchSubjects = async () => {
    showLoader()
    try {
      const data = await getSubjectsWithTaskCount()
      setSubjects(data)
    } catch (error: any) {
      Alert.alert("Error", "Failed to load subjects")
      console.log("Error", error.message)
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchSubjects()
    }, [])
  )

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Subject",
      "Are you sure you want to delete this subject?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteSubject(id)
              fetchSubjects()
            } catch (err: any) {
              Alert.alert("Error", err.message)
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      <TouchableOpacity
        className="bg-blue-600/80 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-2 z-50"
        onPress={() => router.push({ pathname: "/subjects/form" })}
      >
        <MaterialIcons name="add" size={40} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {subjects.length === 0 ? (
          <Text className="text-gray-600 text-center mt-10">
            No subjects added yet.
          </Text>
        ) : (
          subjects.map(subject => (
            <View
              key={subject.id}
              className="bg-white p-4 rounded-2xl mb-4 border border-gray-300 shadow-md"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-800 text-lg font-semibold">
                    {subject.name} ({subject.taskCount} tasks)
                  </Text>
                  {subject.color && (
                    <Text className="text-sm text-gray-500">
                      Color: {subject.color}
                    </Text>
                  )}
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/subjects/form",
                        params: { subjectId: subject.id }
                      })
                    }
                    className="p-2 rounded-full bg-yellow-500"
                  >
                    <MaterialIcons name="edit" size={26} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(subject.id)}
                    className="p-2 ms-2 rounded-full bg-red-500"
                  >
                    <MaterialIcons name="delete" size={26} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Subjects

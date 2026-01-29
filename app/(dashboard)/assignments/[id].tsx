import { View, Text, ScrollView } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { getAssignmentById } from "@/services/assignmentsService"
import { getSubjectById } from "@/services/subjectService"
import { Assignment } from "@/types/assignments"
import { Subject } from "@/types/subjects"

const AssignmentDetail = () => {
  const { id } = useLocalSearchParams()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    if (!id) return

    getAssignmentById(id as string)
      .then(a => {
        setAssignment(a)
        return getSubjectById(a.subjectId)
      })
      .then(setSubject)
      .catch(() => alert("Failed to load assignment"))
  }, [id])

  if (!assignment) return <Text>Loading...</Text>

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View className="bg-white p-6 rounded-2xl shadow-md">
        <Text className="text-xl font-bold mb-2">
          {assignment.title}
        </Text>
        {subject && (
          <Text className="text-gray-600 mb-2">
            Subject: {subject.name}
          </Text>
        )}
        <Text className="text-gray-600 mb-2">
          Due: {new Date(assignment.dueDate).toLocaleString()}
        </Text>
        <Text className="text-gray-600">
          Status: {assignment.completed ? "Completed" : "Pending"}
        </Text>
      </View>
    </ScrollView>
  )
}

export default AssignmentDetail

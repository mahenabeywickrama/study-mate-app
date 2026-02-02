import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet
} from "react-native"
import React, { useCallback, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useFocusEffect, useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import {
  getSubjectsWithTaskCount,
  deleteSubject,
  SubjectWithTaskCount
} from "@/services/subjectService"

/* =====================================================
   ✅ Helper: Lighten color
   ===================================================== */
const lightenColor = (hex: string, percent = 0.35) => {
  if (!hex.startsWith("#")) return hex
  const num = parseInt(hex.slice(1), 16)
  let r = (num >> 16) & 255
  let g = (num >> 8) & 255
  let b = num & 255
  r = Math.min(255, Math.round(r + (255 - r) * percent))
  g = Math.min(255, Math.round(g + (255 - g) * percent))
  b = Math.min(255, Math.round(b + (255 - b) * percent))
  const toHex = (c: number) => c.toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/* =====================================================
   ✅ Subject Card Component
   ===================================================== */
const SubjectCard = ({
  subject,
  onEdit,
  onDelete
}: {
  subject: SubjectWithTaskCount
  onEdit: () => void
  onDelete: () => void
}) => {
  const baseColor = subject.color?.toLowerCase() || "#4f46e5"
  const bgColor = lightenColor(baseColor, 0.35)

  return (
    <TouchableOpacity activeOpacity={0.9} style={{ marginBottom: 16 }}>
      <View style={[styles.card, { backgroundColor: bgColor, shadowColor: baseColor }]}>
        {/* Left */}
        <View style={{ flex: 1 }}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <View style={styles.taskBadge}>
            <Text style={styles.taskText}>{subject.taskCount} Tasks</Text>
          </View>
        </View>

        {/* Right */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.button} onPress={onEdit}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onDelete}>
            <MaterialIcons name="delete" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

/* =====================================================
   ✅ Main Subjects Component
   ===================================================== */
const Subjects = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [subjects, setSubjects] = useState<SubjectWithTaskCount[]>([])

  /* Fetch Subjects */
  const fetchSubjects = async () => {
    showLoader()
    try {
      const data = await getSubjectsWithTaskCount()
      setSubjects(data)
    } catch (error: any) {
      Alert.alert("Error", "Failed to load subjects")
      console.log(error)
    } finally {
      hideLoader()
    }
  }

  useFocusEffect(useCallback(() => { fetchSubjects() }, []))

  /* Delete */
  const handleDelete = (id: string) => {
    Alert.alert("Delete Subject", "Are you sure you want to delete this subject?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          showLoader()
          try {
            await deleteSubject(id)
            fetchSubjects()
          } finally {
            hideLoader()
          }
        }
      }
    ])
  }

  /* Empty State */
  const EmptyState = () => (
    <View style={{ marginTop: 64, alignItems: "center" }}>
      <MaterialIcons name="menu-book" size={60} color="#cbd5e1" />
      <Text style={{ color: "#9ca3af", fontSize: 16, marginTop: 16 }}>No subjects added yet</Text>
      <Text style={{ color: "#6b7280", marginTop: 4 }}>Tap + to add your first subject</Text>
    </View>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* List */}
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubjectCard
            subject={item}
            onEdit={() => router.push({ pathname: "/subjects/form", params: { subjectId: item.id } })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.floatingButton}
        onPress={() => router.push("/subjects/form")}
      >
        <View style={styles.floatingButtonInner}>
          <MaterialIcons name="add" size={28} color="#fff" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

/* =====================================================
   ✅ Styles
   ===================================================== */
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    opacity: 0.75
  },
  subjectName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  taskBadge: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start"
  },
  taskText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  actionButtons: { flexDirection: "row", gap: 6 }, // increased spacing
  button: { padding: 8, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.25)" },
  floatingButton: { position: "absolute", bottom: 24, right: 24, zIndex: 50 },
  floatingButtonInner: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 999,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center"
  }
})

export default Subjects

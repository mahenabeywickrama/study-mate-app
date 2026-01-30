import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native"
import React, { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { getMyProfile, updateMyProfile } from "@/services/profilesService"

const ProfileForm = () => {
  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {
    getMyProfile().then(p => {
      setName(p.name)
    })
  }, [])

  const handleSave = async () => {
    await updateMyProfile(name)
    router.back()
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      <View className="bg-white rounded-2xl p-6 shadow-md">
        <Text className="text-lg font-semibold mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-gray-100 p-4 rounded-xl mb-5"
        />

        <TouchableOpacity
          className="bg-green-600 py-3 rounded-xl"
          onPress={handleSave}
        >
          <Text className="text-white text-lg text-center">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default ProfileForm

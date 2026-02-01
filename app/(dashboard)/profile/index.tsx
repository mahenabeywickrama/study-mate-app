import { View, Text, TouchableOpacity, Image } from "react-native"
import React, { useCallback, useEffect, useState } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { getMyProfile } from "@/services/profilesService"

interface Profile {
  id: string
  name: string
  email: string
  photoUrl?: string
  bio?: string
}

const Profile = () => {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useFocusEffect(
    useCallback(() => {
      getMyProfile().then(setProfile)
    }, [])
  )

  if (!profile) return <Text className="text-center mt-10">Loading...</Text>

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white rounded-2xl p-6 shadow-md items-center">
        {profile.photoUrl ? (
        <Image
            source={{ uri: profile.photoUrl }}
            className="w-28 h-28 rounded-full mb-4"
        />
        ) : (
        <View className="w-28 h-28 rounded-full bg-gray-300 mb-4 items-center justify-center">
            <MaterialIcons name="person" size={48} color="#6B7280" />
        </View>
        )}

        <Text className="text-xl font-bold">{profile.name}</Text>
        <Text className="text-gray-500">{profile.email}</Text>

        {profile.bio && (
          <Text className="text-gray-700 mt-4 text-center">
            {profile.bio}
          </Text>
        )}

        <TouchableOpacity
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => router.push("/profile/form")}
        >
          <Text className="text-white text-lg">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

import { View, Text, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { getMyProfile } from "@/services/profilesService"

const PublicProfile = () => {
  const { id } = useLocalSearchParams()
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (id) getMyProfile().then(setProfile)
  }, [id])

  if (!profile) return <Text>Loading...</Text>

  return (
    <View className="flex-1 bg-gray-50 p-6 items-center">
      {profile.photoURL && (
        <Image
          source={{ uri: profile.photoURL }}
          className="w-28 h-28 rounded-full mb-4"
        />
      )}
      <Text className="text-xl font-bold">{profile.name}</Text>
      <Text className="text-gray-500">{profile.bio}</Text>
    </View>
  )
}

export default PublicProfile

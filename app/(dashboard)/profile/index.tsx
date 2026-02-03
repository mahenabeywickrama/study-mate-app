import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native"
import React, { useCallback, useState } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { getMyProfile } from "@/services/profilesService"
import { logoutUser } from "@/services/authService"

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

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
            const success = await logoutUser()
            if (success) {
            // Redirect to login page
            router.replace("/login") // replace ensures back button can't go back
            } else {
            Alert.alert("Error", "Logout failed. Please try again.")
            }
        }
        }
    ])
  }

  if (!profile)
    return <Text className="text-center mt-10 text-gray-500">Loading...</Text>

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Gradient */}
      <View className="h-44 bg-gradient-to-r from-blue-500 to-blue-700 rounded-b-3xl relative">
        {/* Optional: you can add a settings button here */}
      </View>

      {/* Profile Card */}
      <View className="px-6 -mt-24">
        <View className="bg-white rounded-3xl shadow-xl p-6 items-center">
          {/* Profile Picture */}
          {profile.photoUrl ? (
            <Image
              source={{ uri: profile.photoUrl }}
              className="w-32 h-32 rounded-full border-4 border-white -mt-16 mb-4 shadow-lg"
            />
          ) : (
            <View className="w-32 h-32 rounded-full bg-gray-300 border-4 border-white -mt-16 mb-4 items-center justify-center shadow-lg">
              <MaterialIcons name="person" size={60} color="#6B7280" />
            </View>
          )}

          {/* Name & Email */}
          <Text className="text-2xl font-bold text-gray-800">{profile.name}</Text>
          <Text className="text-gray-500 mt-1">{profile.email}</Text>

          {/* Bio Card */}
          {profile.bio && (
            <View className="bg-gray-100 rounded-xl p-4 mt-4 w-full shadow-sm">
              <Text className="text-gray-700 text-center">{profile.bio}</Text>
            </View>
          )}

          {/* Profile Stats */}
          <View className="flex-row justify-around w-full mt-6">
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800">12</Text>
              <Text className="text-gray-500">Subjects</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800">8</Text>
              <Text className="text-gray-500">Tasks</Text>
            </View>
            <View className="items-center">
              <Text className="text-lg font-bold text-gray-800">4</Text>
              <Text className="text-gray-500">Assignments</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            className="mt-6 bg-blue-600 px-10 py-3 rounded-xl shadow-md flex-row items-center"
            activeOpacity={0.8}
            onPress={() => router.push("/profile/form")}
          >
            <MaterialIcons name="edit" size={20} color="#fff" className="mr-2" />
            <Text className="text-white text-lg font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Optional: Additional Sections */}
        <View className="mt-6 space-y-4 gap-2">
          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-md flex-row items-center justify-between">
            <Text className="text-gray-800 text-lg">Account Settings</Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white rounded-xl p-4 shadow-md flex-row items-center justify-between">
            <Text className="text-gray-800 text-lg">Privacy</Text>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white rounded-2xl p-4 shadow-md flex-row items-center justify-between active:scale-95"
            activeOpacity={0.8}
          >
            <Text className="text-red-600 text-lg font-semibold">Logout</Text>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
          </TouchableOpacity>
          </View>
      </View>
    </ScrollView>
  )
}

export default Profile

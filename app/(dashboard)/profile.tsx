import { View, Text, Alert } from "react-native"
import React from "react"
import { Button } from "@react-navigation/elements"
import { logoutUser } from "@/services/authService"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"

const Profile = () => {
  const router = useRouter() // import { useRouter } from "expo-router"
  const { showLoader, hideLoader, isLoading } = useLoader()

  const handleLogout = async () => {
    showLoader()
      try {
        await logoutUser()
        router.replace("/login")
      } catch (e) {
        console.error(e)
        Alert.alert("Logout fail")
      } finally {
        hideLoader()
    }
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl text-center">Profile</Text>
      <Button onPress={handleLogout}>Logout</Button>
    </View>
  )
}

export default Profile

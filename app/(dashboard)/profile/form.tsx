import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert
} from "react-native"
import React, { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"

import {
  getMyProfile,
  updateMyProfile,
  updateProfilePhoto
} from "@/services/profilesService"

const ProfileForm = () => {
  const router = useRouter()

  const [name, setName] = useState("")
  const [image, setImage] = useState<string | null>(null)

  // -------------------------
  // Load profile
  // -------------------------
  useEffect(() => {
    getMyProfile().then(p => {
      setName(p.name)
      setImage(p.photoUrl ?? null)
    })
  }, [])

  // -------------------------
  // Permissions helper
  // -------------------------
  const requestPermissions = async () => {
    await ImagePicker.requestCameraPermissionsAsync()
    await ImagePicker.requestMediaLibraryPermissionsAsync()
  }

  // -------------------------
  // Camera
  // -------------------------
  const takePhoto = async () => {
    await requestPermissions()

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // -------------------------
  // Gallery
  // -------------------------
  const pickImage = async () => {
    await requestPermissions()

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  // -------------------------
  // Action sheet
  // -------------------------
  const selectPhoto = () => {
    Alert.alert("Profile Photo", "Choose option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose From Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" }
    ])
  }

  // -------------------------
  // Save
  // -------------------------
  const handleSave = async () => {
    let finalUrl = image

    // upload only if local file
    if (image && !image.startsWith("https")) {
      finalUrl = await updateProfilePhoto(image)
    }

    await updateMyProfile(name)

    router.back()
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <ScrollView contentContainerStyle={{ padding: 24 }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="mb-5">
        <Text className="text-blue-600 text-lg">← Back</Text>
      </TouchableOpacity>

      <View className="bg-white rounded-2xl p-6 shadow-md">

        {/* Profile Image */}
        <TouchableOpacity onPress={selectPhoto} className="items-center mb-6">
          <Image
            source={{
              uri:
                image ||
                "https://via.placeholder.com/150"
            }}
            className="w-32 h-32 rounded-full"
          />
          <Text className="text-blue-600 mt-2">
            Change Photo
          </Text>
        </TouchableOpacity>

        {/* Name */}
        <Text className="text-lg font-semibold mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-gray-100 p-4 rounded-xl mb-5"
        />

        {/* Save */}
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

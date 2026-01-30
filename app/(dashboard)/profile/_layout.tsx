// app/(profile)/_layout.tsx
import { Stack } from "expo-router"

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "My Profile" }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: "Edit Profile",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Profile" }}
      />
    </Stack>
  )
}

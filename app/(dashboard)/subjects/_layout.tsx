import React from "react"
import { Stack } from "expo-router"

const SubjectsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "My Subjects" }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: "Subject Details",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Subject" }}
      />
    </Stack>
  )
}

export default SubjectsLayout

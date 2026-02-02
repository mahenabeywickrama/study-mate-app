import React from "react"
import { Stack } from "expo-router"

const AssignmentsLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          title: "My Assignments",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: "Assignment Details",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Assignment" }}
      />
    </Stack>
  )
}

export default AssignmentsLayout

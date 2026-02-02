// (dashboard)/tasks/_layout.tsx

import React from "react"
import { Stack } from "expo-router"

const TasksLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          title: "My Tasks",
          headerTitleAlign: "center"
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          title: "Task Details",
          headerBackTitle: "Back"
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{ title: "Task" }}
      />
    </Stack>
  )
}

export default TasksLayout

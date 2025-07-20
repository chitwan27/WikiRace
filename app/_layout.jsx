import "../global.css"
import { Slot } from "expo-router"
import { View } from "react-native"

export default function rootLayout() {
  return (
    <View className="flex-1 bg-zinc-200 dark:bg-zinc-800 m-safe-offset-0">
      <Slot />
    </View>
  )
}


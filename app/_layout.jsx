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


// import "../global.css";
// import { Stack } from "expo-router";
// import { View } from "react-native";

// export default function RootLayout() {
//   return (
//     <View className="flex-1 bg-zinc-200 dark:bg-zinc-800 m-safe-offset-0">
//       <Stack
//         screenOptions={{
//           headerShown: true, // show default iOS back button
//           headerStyle: { backgroundColor: "#1e293b" }, // optional styling
//           headerTintColor: "white", // back button + title color
//         }}
//       />
//     </View>
//   );
// }

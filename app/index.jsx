import { Text, View } from "react-native";
import Goto from "../components/Goto";

export default function App() {
  return (
    <View className="flex-1 items-center justify-evenly">

      <View className="items-center gap-7">

        <Text className="font-serif text-7xl font-bold text-red-500">
          WikiRace
        </Text>

        <Text className="font-sans text-3xl p-5 text-center text-sky-500">
          Connect two wikipedia articles by the fewest links possible.
        </Text>

      </View>
      
      <Goto route="/game" text="New Game" />
      {/* <Goto route="/history" text="History" />
      <Goto route="/settings" text="Settings" /> */}
      <Goto route="/about" text="About" />

    </View>
  );
}
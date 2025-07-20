import { View, Text, Image, Linking } from 'react-native'
import { version } from '../package.json';

const about = () => {
  return (
    <View className="flex-1 justify-center gap-20 items-center">
      <Image style={{ width: 100, height: 100 }} source={require('../assets/images/my_icon.png')} />
      <View className="justify-center items-center">
        <Text className="text-red-500 font-extrabold">Made With ♥</Text>
        <Text className="text-blue-500 font-extrabold" onPress={() => Linking.openURL('https://github.com/chitwan27')} >By Chitwan Singh</Text>
      </View>
      <Text className="font-light text-black dark:text-white">WikiRace v{version}</Text>

    </View>
  )
}

export default about

import { Pressable, Text, View } from 'react-native'
import Goto from '../../components/Goto'
import Searcher from '../../components/Searcher'
import { useState } from 'react'

const gameStart = () => {

  const [firstArticle, setFirstArticle] = useState(null)
  const [secondArticle, setSecondArticle] = useState(null)

  return (
    <View className="flex-1 items-center justify-center gap-7">

      <Text className="text-5xl color-blue-700 border-2 border-blue-700 bg-slate-300 rounded-lg p-7 ">
        Pick Two Articles
      </Text>

      <Searcher
        placeholder="Select The First Article"
        sendOutput={setFirstArticle}
        output={firstArticle}
      />

      <Searcher
        placeholder="Select The Second Article"
        sendOutput={setSecondArticle}
        output={secondArticle}
      />

      <Goto disabled={!firstArticle || !secondArticle || firstArticle==secondArticle}
        params={{ firstArticle, secondArticle }}
        route="/game/play" text="Start Game"
      />

    </View>
  )
}

export default gameStart
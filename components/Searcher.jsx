import { View, TextInput, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import useFetch from '../hooks/useFetch'
import { getArticles } from '../services/wikiApi'
import { useEffect, useState } from 'react'

const Searcher = ({ placeholder = "Type Something Here", sendOutput }) => {

  const [query, setQuery] = useState("")
  const [selectedTitle, setSelectedTitle] = useState(null)

  const { data, loading, error, refetch, reset } = useFetch(() => getArticles(query))

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        refetch()
        sendOutput(null)
        setSelectedTitle(null) // clear selection if new input
      } else {
        reset()
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [query])

  return (

    <View className="w-full px-5 h-72">

      {/* Search Input */}
      <TextInput
        className="text-3xl border-2 rounded-lg text-center mb-3 text-black dark:text-white"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.nativeEvent.text)}
      />

      {/* FlatList */}
      {!loading && !error && Array.isArray(data) && data.length > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.pageid?.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedTitle === item.title

            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTitle(item.title)
                  sendOutput(item.title)
                }}
                className={`border-b py-3 px-2 ${isSelected ? 'bg-violet-300 border-2' : 'bg-inherit'}`}
              >
                <Text className={`text-lg font-bold ${isSelected ? 'text-purple-800' : 'text-pink-500'}`}>
                  {item.title}
                </Text>
                <Text className={`text-sm ${isSelected ? 'text-purple-700' : 'text-pink-600'}`}>
                  {item.extract?.substring(0, 173) + "..."}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* Empty state */}
      {!loading && !error && Array.isArray(data) && data.length === 0 && (
        <View className="py-7">
          <Text className="text-lg text-center font-bold text-black dark:text-white">
            No Articles Found
          </Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View className="py-7">
          <Text className="text-red-600 text-center font-semibold">
            {error.message || "Something went wrong. Please try again."}
          </Text>
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View className="py-7">
          <ActivityIndicator size="small" color="#1234ff" />
        </View>
      )}

    </View>
  )
}

export default Searcher

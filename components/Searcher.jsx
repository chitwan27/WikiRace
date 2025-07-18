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
        className="text-3xl border-2 rounded-lg text-center mb-3"
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
                className={`border-b py-3 px-2 ${isSelected ? 'bg-violet-300 border-2' : 'bg-white'}`}
              >
                <Text className={`text-lg font-bold ${isSelected ? 'text-purple-700' : 'text-black'}`}>
                  {item.title}
                </Text>
                <Text className="text-sm">
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
          <Text className="text-lg text-center font-bold">
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
          <ActivityIndicator size="large" color="#1234ff" />
        </View>
      )}
    </View>
  )
}

export default Searcher

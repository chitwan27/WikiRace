import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { WebView } from "react-native-webview";
import { BackHandler, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import Goto from '../../components/Goto';

const play = () => {
    const { firstArticle, secondArticle: lastArticle } = useLocalSearchParams();

    const router = useRouter();

    useEffect(() => {
        const onBackPress = () => {

            if (gameOver) {
                return false; //this means "do NOT block back press"
            }

            Alert.alert(
                "Abandon Game?",
                "Are you sure you want to abandon the game?",
                [
                    { text: "No", style: "cancel" },
                    { text: "Yes", onPress: () => router.navigate("/") }
                ]
            );
            return true; // prevent default back action
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => subscription.remove();
    }, []);


    const [score, setScore] = useState(0);
    const [linkStack, setLinkStack] = useState([firstArticle]);
    const [url, setUrl] = useState(`https://en.m.wikipedia.org/wiki/${encodeURIComponent(firstArticle)}`);

    const [gameOver, setGameOver] = useState(false);

    const normalizeTitle = (title) =>
        title
            .replace(/_/g, ' ')
            .replace(/#.*$/, '')         // Remove any anchors
            .replace(/\?.*$/, '')        // Remove query strings
            .trim()
            .toLowerCase();

    const handleLinkClick = (navState) => {
        const clickedUrl = navState.url;
        const wikiBase = "https://en.m.wikipedia.org/wiki/";

        if (clickedUrl.startsWith(wikiBase)) {
            const articleTitle = decodeURIComponent(clickedUrl.replace(wikiBase, ""));

            if (normalizeTitle(articleTitle) === normalizeTitle(lastArticle)) {
                setGameOver(true);
                setScore(prev => prev + 1);
                setLinkStack(prev => [...prev, normalizeTitle(articleTitle)]);
                return false;
            }

            if (articleTitle !== linkStack[linkStack.length - 1]) {
                setScore(prev => prev + 1);
                setLinkStack(prev => [...prev, articleTitle]);
                setUrl(clickedUrl);
            }

            return false; // cancel default navigation
        }

        return false; // disallow external links
    };

    return (
        <View className="flex-1">

            <View className="bg-violet-300  border-y-2 border-slate-700 p-3 justify-evenly items-center">
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-2xl font-semibold text-indigo-700">{firstArticle}</Text>
                <View className="border-b-2 m-3 border-fuchsia-950 self-stretch" />
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-2xl font-semibold text-indigo-700">{lastArticle}</Text>
            </View>

            {!gameOver ? (
                <>
                    <WebView
                        source={{ uri: url }}
                        startInLoadingState={true}
                        originWhitelist={["*"]}
                        injectedJavaScript={`
                            const header = document.querySelector('header');
                            if (header) header.style.display = 'none';
                            const search = document.querySelector('form[role="search"]');
                            if (search) search.style.display = 'none';
                            true;
                        `}
                        onShouldStartLoadWithRequest={handleLinkClick}
                    />

                    <View className="bg-violet-300 border-y-2 border-slate-700 p-3 justify-evenly items-center">
                        <Text className="text-2xl font-semibold text-indigo-700">Progress Tracker</Text>
                        <View className="border-b-2 m-3 border-fuchsia-950 self-stretch" />
                        <Text className="text-2xl font-semibold text-indigo-700">Score: {score}</Text>
                    </View>
                </>

            ) : (
                <View className="flex-1 items-center justify-evenly p-5 bg-pink-300">
                    <Text className="font-serif text-7xl text-cyan-700 font-bold">Game Over</Text>
                    <Text className="text-4xl text-cyan-950 p-3 m-3 bg-purple-300 border-2 rounded-md border-fuchsia-950">
                        Total Links Clicked: {score}
                    </Text>
                    <View className="bg-purple-300 items-center w-96 border-2 rounded-md p-3 border-fuchsia-950">
                        {/* Section Title */}
                        <Text className="text-4xl font-semibold border-b-2 border-fuchsia-950 text-cyan-700 p-3">Path Taken</Text>

                        {/* Compact FlatList */}
                        <FlatList
                            data={linkStack}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 250 }} 
                            renderItem={({ item }) => (
                                <View className="items-center mb-3">
                                    <Text className="text-2xl text-cyan-600">↓</Text>
                                    <Text className="text-lg font-medium text-cyan-800 text-center">
                                        {item.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>

                    <Goto route="/game" text="Play Again" />
                    <Goto route="/" text="Main Menu" />
                </View>
            )}
        </View>
    );
};

export default play;

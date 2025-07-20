import { useLocalSearchParams } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { WebView } from "react-native-webview";
import { BackHandler, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { TouchableOpacity, Vibration } from "react-native";

const play = () => {

    const normalizeTitle = (title) =>
        title
            .replace(/_/g, ' ')
            .replace(/#.*$/, '')         // Remove any anchors
            .replace(/\?.*$/, '')        // Remove query strings
            .trim()
            .toLowerCase();

    const { firstArticle, secondArticle: lastArticle } = useLocalSearchParams();

    const router = useRouter();

    const [score, setScore] = useState(0);
    const [linkStack, setLinkStack] = useState([normalizeTitle(firstArticle)]);
    const [url, setUrl] = useState(`https://en.m.wikipedia.org/wiki/${encodeURIComponent(firstArticle)}`);

    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {

        Vibration.vibrate(500);

        const onBackPress = () => {

            if (gameOver) {
                router.dismissAll();
                return true;
            }

            Alert.alert(
                "Abandon Game?",
                "Are you sure you want to abandon the game?",
                [
                    { text: "No", style: "cancel" },
                    { text: "Yes", onPress: () => router.navigate("/") }
                ]
            );
            return true;
        };

        const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

        return () => subscription.remove();

    }, [gameOver]);

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

            if (normalizeTitle(articleTitle) !== linkStack[linkStack.length - 1]) {
                setScore(prev => prev + 1);
                setLinkStack(prev => [...prev, normalizeTitle(articleTitle)]);
                setUrl(clickedUrl);
            }
            else {
                setUrl(clickedUrl);
            }

            return false; // cancel default navigation
        }

        return false; // disallow external links
    };

    return (
        <View className="flex-1">

            <View className="bg-violet-300 dark:bg-violet-700 border-y-2 border-slate-700 p-3 justify-evenly items-center">
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-2xl font-semibold text-indigo-700 dark:text-red-100">{firstArticle}</Text>
                <View className="border-b-2 m-3 border-fuchsia-950 self-stretch" />
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-2xl font-semibold text-indigo-700 dark:text-red-100">{lastArticle}</Text>
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

                    <View className="bg-violet-300 dark:bg-violet-700 border-y-2 border-slate-700 p-3 justify-evenly items-center">
                        <Text className="text-2xl font-semibold text-indigo-700 dark:text-red-100">Progress Tracker</Text>
                        <View className="border-b-2 m-3 border-fuchsia-950 self-stretch" />
                        <Text className="text-2xl font-semibold text-indigo-700 dark:text-red-100">Score: {score}</Text>
                    </View>
                </>

            ) : (
                <View className="flex-1 items-center justify-evenly p-5 bg-pink-300 dark:bg-pink-700">
                    <Text className="font-serif text-6xl text-cyan-700 dark:text-indigo-100 font-bold">Game Over</Text>
                    <Text className="text-4xl text-cyan-950 p-3 m-3 bg-purple-300 border-2 rounded-3xl border-fuchsia-950">
                        Total Links Clicked: {score}
                    </Text>
                    <View className="bg-purple-300 items-center w-96 border-2 rounded-3xl p-3 border-fuchsia-950">
                        {/* Section Title */}
                        <Text className="text-4xl font-semibold border-b-2 border-fuchsia-950 text-cyan-700 p-3">Your Path</Text>

                        {/* Compact FlatList */}
                        <FlatList
                            data={linkStack}
                            keyExtractor={(item, index) => `${item}-${index}`}
                            contentContainerStyle={{ paddingBottom: 10 }}
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 250 }}
                            renderItem={({ item }) => (
                                <View className="items-center mx-3">
                                    <Text className="text-3xl font-bold text-cyan-700">↓</Text>
                                    <Text className="text-lg font-medium text-cyan-700 text-center">
                                        {item.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                    <TouchableOpacity onPress={() => { router.dismiss() }}>
                        <Text className="font-light text-5xl/normal text-green-700 
                                        px-7 border-2 rounded-3xl border-green-700 bg-cyan-300">
                            Play Again
                        </Text>
                    </TouchableOpacity >
                    <TouchableOpacity onPress={() => { router.dismissAll() }}>
                        <Text className="font-light text-5xl/normal text-green-700 
                                        px-7 border-2 rounded-3xl border-green-700 bg-cyan-300">
                            Main Menu
                        </Text>
                    </TouchableOpacity >
                </View>
            )}
        </View>
    );
};

export default play;

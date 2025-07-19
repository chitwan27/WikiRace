import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { WebView } from "react-native-webview";
import { BackHandler, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

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

    const handleLinkClick = (navState) => {
        const clickedUrl = navState.url;
        const wikiBase = "https://en.m.wikipedia.org/wiki/";

        if (clickedUrl.startsWith(wikiBase)) {
            const articleTitle = decodeURIComponent(clickedUrl.replace(wikiBase, ""));
            if (articleTitle.toLowerCase().replace('_', ' ') === lastArticle.toLowerCase()) {
                setGameOver(true);
                setScore(prev => prev + 1);
                setLinkStack(prev => [...prev, articleTitle.replace('_', ' ')]);
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

            <View className="bg-purple-500  border-y-2 border-slate-700 py-3 px-6 flex-row justify-between items-center">
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-3xl text-green-950">From: {firstArticle}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" className="text-3xl text-green-950">Get to: {lastArticle}</Text>
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

                    <View className="bg-purple-500 border-y-2 border-slate-700 py-3 px-6 flex-row justify-between items-center">
                        <Text className="text-3xl border-b-2 border-indigo-950 text-green-950">Progress Tracker</Text>
                        <Text className="text-3xl font-semibold text-green-950">Score: {score}</Text>
                    </View>
                </>

            ) : (
                <View className="flex-1 items-center justify-evenly p-6 bg-pink-500">
                    <Text className="text-7xl text-cyan-700 font-bold p-2 m-4">Game Over</Text>
                    <Text className="text-3xl text-cyan-700 p-2 m-2">Total Links Clicked: {score}</Text>
                    <Text className="text-3xl text-cyan-700 p-2 m-2">Path Taken:</Text>
                    {linkStack.map((link, i) => (
                        <Text key={i} className="text-lg text-slate-700">
                            {link}
                        </Text>
                    ))}
                </View>
            )}
        </View>
    );
};

export default play;

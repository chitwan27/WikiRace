import { useRouter } from 'expo-router';
import {Text, TouchableOpacity } from 'react-native';

const Goto = (props) => {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.navigate(props.route)}>
                <Text className="font-light text-5xl/normal text-green-500 
                px-7 border-2 rounded-3xl border-green-500 bg-cyan-100">
                {props.text}
                </Text>
        </TouchableOpacity>
    );
};

export default Goto

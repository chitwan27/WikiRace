import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

const Goto = ({ text = "Go To:", route, params = null, disabled = false }) => {
    const router = useRouter();

    return (
        <TouchableOpacity

            onPress={() => {
                if (!disabled) {
                    router.navigate({
                        pathname: route,
                        params: params
                    }
                    )
                }
            }}

            disabled={disabled}
        >
            <Text className={`font-light text-5xl/normal text-green-700 
                px-7 border-2 rounded-3xl border-green-700 
                ${disabled ? 'bg-gray-300' : 'bg-cyan-300'}`}>

                {text}

            </Text>

        </TouchableOpacity >
    );
};

export default Goto

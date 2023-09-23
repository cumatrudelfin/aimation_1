import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const { width, height } = Dimensions.get('screen');

const API_KEY = 'oo0d4IZSzTA0E46Q1FMIISiyEf3qjD9lXNeGoGqZ2f6OJpA5XVV7cfXM';
const API_URL =
    'https://api.pexels.com/v1/search?query=Pears&orientation=portrait&per_page=20';

const fetchImagesFromPixels = async () => {
    const data = await fetch(API_URL, {
        headers: {
            Authorization: API_KEY,
        },
    });

    const { photos } = await data.json();
    return photos;
};

export default function App() {
    const IMAGE_SIZE = 80;
    const SPACING = 10;

    const thumbRef = useRef<any>();
    const topRef = useRef<any>();

    const [images, setImages] = useState(null);
    const [activityIndex, setActivityIndex] = useState(0);

    const scrollOnIndex = (index: number) => {
        setActivityIndex(index);
        topRef.current?.scrollToOffset({
            offset: index * width,
            animated: true,
        });
        if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
            thumbRef.current?.scrollToOffset({
                offset:
                    index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
                animated: true,
            });
        }
    };

    useEffect(() => {
        const fetchImages = async () => {
            const images = await fetchImagesFromPixels();
            setImages(images);
        };
        fetchImages();
    }, []);

    if (!images) {
        return <Text>Loading...</Text>;
    }
    return (
        <View style={styles.container}>
            <FlatList
                ref={topRef}
                data={images}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    scrollOnIndex(
                        Math.floor(
                            Math.ceil(event.nativeEvent.contentOffset.x) /
                                width,
                        ),
                    );
                }}
                renderItem={({ item }) => (
                    <View style={{ height, width }}>
                        <Image
                            source={{ uri: item.src.portrait }}
                            style={[StyleSheet.absoluteFillObject]}
                        />
                    </View>
                )}
            />
            <FlatList
                ref={thumbRef}
                data={images}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ position: 'absolute', bottom: IMAGE_SIZE }}
                contentContainerStyle={{ paddingHorizontal: SPACING }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity onPress={() => scrollOnIndex(index)}>
                        <Image
                            source={{ uri: item.src.portrait }}
                            style={{
                                height: IMAGE_SIZE,
                                width: IMAGE_SIZE,
                                borderRadius: 12,
                                marginRight: SPACING,
                                borderWidth: 2,
                                borderColor:
                                    activityIndex === index
                                        ? '#fff'
                                        : 'transparent',
                            }}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
});

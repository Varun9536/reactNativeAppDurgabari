import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
} from "react-native";

import durga from "../assets/Durga.jpg";
import bajaarArchive from "../assets/bajaarArchive.webp";
import Bhog from "../assets/Bhog.png";
import Cultural from "../assets/Cultural.png";
import SponsorsBG from "../assets/SponsorsBG.jpg";
import OngoingEventsCarousel from "./Carousel/OngoingEventsCarousel"; // Adjust path as needed
import Icon from "react-native-vector-icons/MaterialIcons";


const { width, height } = Dimensions.get("window");

const data = [
    {
        id: "1",
        title: "Beautiful Temple",
        description: "Experience divine serenity & peace.",
        image: durga,
    },
    {
        id: "2",
        title: "Cultural Event",
        description: "Enjoy traditional dance & music.",
        image: bajaarArchive,
    },
    {
        id: "3",
        title: "Food Festival",
        description: "Delicious bhog & prasadam for all.",
        image: Bhog,
    },
    {
        id: "4",
        title: "Dance & Music",
        description: "Celebrating heritage & joy together.",
        image: Cultural,
    },
    {
        id: "5",
        title: "Special Puja",
        description: "Seek blessings with family & friends.",
        image: SponsorsBG,
    },
];

export default function Home() {
    const flatListRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const currentYear = new Date().getFullYear();



    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (activeIndex + 1) % data.length;
            setActiveIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 4000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const handleRegister = () => {
        Linking.openURL("https://durgabari.org/HDBS_Puja_Payments/onlinepujapayments/onlinepujapayments"); // apna URL daalna
    };

    return (

        <ScrollView style={styles.scrollViewContainer}>
            <View style={styles.container}>


                <Text style={styles.heading}>
                    Welcome to Houston Durgabari Puja {currentYear}
                </Text>

                <OngoingEventsCarousel />


                <View style={styles.cardParentView}>
                    <FlatList
                        ref={flatListRef}
                        data={data}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Image source={item.image} style={styles.image} />
                                <View style={styles.textOverlay}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description}>{item.description}</Text>
                                </View>
                            </View>
                        )}
                        onMomentumScrollEnd={(ev) => {
                            const index = Math.round(ev.nativeEvent.contentOffset.x / width);
                            setActiveIndex(index);
                        }}
                    />
                </View>



                <View style={styles.dotsContainer}>
                    {data.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>


                <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
                    <Text style={styles.registerText}>Go To Durgabari</Text>
                    <Icon name="launch" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
            </View>
        </ScrollView>



    );
}

const styles = StyleSheet.create({

    scrollViewContainer:
    {
        flex: 1,
        backgroundColor: "#400000",
    },
    container: {


        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 60,


    },
    heading: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#ffcc00",
        textAlign: "center",
        marginVertical: 20,
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },

    cardParentView:
    {
        width: width,
        height: height * 0.5

    },
    card: {
        width: width,
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        // alignSelf : "center"

    },
    image: {
        width: width * 0.85,
        height: 390,
        borderRadius: 16,
        resizeMode: "cover",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    textOverlay: {
        position: "absolute",
        bottom: 5,
        backgroundColor: "rgba(0,0,0,0.45)",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 12,
        // width: width * 0.7,
        alignItems: "center",
        alignSelf: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    description: {
        fontSize: 14,
        color: "#eee",
        marginTop: 4,
        textAlign: "center",
    },
    dotsContainer: {
        flexDirection: "row",
        marginTop: 15,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#bbb",
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: "#ffcc00",
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    registerBtn: {
        position: "absolute",
        bottom: 10,
        backgroundColor: "#ff6666",
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"



    },
    registerText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
        textTransform: "uppercase",
    },
});



// import React, { useRef, useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     Image,
//     Dimensions,
//     StyleSheet,
//     TouchableOpacity,
//     Linking,
//     ScrollView,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";

// import durga from "../assets/Durga.jpg";
// import bajaarArchive from "../assets/bajaarArchive.webp";
// import Bhog from "../assets/Bhog.png";
// import Cultural from "../assets/Cultural.png";
// import SponsorsBG from "../assets/SponsorsBG.jpg";
// import OngoingEventsCarousel from "./Carousel/OngoingEventsCarousel";

// const { width, height } = Dimensions.get("window");

// const data = [
//     { id: "1", title: "Beautiful Temple", description: "Experience divine serenity & peace.", image: durga },
//     { id: "2", title: "Cultural Event", description: "Enjoy traditional dance & music.", image: bajaarArchive },
//     { id: "3", title: "Food Festival", description: "Delicious bhog & prasadam for all.", image: Bhog },
//     { id: "4", title: "Dance & Music", description: "Celebrating heritage & joy together.", image: Cultural },
//     { id: "5", title: "Special Puja", description: "Seek blessings with family & friends.", image: SponsorsBG },
// ];

// export default function Home() {
//     const flatListRef = useRef(null);
//     const [activeIndex, setActiveIndex] = useState(0);
//     const currentYear = new Date().getFullYear();

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const nextIndex = (activeIndex + 1) % data.length;
//             setActiveIndex(nextIndex);
//             flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
//         }, 4000);
//         return () => clearInterval(interval);
//     }, [activeIndex]);

//     const handleRegister = () => {
//         Linking.openURL("https://durgabari.org/HDBS_Puja_Payments/onlinepujapayments/onlinepujapayments");
//     };

//     return (

//         <ScrollView showsVerticalScrollIndicator={false}>
//             <View style={styles.container}>

//                 {/* Header */}
//                 <Text style={styles.heading}>Welcome to Houston Durgabari Puja {currentYear}</Text>

//                 {/* Ongoing Events Carousel */}
//                 <OngoingEventsCarousel />

//                 {/* Horizontal Image Slider */}
//                 <View style={{ width: width, height: height * 0.8 }}>
//                     <FlatList
//                         ref={flatListRef}
//                         data={data}
//                         horizontal
//                         pagingEnabled
//                         showsHorizontalScrollIndicator={false}
//                         keyExtractor={(item) => item.id}
//                         renderItem={({ item }) => (
//                             <View style={{ width: width, height: "100%" }}>
//                                 <Image source={item.image} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
//                                 <View style={styles.textOverlay}>
//                                     <Text style={styles.title}>{item.title}</Text>
//                                     <Text style={styles.description}>{item.description}</Text>
//                                 </View>
//                             </View>
//                         )}
//                         onMomentumScrollEnd={(ev) => {
//                             const index = Math.round(ev.nativeEvent.contentOffset.x / width);
//                             setActiveIndex(index);
//                         }}
//                     />
//                 </View>

//                 {/* Dots */}
//                 <View style={styles.dotsContainer}>
//                     {data.map((_, index) => (
//                         <View
//                             key={index}
//                             style={[styles.dot, activeIndex === index && styles.activeDot]}
//                         />
//                     ))}
//                 </View>

//                 {/* Fixed Button */}
//                 <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
//                     <Text style={styles.registerText}>Go To Durgabari</Text>
//                     <Icon name="launch" size={18} color="#fff" style={{ marginLeft: 8 }} />
//                 </TouchableOpacity>
//             </View>
//         </ScrollView>


//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#400000",
//         alignItems: "center",
//         justifyContent: "flex-start",
//     },
//     heading: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "#ffcc00",
//         textAlign: "center",
//         marginVertical: 20,
//     },
//     card: {
//         width: width,
//         height: height * 0.55, // full slider height
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     image: {
//         width: "100%",
//         height: "100%",
//         borderRadius: 16,
//         resizeMode: "cover",
//     },
//     textOverlay: {
//         position: "absolute",
//         bottom: 15,
//         backgroundColor: "rgba(0,0,0,0.45)",
//         padding: 10,
//         borderRadius: 12,
//         width: "80%",
//         alignItems: "center",
//         alignSelf : "center"
//     },
//     title: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "white",
//     },
//     description: {
//         fontSize: 14,
//         color: "#eee",
//         marginTop: 4,
//         textAlign: "center",
//     },
//     dotsContainer: {
//         flexDirection: "row",
//         marginVertical: 10,
//     },
//     dot: {
//         width: 8,
//         height: 8,
//         borderRadius: 4,
//         backgroundColor: "#bbb",
//         marginHorizontal: 4,
//     },
//     activeDot: {
//         backgroundColor: "#ffcc00",
//         width: 12,
//         height: 12,
//         borderRadius: 6,
//     },
//     registerBtn: {
//         marginBottom: 15,
//         backgroundColor: "#ff6666",
//         paddingVertical: 10,
//         paddingHorizontal: 25,
//         borderRadius: 25,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     registerText: {
//         fontSize: 14,
//         fontWeight: "bold",
//         color: "#fff",
//     },
// });

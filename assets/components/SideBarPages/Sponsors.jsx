import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity  , Linking} from "react-native";
import SponsorsBG from "../../assets/SponsorsBG.jpg"


export default function Sponsors() {

    const gotoSponsarPage = () => {
            Linking.openURL("https://durgabari.org/HDBS_Puja_Payments/Sponsorship/Sponsorship"); // apna URL daalna
        };
    return (
        <View style={styles.container}>
            {/* Top Image Section */}
            <Image
                source={SponsorsBG} // replace with your image
                style={styles.topImage}
                resizeMode="cover"
            />

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Sponsors</Text>
                </View>

                <Text style={styles.heading}>Sponsors</Text>

                <TouchableOpacity style={styles.button} onPress={gotoSponsarPage}>
                    <Text style={styles.buttonText}>Click here to see all of our sponsors</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topImage: {
        width: "100%",
        height: 200,
    },
    content: {
        padding: 20,
    },
    labelContainer: {
        backgroundColor: "#d32f2f",
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: "flex-start",
        borderRadius: 4,
        marginBottom: 10,
    },
    labelText: {
        color: "#fff",
        fontWeight: "bold",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#d32f2f",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 25,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

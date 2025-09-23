import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Alertbg from "../../assets/Alertbg.png"

export default function Disclaimer() {
    return (

        <ScrollView style={styles.container}>
            <View >
                {/* Top Image Section */}
                <Image
                    source={Alertbg} // replace with your image
                    style={styles.topImage}
                    resizeMode="cover"
                />

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>Disclaimer</Text>
                    </View>

                    <Text style={styles.heading}>Disclaimer</Text>

                    <Text style={styles.desc}>Information is accurate at the time of publication, may not include all updates.
                        HDBS strives to provide a safe and respectful environment for all the attendees.
                        By attending services and events, you acknowledge that you do so at your own risk and agree that HDBS is not responsible for any personal injury, illness, delay or personal property damage.
                        You agree not to hold HDBS organizers liable for any dispute or limitation with the services or events.</Text>


                </View>
            </View>
        </ScrollView>

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
    desc:
    {
        fontSize: 18,
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

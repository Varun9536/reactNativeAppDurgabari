import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Contactbg from "../../assets/Contactbg.webp"

export default function Contacts() {
    return (
        <View style={styles.container}>
            {/* Top Image Section */}
            <Image
                source={Contactbg} // replace with your image
                style={styles.topImage}
                resizeMode="cover"
            />

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Contacts</Text>
                </View>

                <Text style={styles.heading}>Contacts</Text>
                <Text style={styles.desc}>Puja@durgabari.org</Text>
               
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
    desc: 
    {
        fontSize : 18 ,
    } ,
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

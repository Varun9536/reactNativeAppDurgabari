import React from "react";
import { View, Text, Image, StyleSheet, ScrollView , TouchableOpacity, Linking } from "react-native";
import Contactbg from "../../assets/Contactbg.webp";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Contacts() {
    return (
        <ScrollView style={styles.container}>
            {/* Top Image Section */}
            <Image
                source={Contactbg}
                style={styles.topImage}
                resizeMode="cover"
            />

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Contacts</Text>
                </View>

                <Text style={styles.heading}>Contacts</Text>

                {/* Address */}
                <Text style={styles.subHeading}>Address</Text>
                <Text style={styles.desc}>13944 Schiller Road, Houston TX 77082</Text>

                {/* Phone */}
                <Text style={styles.subHeading}>Phone</Text>
                <Text style={styles.desc}>(281) 589-7700</Text>

                {/* Email */}
                <Text style={styles.subHeading}>Email</Text>
                <TouchableOpacity onPress={() => Linking.openURL("mailto:Puja@durgabari.org")}>
                    <Text style={styles.desc}>Puja@durgabari.org</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => Linking.openURL("mailto:feedback@durgabari.org")}>
                    <Text style={styles.desc}>feedback@durgabari.org</Text>
                </TouchableOpacity>

                {/* Follow Us */}
                <Text style={[styles.heading, { marginTop: 20 }]}>Follow Us</Text>

                <TouchableOpacity
                    style={styles.socialBtn}
                    onPress={() => Linking.openURL("https://www.facebook.com/HoustonDurgaBari/")}
                >
                    <Icon name="facebook" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.socialText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.socialBtn, { backgroundColor: "#ff6666", marginTop: 10 }]}
                    onPress={() => Linking.openURL("https://durgabari.org/")}
                >
                    <Icon name="launch" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.socialText}>Visit Durgabari For more Details</Text>
                </TouchableOpacity>
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
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 4,
    },
    desc: {
        fontSize: 18,
        marginBottom: 6,
    },
    socialBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#4267B2",
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    socialText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Alertbg from "../../assets/Alertbg.png"

export default function Alerts() {
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
                    <Text style={styles.labelText}>Alerts</Text>
                </View>

                <Text style={styles.heading}>Alerts</Text>

                <Text style={styles.desc}>Hurry up and Register for Durgapuja 2025</Text>
                
            </View>
        </View>

        </ScrollView>
        
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

   
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

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import durga from "../../assets/Durga.jpg"
const windowWidth = Dimensions.get("window").width;
const windowHeight = 200; // image height
const DEFAULT_IMAGE = "https://durgabari.org/HDBS_Puja_Payments/1.svg";

export default function ViewMoreDetailPuja({ title, subtitle, description, onBack, img }) {
    const [validImage, setValidImage] = useState(true);

    useEffect(() => {
        setValidImage(true); // reset when img changes
    }, [img]);

    const webviewHtml = `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0"/>
                <style>
                    body {
                        margin:0; 
                        padding:0; 
                        display:flex; 
                        justify-content:center; 
                        align-items:center;
                        height:100%;
                        background-color:transparent;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                <img src="${img || DEFAULT_IMAGE}" />
            </body>
        </html>
    `;

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            {validImage ? (
                <Image
                    source={{ uri: img || DEFAULT_IMAGE }}
                    style={{ width: windowWidth, height: windowHeight }}
                    resizeMode="contain"
                    onError={() => setValidImage(false)} // fallback to WebView
                />
            ) : (
                <View style={{ width: windowWidth, height: windowHeight }}>
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: webviewHtml }}
                        style={{ flex: 1, backgroundColor: 'transparent' }}
                        scrollEnabled={false}
                    />
                </View>
            )}

            <View style={styles.content}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Event Info</Text>
                </View>

                <Text style={styles.heading}>{title}</Text>

                {subtitle ? (
                    <Text style={[styles.subtitle, { marginBottom: 10 }]}>{subtitle}</Text>
                ) : null}

                {typeof description === 'string' ? (
                    <Text style={styles.desc}>
                        {description
                            .replace(/pull stops\./gi, 'pull stops.\n')
                            .split('\n')
                            .map((line, index) => (
                                <Text key={index}>
                                    {line}
                                    {"\n"}
                                </Text>
                            ))}
                    </Text>
                ) : null}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
    },
    backButton: {
        backgroundColor: "#d32f2f",
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginBottom: 16,
    },
    backButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
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
    subtitle: {
        fontSize: 16,
        color: "crimson",
        fontWeight: "bold",
    },
    desc: {
        fontSize: 18,
        lineHeight: 24,
    },
});

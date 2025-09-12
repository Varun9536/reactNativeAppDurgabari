
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Linking,
} from "react-native";
import { WebView } from "react-native-webview";

const windowWidth = Dimensions.get("window").width;
const windowHeight = 200; // image height
const DEFAULT_IMAGE = "https://durgabari.org/HDBS_Puja_Payments/1.svg";

export default function ViewMoreDetailTransport({
    title,
    subtitle,
    subtitles = [],
    times = [],
    description,
    onBack,
    img,
    location,
    address,
}) {
    const [validImage, setValidImage] = useState(true);

    useEffect(() => {
        setValidImage(true);
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

    const openMap = () => {
        let url = "";

        if (location?.startsWith("http")) {
            // Already a map link
            url = location;
        } else if (location) {
            // Build a Google Maps search URL
            url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
        }

        if (url) {
            Linking.openURL(url).catch(err =>
                console.error("Failed to open map:", err)
            );
        } else {
            console.warn("No valid location or map link provided.");
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Image or WebView fallback */}
            {validImage ? (
                <Image
                    source={{ uri: img || DEFAULT_IMAGE }}
                    style={{ width: windowWidth, height: windowHeight }}
                    resizeMode="contain"
                    onError={() => setValidImage(false)}
                />
            ) : (
                <View style={{ width: windowWidth, height: windowHeight }}>
                    <WebView
                        originWhitelist={["*"]}
                        source={{ html: webviewHtml }}
                        style={{ flex: 1, backgroundColor: "transparent" }}
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
                    <Text style={styles.labelText}>Transport Info</Text>
                </View>

                <Text style={styles.heading}>{title}</Text>

                {/* Subtitle Array */}
                {Array.isArray(subtitles) && subtitles.length > 0 ? (
                    <View style={styles.subtitleList}>
                        {subtitles.map((item, index) => {
                            const time = times[index] || "";
                            return (
                                <Text key={index} style={styles.subtitleItem}>
                                    <Text style={styles.serial}>{index + 1}.</Text>
                                    <Text style={styles.subtitleText}> {item}</Text>
                                    {time ? <Text style={styles.timeText}> — {time}</Text> : null}
                                </Text>
                            );
                        })}
                    </View>
                ) : subtitle ? (
                    <Text style={[styles.subtitle, { marginBottom: 10 }]}>{subtitle}</Text>
                ) : null}

                {/* Description */}
                {typeof description === "string" && (
                    <Text style={styles.desc}>
                        {description
                            .replace(/pull stops\./gi, "pull stops.\n")
                            .split("\n")
                            .map((line, index) => (
                                <Text key={index}>
                                    {line}
                                    {"\n"}
                                </Text>
                            ))}
                    </Text>
                )}

                {/* Location Section */}
                {location ? (
                    <View style={styles.locationWrapper}>
                        <TouchableOpacity
                            style={styles.locationLinkContainer}
                            onPress={openMap}
                        >
                            <Text style={styles.locationLink}>📍 Open in Maps</Text>
                        </TouchableOpacity>

                        <View style={styles.locationAddressContainer}>
                            <Text style={styles.locationLabel}>Address:</Text>
                            <Text style={styles.locationText}>{address}</Text>
                        </View>
                    </View>
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
    subtitleList: {
        marginBottom: 20,
    },
    subtitleItem: {
        fontSize: 16,
        marginBottom: 6,
    },
    serial: {
        fontWeight: "bold",
        color: "#2C3E50",
    },
    subtitleText: {
        color: "#2C3E50",
        fontWeight: "500",
    },
    timeText: {
        color: "#7F8C8D",
        fontWeight: "500",
    },
    subtitle: {
        fontSize: 16,
        color: "crimson",
        fontWeight: "bold",
    },
    desc: {
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 20,
    },
    locationWrapper: {
        marginBottom: 16,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#E8F4FA",
    },
    locationLinkContainer: {
        marginBottom: 6,
    },
    locationLink: {
        color: "#2980B9",
        fontWeight: "bold",
        fontSize: 16,
        textDecorationLine: "underline",
    },
    locationAddressContainer: {
        flexDirection: "column",
        marginTop: 8,
        width: "100%",
    },
    locationLabel: {
        fontWeight: "bold",
        color: "#2C3E50",
        fontSize: 16,
        marginBottom: 6,
    },
    locationText: {
        color: "#2C3E50",
        fontSize: 16,
        lineHeight: 24,
        flexWrap: "wrap",
        width: "100%",
        textAlign: "left",
    },
});

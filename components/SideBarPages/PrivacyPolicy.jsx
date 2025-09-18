import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import Contactbg from '../../assets/Contactbg.webp';
import Alertbg from "../../assets/Alertbg.png"


const PrivacyPolicy = () => {

    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    const handleEmailPress = (email) => {
        Linking.openURL(`mailto:${email}`);
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={Alertbg} style={styles.headerImage} />

            <Text style={styles.title}>Privacy & Child Policy</Text>

            <Text style={styles.intro}>
                Houston Durga Bari App is committed to protecting your privacy and ensuring child safety. This page outlines our practices regarding data usage, user privacy, and child protection.
            </Text>

            {/* Privacy Policy Section */}
            <Text style={styles.subHeading}>Privacy Policy</Text>
            <Text style={styles.point}>• The app does not collect any personal information from users.</Text>
            <Text style={styles.point}>• All event schedules, puja details, food offerings, and cultural programs are sourced solely from official CSV files maintained by Houston Durga Bari.</Text>
            <Text style={styles.point}>
                • Donations and payments are processed exclusively through the official website:{' '}
                <Text style={styles.link} onPress={() => handleLinkPress('https://durgabari.org/')}>
                    https://durgabari.org/
                </Text>
            </Text>
            <Text style={styles.point}>• Anonymous usage data may be collected only for app performance improvement; no personal information is stored.</Text>
            <Text style={styles.point}>• The app does not share any data with third-party advertisers or marketers.</Text>
            <Text style={styles.point}>• All communications through the app, including emails for feedback, are voluntary and optional.</Text>

            {/* Child Policy Section */}
            <Text style={styles.subHeading}>Child Policy</Text>
            <Text style={styles.point}>• The app is not intended for children under 10 years of age.</Text>
            <Text style={styles.point}>• No personal information is collected from children.</Text>
            <Text style={styles.point}>• Children using the app should do so under parental supervision.</Text>
            <Text style={styles.point}>• All content, including event schedules, puja details, food information, and cultural programs, is appropriate for all ages.</Text>
            <Text style={styles.point}>• Parents and guardians are encouraged to guide children for safe online usage.</Text>

            {/* Transparency Section */}
            <Text style={styles.subHeading}>Transparency & Notes</Text>
            <Text style={styles.point}>• All data displayed in the app is from official sources of Houston Durga Bari.</Text>
            <Text style={styles.point}>• Users are never required to submit emails, phone numbers, or other personal details.</Text>
            <Text style={styles.point}>• Donations and payments are strictly processed via the official website.</Text>
            <Text style={styles.point}>• Full transparency is maintained in displaying events, pujas, food offerings, and cultural programs.</Text>

            {/* Contact Information */}
            <Text style={styles.subHeading}>Contact Information</Text>
            <Text style={styles.point}>📍 Address: 13944 Schiller Road, Houston, TX 77082</Text>
            <Text style={styles.point}>📞 Phone: (281) 589-7700</Text>
            <TouchableOpacity onPress={() => handleEmailPress('Puja@durgabari.org')}>
                <Text style={styles.point}>📧 Email: Puja@durgabari.org</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEmailPress('feedback@durgabari.org')}>
                <Text style={styles.point}>📧 Email: feedback@durgabari.org</Text>
            </TouchableOpacity>
            <Text style={styles.point}>
                🌐 Website:{' '}
                <Text style={styles.link} onPress={() => handleLinkPress('https://durgabari.org/')}>
                    https://durgabari.org/
                </Text>
            </Text>

            <Text style={styles.footer}>
                This Privacy and Child Policy ensures that users' information is secure, and no personal data is collected by the app. All donations and payments are processed solely through the official website. Houston Durga Bari App is committed to maintaining transparency and protecting the community.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 16,
    },
    intro: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 12,
    },
    subHeading: {
        fontSize: 20,
        fontWeight: '600',
        color: '#d32f2f',
        marginTop: 16,
        marginBottom: 8,
    },
    point: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
        marginBottom: 6,
    },
    link: {
        color: '#d32f2f',
        textDecorationLine: 'underline',
    },
    footer: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 20,
        textAlign: 'center',
        color: '#777',
    },
});

export default PrivacyPolicy;

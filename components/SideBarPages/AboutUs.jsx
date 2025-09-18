import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Linking, TouchableOpacity } from 'react-native';
import Contactbg from '../../assets/Contactbg.webp';
import durgabari from "../../assets/durgabari.jpg"

const AboutUs = () => {
    const handleWebsitePress = (url) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.imageBox}>
                <Image
                    source={durgabari}
                    style={styles.headerImage}
                    resizeMode="contain"   // ya "contain" use kar sakte ho
                />
            </View>

            <Text style={styles.title}>About Houston Durga Bari Society (HDBS)</Text>

            {/* History */}
            <Text style={styles.subHeading}>History</Text>
            <Text style={styles.paragraph}>
                The Bengali community in Houston started celebrating Durga Puja in 1975. With growing participation, a need for a dedicated temple arose. In 1996, Houston Durga Bari Society (HDBS) was formally incorporated to establish a permanent temple and community center. Today, HDBS is a vibrant hub for spiritual, cultural, and community activities.
            </Text>

            {/* Mission */}
            <Text style={styles.subHeading}>Mission</Text>
            <Text style={styles.paragraph}>
                HDBS aims to promote religious, cultural, educational, social, and charitable activities. It preserves Indian and Bengali traditions while welcoming people from all backgrounds.
            </Text>

            {/* Programs */}
            <Text style={styles.subHeading}>Programs & Activities</Text>
            <Text style={styles.point}>• Regular Hindu pujas and major festivals (Durga Puja, Kali Puja, Saraswati Puja, Holi, Diwali, Janmashtami, Shivaratri).</Text>
            <Text style={styles.point}>• Cultural events – music, dance, theater, literature, art exhibitions.</Text>
            <Text style={styles.point}>• Educational initiatives – youth classes, cultural workshops, volunteer programs.</Text>
            <Text style={styles.point}>• Social service – blood donation drives, charity fundraising, community outreach.</Text>
            <Text style={styles.point}>• Food offerings & bhog during festivals, fostering community bonding.</Text>

            {/* Facilities */}
            <Text style={styles.subHeading}>Facilities</Text>
            <Text style={styles.point}>• Durga Bari Temple complex with idols of Durga, Shiva, Vishnu, Saraswati, and Lakshmi.</Text>
            <Text style={styles.point}>• Cultural hall/auditorium for stage programs and community events.</Text>
            <Text style={styles.point}>• Classrooms and learning centers for youth education.</Text>
            <Text style={styles.point}>• Kitchen and dining area for prasad and festival feasts.</Text>

            {/* Organization */}
            <Text style={styles.subHeading}>Organization Details</Text>
            <Text style={styles.point}>• Name: Houston Durga Bari Society</Text>
            <Text style={styles.point}>• Year Founded: 1995</Text>
            {/* Contact */}
            <Text style={styles.subHeading}>Contact</Text>
            <Text style={styles.point}>📍 Address: 13944 Schiller Road, Houston, TX 77082</Text>
            <Text style={styles.point}>📞 Phone: (281) 589-7700</Text>
            <Text style={styles.point}>📧 Email: puja@durgabari.org | feedback@durgabari.org</Text>
            <Text style={styles.point}>
                🌐 Website: <Text style={styles.link} onPress={() => handleWebsitePress('https://durgabari.org/')}>durgabari.org</Text>
            </Text>

            {/* Footer */}
            <Text style={styles.footer}>
                HDBS continues to serve as a spiritual and cultural home for thousands in Houston, preserving traditions, celebrating diversity, and fostering community spirit.
            </Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    imageBox: {
        width: '100%',        // parent ki width le raha
        height: 220,          // fix height for box
        borderRadius: 12,
        overflow: 'hidden',   // image box ke andar hi rahe
        
        marginBottom: 16,
      
        shadowColor: '#000',  // iOS shadow
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },

    title: { fontSize: 28, fontWeight: 'bold', color: '#d32f2f', marginBottom: 16 },
    subHeading: { fontSize: 20, fontWeight: '600', color: '#d32f2f', marginTop: 16, marginBottom: 8 },
    paragraph: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 12 },
    point: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 8 },
    link: { color: '#d32f2f', textDecorationLine: 'underline' },
    footer: { fontSize: 14, color: '#777', textAlign: 'center', marginTop: 20, marginBottom: 30 }
});

export default AboutUs;

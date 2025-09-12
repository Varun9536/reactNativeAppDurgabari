import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Puja from "./TabsPages/Puja";
import Programs from "./TabsPages/Programs";
import Food from "./TabsPages/Food";
import Transport from "./TabsPages/Transport";
import Home from "./Home";
import Sponsors from "./SideBarPages/Sponsors";
import Contacts from "./SideBarPages/Contacts";
import Disclaimer from "./SideBarPages/Disclaimer";
import Alerts from "./SideBarPages/Alerts";

const Tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Events', icon: 'event' },
    { name: 'Transport', icon: 'commute' },
    { name: 'Cultural Programs', icon: 'theaters' },
    { name: 'Food', icon: 'restaurant' },
];

const SidebarItems = [
    { name: 'Home', icon: 'home' },
    { name: 'Alerts', icon: 'event' },
    { name: 'Contacts', icon: 'commute' },
    { name: 'Disclaimer', icon: 'theaters' },
    { name: 'Our Sponsors', icon: 'restaurant' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Navigation() {
    const [activeTab, setActiveTab] = useState('Home');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(-SCREEN_WIDTH * 0.7)).current;

    const colorScheme = useColorScheme(); // Detect phone theme
    const isDark = colorScheme === 'dark';

    const toggleSidebar = () => {
        if (sidebarOpen) {
            Animated.timing(slideAnim, {
                toValue: -SCREEN_WIDTH * 0.7,
                duration: 300,
                useNativeDriver: false,
            }).start(() => setSidebarOpen(false));
        } else {
            setSidebarOpen(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const renderScreen = () => {
        switch (activeTab) {
            case 'Home': return <Home />;
            case 'Events': return <Puja />;
            case 'Transport': return <Transport />;
            case 'Cultural Programs': return <Programs />;
            case 'Our Sponsors': return <Sponsors />;
            case 'Disclaimer': return <Disclaimer />;
            case 'Alerts': return <Alerts />;
            case 'Contacts': return <Contacts />;
            case 'Food': return <Food />;
            default: return <Puja />;
        }
    };

    const onSidebarItemPress = (tabName) => {
        setActiveTab(tabName);
        toggleSidebar();
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f2f2f2' }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#121212' : '#f2f2f2'}
            />

            {sidebarOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={toggleSidebar}
                    activeOpacity={1}
                />
            )}

            <Animated.View style={[styles.sidebar, { left: slideAnim, backgroundColor: isDark ? '#1E1E1E' : '#fff' }]}>
                <View style={styles.SidebarHeadingsBox}>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Text style={[styles.sidebarTitle, { color: isDark ? '#fff' : '#333' }]}>Back</Text>
                    </TouchableOpacity>
                </View>

                {SidebarItems.map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={[
                            styles.sidebarItem,
                            activeTab === item.name && { backgroundColor: isDark ? '#333' : '#e6f0ff', borderRadius: 8 },
                        ]}
                        onPress={() => onSidebarItemPress(item.name)}
                    >
                        <Icon
                            name={item.icon}
                            size={22}
                            color={activeTab === item.name ? '#4e73df' : isDark ? '#fff' : '#333'}
                        />
                        <Text
                            style={[
                                styles.sidebarText,
                                activeTab === item.name && { color: '#4e73df', fontWeight: 'bold' },
                                { color: isDark ? '#fff' : '#333' },
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            <View style={{ flex: 1 }}>
                {/* Header with conditional coloring */}
                <View style={[styles.header, { backgroundColor: activeTab === 'Home' ? '#800000' : '#cce6ff' }]}>
                    <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10 }}>
                        <Icon name="menu" size={28} style={{ color: activeTab === 'Home' ? '#ffffff' : '#000000' }} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: activeTab === 'Home' ? '#ffffff' : '#000000' }]}>{activeTab}</Text>
                    <View style={{ width: 38 }} />
                </View>

                <View style={styles.body}>{renderScreen()}</View>

                {/* Bottom tab bar - unchanged */}
                <View style={[styles.tabBar, { backgroundColor: isDark ? '#1E1E1E' : '#ffffff' }]}>
                    {Tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.name}
                            onPress={() => setActiveTab(tab.name)}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={tab.icon}
                                size={26}
                                color={activeTab === tab.name ? '#4e73df' : isDark ? '#fff' : '#999'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.name && styles.activeText,
                                    { color: activeTab === tab.name ? '#4e73df' : isDark ? '#fff' : '#999' },
                                ]}
                            >
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1 
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 10,
    },
    SidebarHeadingsBox: { 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "space-between" 
    },
    sidebar: { 
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        width: SCREEN_WIDTH * 0.6, 
        paddingTop: 50, 
        paddingHorizontal: 20, 
        elevation: 5, 
        zIndex: 1000 
    },
    sidebarTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20 
    },
    sidebarItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 12 
    },
    sidebarText: { 
        fontSize: 18, 
        marginLeft: 15 
    },
    header: { 
        height: 55, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 10, 
        elevation: 3 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: 'bold' 
    },
    body: { 
        flex: 1 
    },
    tabBar: { 
        flexDirection: 'row', 
        height: 65, 
        borderTopWidth: 1, 
        borderColor: '#ddd', 
        elevation: 5 
    },
    tabItem: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    tabText: { 
        fontSize: 12, 
        marginTop: 2, 
        textAlign: 'center', 
        flexWrap: 'wrap', 
        width: 80 
    },
    activeText: { 
        fontWeight: 'bold' 
    },
});



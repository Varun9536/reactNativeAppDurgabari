import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Puja from "./TabsPages/Puja"


import Programs from "./TabsPages/Programs"
import Food from "./TabsPages/Food"
import Transport from "./TabsPages/Transport"
import Home from "./Home"

import Sponsors from "./SideBarPages/Sponsors"
import Contacts from "./SideBarPages/Contacts"
import Disclaimer from "./SideBarPages/Disclaimer"
import Alerts from "./SideBarPages/Alerts"




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
            case 'Home':
                return <Home />;
            case 'Events':
                return <Puja />;
            case 'Transport':
                return <Transport />;
            case 'Cultural Programs':
                return <Programs />;
            case 'Our Sponsors':
                return <Sponsors />;
            case 'Disclaimer':
                return <Disclaimer />;
            case 'Alerts':
                return <Alerts />;
            case 'Contacts':
                return <Contacts />;
            case 'Food':
                return <Food />;
            default:
                return <Puja />;
        }
    };

    const onSidebarItemPress = (tabName) => {
        setActiveTab(tabName);
        toggleSidebar();
    };

    return (
        <View style={styles.container}>
          
            {sidebarOpen && (
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={toggleSidebar}
                    activeOpacity={1}
                />
            )}

            <Animated.View style={[styles.sidebar, { left: slideAnim }]}>

                <View style={styles.SidebarHeadingsBox}>
                    <TouchableOpacity onPress={toggleSidebar}>
                        <Text style={styles.sidebarTitle}>Back</Text>
                    </TouchableOpacity>
                </View>



                {SidebarItems.map((item) => (
                    <TouchableOpacity
                        key={item.name}
                        style={[
                            styles.sidebarItem,
                            activeTab === item.name && styles.sidebarItemActive,
                        ]}
                        onPress={() => onSidebarItemPress(item.name)}
                    >
                        <Icon
                            name={item.icon}
                            size={22}
                            color={activeTab === item.name ? '#007bff' : '#333'}
                        />
                        <Text
                            style={[
                                styles.sidebarText,
                                activeTab === item.name && { color: '#007bff', fontWeight: 'bold' },
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>

           
            <View style={{ flex: 1 }}>
             
                <View style={styles.header}>
                    <TouchableOpacity onPress={toggleSidebar} style={{ padding: 10 }}>
                        <Icon name="menu" size={28} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{activeTab}</Text>
                    <View style={{ width: 38 }} /> 
                </View>

              
                <View style={styles.body}>{renderScreen()}</View>

             
                <View style={styles.tabBar}>
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
                                color={activeTab === tab.name ? '#007bff' : '#999'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab.name && styles.activeText,
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
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },

    SidebarHeadingsBox:
    {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"

    },
    sidebar: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: SCREEN_WIDTH * 0.7,
        backgroundColor: '#fff',
        paddingTop: 50,
        paddingHorizontal: 20,
        elevation: 5,
        zIndex: 1000,
    },
    sidebarTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    sidebarItemActive: {
        backgroundColor: '#e6f0ff',
        borderRadius: 8,
    },
    sidebarText: {
        fontSize: 18,
        marginLeft: 15,
        color: '#333',
    },
    header: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f7f8fc',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eef2f5',
    },
    text: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        height: 65,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        elevation: 5,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {


        fontSize: 12,
        color: '#999',
        marginTop: 2,
        textAlign: 'center',
        flexWrap: 'wrap',
        width: 80,
    },
    activeText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
});
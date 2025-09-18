
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    RefreshControl
} from "react-native";
import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
import Papa from "papaparse";
import CsvLinks from "../Csv/CsvLinks";
import Icon from 'react-native-vector-icons/Ionicons';

const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
const MAX_SUBTITLES = 5;

const BackgroundGradient = ({ children }) => (
    <View style={styles.gradientBackground}>{children}</View>
);

const EventTile = React.memo(({ event, onPress, cardColor }) => {
    const renderSubtitles = () => {
        if (!event.subtitles || event.subtitles.length === 0) return null;

        const subtitlesToShow = event.subtitles

        return (
            <ScrollView
                style={styles.subtitlesScrollView}
                contentContainerStyle={styles.subtitlesContent}
                showsVerticalScrollIndicator={true}
            >
                
                {subtitlesToShow.map((subtitle, index) => (
                    <View key={index} style={styles.subtitleLine}>
                        <Text style={styles.subtitleText}>
                            <Text style={styles.serialNumber}>{index + 1}.</Text>
                            <Text style={styles.subtitle}> {subtitle}</Text>
                            {event.times && event.times[index] && (
                                <Text style={styles.timeText}> - {event.times[index]}</Text>
                            )}
                        </Text>
                    </View>
                ))}
                
            </ScrollView>
        );
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.9}>
            <View style={styles.card}>
                <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
                    <Text style={styles.dateText}>{event.date}</Text>
                </View>

                <View style={styles.infoBox}>

                    <Text style={styles.title}>{event.title || "Untitled"}</Text>
                    {renderSubtitles()}



                    <View style={styles.viewMoreContainer}>
                        <Text style={styles.viewMoreText}>View Details</Text>
                        <Icon name="chevron-forward" size={16} color="#2C3E50" />
                    </View>
                </View>

                <View style={[styles.cardDecoration, { backgroundColor: cardColor }]} />
            </View>
        </TouchableOpacity>
    );
});

const fetchPujaEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
    try {
        const response = await fetch(CsvLinks.puja);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const parsedEvents = result.data
                    .map((row, index) => {
                        const [month, day, year] = row.DATE?.split("-") || [];
                        const eventDate = new Date(year, month - 1, day);


                        // handle multiple subtitles and times
                        const subtitles = [];
                        if (row.SUBTITLE) subtitles.push(row.SUBTITLE);
                        let i = 1;
                        while (row[`SUBTITLE${i}`]) {
                            subtitles.push(row[`SUBTITLE${i}`]);
                            i++;
                        }

                        const times = [];
                        if (row.TIME) times.push(row.TIME);
                        let j = 1;
                        while (row[`TIME${j}`]) {
                            times.push(row[`TIME${j}`]);
                            j++;
                        }

                        return {
                            id: row.ID || index.toString(),
                            date: row.DATE,
                            times,
                            eventDate,
                            title: row.TITLE,
                            subtitles,
                            details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
                            img: row.IMG,
                        };
                    })
                    .filter(event => event.eventDate >= today)
                    .map(({ eventDate, ...rest }) => rest);

                const grouped = parsedEvents.reduce((acc, event) => {
                    if (!acc[event.date]) acc[event.date] = [];
                    acc[event.date].push(event);
                    return acc;
                }, {});

                if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
                    setGroupedEvents(grouped);
                }

                setLoading(false);
                setError(null);
            }
        });
    } catch (err) {
        console.error("Error fetching CSV:", err);
        setLoading(false);
        setError("Failed to load events. Please check your internet connection.");
    }
};

export default function Puja() {
    const [groupedEvents, setGroupedEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailPage, setShowDetailPage] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const colors = ["#F54927","#F59942","#F52742","#273CF5","#44E6F2","#39F770","#B4FACC","#FAB4D7","#C20C68","#A8A5A5"];


    const loadData = () => {
        setLoading(true);
        setError(null);
        fetchPujaEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchPujaEventsPeriodically(setGroupedEvents, () => { }, setError, groupedEvents)
            .finally(() => setRefreshing(false));
    }, [groupedEvents]);

    useEffect(() => {
        loadData();
        const intervalId = setInterval(() => {
            fetchPujaEventsPeriodically(setGroupedEvents, () => { }, setError, groupedEvents);
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const handleViewMore = useCallback((event) => {
        setSelectedEvent(event);
        setShowDetailPage(true);
    }, []);

    const renderEventTile = useCallback(
        ({ item, index }) => {
            const cardColor = colors[index % colors.length];
            return <EventTile event={item} cardColor={cardColor} onPress={() => handleViewMore(item)} />;
        },
        [colors, handleViewMore]
    );

    const formatDateHeader = (dateStr) => {
        const [month, day, year] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <BackgroundGradient>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#84119dff" />
                    <Text style={styles.loadingText}>Loading Puja events...</Text>
                </View>
            </BackgroundGradient>
        );
    }

    if (error) {
        return (
            <BackgroundGradient>
                <View style={styles.centered}>
                    <Icon name="alert-circle-outline" size={50} color="#E74C3C" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadData}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </BackgroundGradient>
        );
    }

    if (showDetailPage && selectedEvent) {
        return (
            <ViewMoreDetailPuja
                title={selectedEvent.title}
                subtitles={selectedEvent.subtitles}
                times={selectedEvent.times}
                description={selectedEvent.details}
                img={selectedEvent.img}
                onBack={() => {
                    setShowDetailPage(false);
                    setSelectedEvent(null);
                }}
            />
        );
    }

    const dateKeys = Object.keys(groupedEvents);

    if (dateKeys.length === 0) {
        return (
            <BackgroundGradient>
                <View style={styles.centered}>
                    <Icon name="calendar-outline" size={50} color="#84119dff" />
                    <Text style={styles.emptyText}>No upcoming Puja events.</Text>
                    <Text style={styles.emptySubText}>Check back later for updates!</Text>
                </View>
            </BackgroundGradient>
        );
    }

    return (
        <BackgroundGradient>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 30 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#84119dff"]}
                        tintColor="#84119dff"
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.appTitle}>Puja Events</Text>
                    <Text style={styles.appSubtitle}>Spiritual experiences await</Text>
                </View>

                {dateKeys.map((date) => (
                    <View key={date} style={styles.dateSection}>
                        <View style={styles.dateHeaderContainer}>
                            <Icon name="calendar-outline" size={20} color="#2C3E50" />
                            <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
                        </View>
                        <FlatList
                            data={groupedEvents[date]}
                            horizontal
                            keyExtractor={(item) => item.id}
                            renderItem={renderEventTile}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.flatListContent}
                        />
                    </View>
                ))}
            </ScrollView>
        </BackgroundGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        paddingTop: 10,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    appTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#7F8C8D',
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#2C3E50',
    },
    errorText: {
        color: "#E74C3C",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 16,
        fontWeight: "bold",
    },
    retryButton: {
        backgroundColor: "#84119dff",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 2,
    },
    retryText: {
        color: "#fff",
        fontWeight: "bold",
    },
    emptyText: {
        fontSize: 18,
        color: "#2C3E50",
        textAlign: "center",
        marginTop: 15,
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 14,
        color: "#7F8C8D",
        textAlign: "center",
        marginTop: 5,
    },
    dateSection: {
        marginBottom: 25,
        backgroundColor: 'white',
        borderRadius: 12,
        marginHorizontal: 10,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2.22,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    dateHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
        color: "#2C3E50",
    },
    flatListContent: {
        paddingLeft: 15,
        paddingRight: 5,
    },
    cardContainer: {
        marginRight: 15,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#e0e0e0',
        height: 240,
        minWidth: 170
    },
    dateBox: {
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.3)',
    },
    dateText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    infoBox: {
        padding: 5,
        flex: 1,
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 2,
        color: '#2C3E50',
        textAlign: 'center',
    },
    subtitlesScrollView: {
        flex: 1,
        marginBottom: 2,
        maxHeight: 110,
        
    },
    subtitlesContent: {
        paddingHorizontal: 5,
    },
    subtitleLine: {
        marginBottom: 1,
    },
    subtitleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    serialNumber: {
        color: "black",
        fontWeight: 'bold',
        fontSize: 14,
    },
    subtitle: {
        color: "#2C3E50",
        fontWeight: '500',
        fontSize: 14
    },
    timeText: {
        color: "#7F8C8D",
        fontWeight: '500',
        fontSize: 14
    },
    moreItemsText: {
        fontSize: 12,
        color: "#7F8C8D",
        fontStyle: 'italic',
        marginTop: 5,
        textAlign: 'center',
    },
    viewMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    viewMoreText: {
        color: "#2C3E50",
        fontSize: 12,
        fontWeight: "bold",
        marginRight: 3,
    },
    cardDecoration: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
    },
});

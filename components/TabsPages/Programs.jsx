// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
// } from "react-native";
// import ViewMoreDetailProgram from "../ViewMore/ViewMoreDetailProgram";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     return (
//         <View style={styles.card}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 <Text style={styles.dateText}>{event.date}</Text>
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title}</Text>
//                 {event.subtitle ? <Text style={styles.subtitle}>{event.subtitle}</Text> : null}

//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// const fetchEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.program);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for pure date comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         // Parse dd-mm-yyyy format to Date object
//                         const [day, month, year] = row.DATE.split("-");
//                         const eventDate = new Date(year, month - 1, day);

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             time: row.TIME,
//                             eventDate, // temporary for filtering
//                             title: row.TITLE,
//                             subtitle: row.SUBTITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, '\npull stops.'),
//                             img: row.IMG,
//                         };
//                     })
//                     // Filter events whose date is today or in future
//                     .filter(event => event.eventDate >= today)
//                     // Remove eventDate before setting state
//                     .map(({ eventDate, ...rest }) => rest);

//                 if (JSON.stringify(parsedEvents) !== JSON.stringify(currentEvents)) {
//                     setEvents(parsedEvents);
//                 }
//                 setLoading(false);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//     }
// };

// export default function Programs() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

//     useEffect(() => {
//         fetchEventsPeriodically(setEvents, setLoading, events);

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setEvents, setLoading, events);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [events]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = Math.floor(index / 2) % colors.length;
//             const cardColor = colors[colorIndex];
//             return <EventTile event={item} cardColor={cardColor} onPress={() => handleViewMore(item)} />;
//         },
//         [colors, handleViewMore]
//     );

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" color="#c45c00" />
//                 <Text>Loading events...</Text>
//             </View>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailProgram
//                 title={selectedEvent.title}
//                 subtitle={selectedEvent.subtitle}
//                 description={selectedEvent.details}
//                 img={selectedEvent.img}
//                 onBack={() => {
//                     setShowDetailPage(false);
//                     setSelectedEvent(null);
//                 }}
//             />
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={events}
//                 keyExtractor={(item) => item.id}
//                 numColumns={2}
//                 columnWrapperStyle={{ justifyContent: "space-between" }}
//                 renderItem={renderEventTile}
//                 contentContainerStyle={{ paddingBottom: 20 }}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff4e6",
//         padding: 10,
//     },
//     card: {
//         width: CARD_WIDTH,
//         borderRadius: 8,
//         backgroundColor: "transparent",
//         marginBottom: 15,
//         elevation: 4,
//     },
//     dateBox: {
//         paddingVertical: 6,
//         alignItems: "center",
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//     },
//     dateText: {
//         color: "#fff",
//         fontWeight: "bold",
//         fontSize: 13,
//     },
//     infoBox: {
//         backgroundColor: "#fff",
//         padding: 10,
//         position: "relative",
//         borderBottomLeftRadius: 8,
//         borderBottomRightRadius: 8,
//         minHeight: 110,
//         justifyContent: "space-between",
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: "bold",
//         marginBottom: 2,
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "crimson",
//         fontWeight: "bold",
//     },
//     viewMoreButton: {
//         backgroundColor: "#4a7c59",
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 4,
//         alignSelf: "flex-start",
//         marginTop: 6,
//     },
//     viewMoreText: {
//         color: "#fff",
//         fontSize: 12,
//         fontWeight: "bold",
//     },
//     cornerFold: {
//         position: "absolute",
//         bottom: 0,
//         right: 0,
//         width: 0,
//         height: 0,
//         borderStyle: "solid",
//         borderRightWidth: 16,
//         borderTopWidth: 16,
//         borderRightColor: "transparent",
//         borderTopColor: "#e6af74",
//         zIndex: 2,
//     },
// });





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
import ViewMoreDetailProgram from "../ViewMore/ViewMoreDetailProgram";
import Papa from "papaparse";
import CsvLinks from "../Csv/CsvLinks";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
const MAX_SUBTITLES = 5;

const BackgroundGradient = ({ children }) => {
    return (
        <View style={styles.gradientBackground}>
            {children}
        </View>
    );
};

// Mapping program types to icons (optional, like food page)
const getProgramIcon = (title) => {
    const lowerTitle = (title || '').toLowerCase();
    if (lowerTitle.includes('workshop')) return <Icon name="construct" size={24} color="#E67E22" />;
    if (lowerTitle.includes('lecture')) return <Icon name="school" size={24} color="#27AE60" />;
    if (lowerTitle.includes('event')) return <MaterialCommunityIcons name="party-popper" size={24} color="#C0392B" />;
    return <Icon name="document-text" size={24} color="#16A085" />;
};

const EventTile = React.memo(({ event, onPress, cardColor }) => {

    const renderSubtitlesWithTimes = () => {
        if (!event.subtitles || event.subtitles.length === 0) return null;
        const subtitlesToShow = event.subtitles.slice(0, MAX_SUBTITLES);
        return (
            <ScrollView style={styles.subtitlesScrollView} contentContainerStyle={styles.subtitlesContent} showsVerticalScrollIndicator={false}>
                {subtitlesToShow.map((subtitle, index) => {
                    const time = event.times && event.times[index] ? event.times[index] : '';
                    return (
                        <View key={index} style={styles.subtitleLine}>
                            <Text style={styles.subtitleText}>
                                <Text style={styles.serialNumber}>{index + 1}.</Text>
                                <Text style={styles.subtitle}> {subtitle}</Text>
                                {time && <Text style={styles.timeText}> - {time}</Text>}
                            </Text>
                        </View>
                    );
                })}
                {event.subtitles.length > MAX_SUBTITLES && (
                    <Text style={styles.moreItemsText}>+{event.subtitles.length - MAX_SUBTITLES} more items...</Text>
                )}
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
                    {/* <View style={styles.iconContainer}>{getProgramIcon(event.title)}</View> */}
                    
                        <Text style={styles.title}>{event.title || "Untitled"}</Text>
                        {renderSubtitlesWithTimes()}
                  


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

const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
    try {
        const response = await fetch(CsvLinks.program);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const parsedEvents = result.data.map((row, index) => {
                    const [day, month, year] = row.DATE?.split("-") || [];
                    const eventDate = new Date(year, month - 1, day);

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
                    while (row[`TIME${j}`]) times.push(row[`TIME${j}`]), j++;

                    return {
                        id: row.ID || index.toString(),
                        date: row.DATE,
                        eventDate,
                        title: row.TITLE,
                        subtitles,
                        times,
                        details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
                        img: row.IMG,
                    };
                }).filter(event => event.eventDate >= today)
                    .map(({ eventDate, ...rest }) => rest);

                const grouped = parsedEvents.reduce((acc, event) => {
                    if (!acc[event.date]) acc[event.date] = [];
                    acc[event.date].push(event);
                    return acc;
                }, {});

                if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) setGroupedEvents(grouped);
                setLoading(false);
                setError(null);
            },
        });
    } catch (err) {
        console.error("Error fetching CSV:", err);
        setLoading(false);
        setError("Failed to load events. Please check your internet connection.");
    }
};

export default function Programs() {
    const [groupedEvents, setGroupedEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailPage, setShowDetailPage] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const colors = ["#E67E22", "#27AE60", "#2980B9", "#8E44AD", "#16A085"];

    const loadData = () => {
        setLoading(true);
        setError(null);
        fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEventsPeriodically(setGroupedEvents, () => { }, setError, groupedEvents)
            .finally(() => setRefreshing(false));
    }, [groupedEvents]);

    useEffect(() => {
        loadData();
        const intervalId = setInterval(() => {
            fetchEventsPeriodically(setGroupedEvents, () => { }, setError, groupedEvents);
        }, 10000);
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
        const [day, month, year] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <BackgroundGradient>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#84119dff" />
                    <Text style={styles.loadingText}>Loading programs...</Text>
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
            <ViewMoreDetailProgram
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
                    <Icon name="calendar-outline" size={50} color="#27AE60" />
                    <Text style={styles.emptyText}>No upcoming programs available.</Text>
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={colors} tintColor={colors[0]} />}
            >
                <View style={styles.header}>
                    <Text style={styles.appTitle}>Programs</Text>
                    <Text style={styles.appSubtitle}>Upcoming exciting events</Text>
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
        backgroundColor: "#27AE60",
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
        position: "relative",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between"
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 2,
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
        maxHeight: 110, // Limit the height for subtitles
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
        fontSize: 14,
    },
    timeText: {
        color: "#7F8C8D",
        fontWeight: '500',
        fontSize: 14,
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

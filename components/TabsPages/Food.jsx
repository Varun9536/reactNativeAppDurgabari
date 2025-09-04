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
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     return (
//         <View style={styles.card}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 <Text style={styles.dateText}>{event.date}</Text>
//                 {event.time ? <Text style={styles.timeText}>{event.time}</Text> : null}
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title || "Untitled"}</Text>
//                 {event.subtitle ? (
//                     <Text style={styles.subtitle}>{event.subtitle}</Text>
//                 ) : null}

//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// const fetchEventsPeriodically = async (setEvents, setLoading, setError, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             time: row.TIME,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitle: row.SUBTITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 if (JSON.stringify(parsedEvents) !== JSON.stringify(currentEvents)) {
//                     setEvents(parsedEvents);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);

//     const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setEvents, setLoading, setError, events);
//     };

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setEvents, setLoading, setError, events);
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
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // === UI States ===

//     if (loading) {
//         return (
//             <View style={styles.centered}>
//                 <ActivityIndicator size="large" color="#c45c00" />
//                 <Text>Loading events...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.centered}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                     <Text style={styles.retryText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
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

//     if (events.length === 0) {
//         return (
//             <View style={styles.centered}>
//                 <Text style={styles.emptyText}>No upcoming food events available.</Text>
//             </View>
//         );
//     }

//     // === Main Grid ===

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
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     errorText: {
//         color: "crimson",
//         fontSize: 16,
//         textAlign: "center",
//         marginBottom: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#4a7c59",
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 6,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 16,
//         color: "#777",
//         textAlign: "center",
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
//     timeText: {
//         color: "#fff",
//         fontSize: 12,
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


// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     ScrollView,
// } from "react-native";
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 30;

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     return (
//         <View style={styles.card}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 {event.time ? <Text style={styles.timeText}>{event.time}</Text> : null}
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title || "Untitled"}</Text>
//                 {event.subtitle ? (
//                     <Text style={styles.subtitle}>{event.subtitle}</Text>
//                 ) : null}

//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             time: row.TIME,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitle: row.SUBTITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 // Group by date
//                 const grouped = parsedEvents.reduce((acc, event) => {
//                     if (!acc[event.date]) {
//                         acc[event.date] = [];
//                     }
//                     acc[event.date].push(event);
//                     return acc;
//                 }, {});

//                 if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
//                     setGroupedEvents(grouped);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [groupedEvents, setGroupedEvents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);

//     const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//     };

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [groupedEvents]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = Math.floor(index / 2) % colors.length;
//             const cardColor = colors[colorIndex];
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // === UI States ===

//     if (loading) {
//         return (
//             <View style={styles.centered}>
//                 <ActivityIndicator size="large" color="#c45c00" />
//                 <Text>Loading events...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.centered}>
//                 <Text style={styles.errorText}>{error}</Text>
//                 <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                     <Text style={styles.retryText}>Retry</Text>
//                 </TouchableOpacity>
//             </View>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
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

//     const dateKeys = Object.keys(groupedEvents);

//     if (dateKeys.length === 0) {
//         return (
//             <View style={styles.centered}>
//                 <Text style={styles.emptyText}>No upcoming food events available.</Text>
//             </View>
//         );
//     }

//     // === Main Grouped Horizontal Lists ===

//     return (
//         <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
//             {dateKeys.map((date) => (
//                 <View key={date} style={{ marginBottom: 20 }}>
//                     <Text style={styles.dateHeader}>{date}</Text>
//                     <FlatList
//                         data={groupedEvents[date]}
//                         horizontal
//                         keyExtractor={(item) => item.id}
//                         renderItem={renderEventTile}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{ paddingLeft: 10 }}
//                     />
//                 </View>
//             ))}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff4e6",
//         paddingTop: 10,
//     },
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     errorText: {
//         color: "crimson",
//         fontSize: 16,
//         textAlign: "center",
//         marginBottom: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#4a7c59",
//         paddingHorizontal: 20,
//         paddingVertical: 10,
//         borderRadius: 6,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 16,
//         color: "#777",
//         textAlign: "center",
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginVertical: 10,
//         marginLeft: 10,
//         color: "#4a4a4a",
//     },
//     card: {
//         width: CARD_WIDTH,
//         borderRadius: 8,
//         backgroundColor: "transparent",
//         marginRight: 12,
//         elevation: 4,
//     },
//     dateBox: {
//         paddingVertical: 6,
//         alignItems: "center",
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//     },
//     timeText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "bold",
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
//    cornerFold: {
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



// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     ScrollView,
//     ImageBackground,
//     Image,
//     RefreshControl
// } from "react-native";
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// // Using external background image
// const BACKGROUND_IMAGE = { uri: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' };

// // Food category mapping
// const getFoodIcon = (title, time) => {
//     const lowerTitle = (title || '').toLowerCase();
//     const lowerTime = (time || '').toLowerCase();

//     if (lowerTime.includes('breakfast') || lowerTitle.includes('breakfast') || lowerTitle.includes('morning')) 
//         return { icon: <Icon name="cafe" size={24} color="#FF6B6B" />, type: 'breakfast' };
//     if (lowerTime.includes('lunch') || lowerTitle.includes('lunch') || lowerTitle.includes('noon')) 
//         return { icon: <Icon name="restaurant" size={24} color="#4ECDC4" />, type: 'lunch' };
//     if (lowerTime.includes('dinner') || lowerTitle.includes('dinner') || lowerTitle.includes('evening')) 
//         return { icon: <FontAwesome5 name="utensils" size={24} color="#45B7D1" />, type: 'dinner' };
//     if (lowerTime.includes('snack') || lowerTitle.includes('snack') || lowerTitle.includes('coffee')) 
//         return { icon: <Icon name="ice-cream" size={24} color="#F9A826" />, type: 'snack' };
//     if (lowerTitle.includes('special') || lowerTitle.includes('event') || lowerTitle.includes('party')) 
//         return { icon: <MaterialCommunityIcons name="party-popper" size={24} color="#6A0572" />, type: 'special' };

//     return { icon: <Icon name="fast-food" size={24} color="#4a7c59" />, type: 'default' };
// };

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     const foodIcon = getFoodIcon(event.title, event.time);

//     return (
//         <TouchableOpacity 
//             style={styles.cardContainer}
//             onPress={onPress}
//             activeOpacity={0.9}
//         >
//             <View style={styles.card}>
//                 <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                     {event.time ? (
//                         <Text style={styles.timeText}>{event.time}</Text>
//                     ) : null}
//                     <Icon name="time-outline" size={14} color="#fff" style={styles.timeIcon} />
//                 </View>

//                 <View style={styles.infoBox}>
//                     <View style={styles.iconContainer}>
//                         {foodIcon.icon}
//                     </View>

//                     <Text style={styles.title} numberOfLines={1}>{event.title || "Untitled"}</Text>
//                     {event.subtitle ? (
//                         <Text style={styles.subtitle} numberOfLines={2}>{event.subtitle}</Text>
//                     ) : null}

//                     <View style={styles.viewMoreContainer}>
//                         <Text style={styles.viewMoreText}>View Details</Text>
//                         <Icon name="chevron-forward" size={16} color="#4a7c59" />
//                     </View>
//                 </View>

//                 <View style={[styles.cardDecoration, { backgroundColor: cardColor }]} />
//             </View>
//         </TouchableOpacity>
//     );
// });

// const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             time: row.TIME,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitle: row.SUBTITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 // Group by date
//                 const grouped = parsedEvents.reduce((acc, event) => {
//                     if (!acc[event.date]) {
//                         acc[event.date] = [];
//                     }
//                     acc[event.date].push(event);
//                     return acc;
//                 }, {});

//                 if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
//                     setGroupedEvents(grouped);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [groupedEvents, setGroupedEvents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9A826", "#6A0572"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//     };

//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         loadData();
//         setTimeout(() => setRefreshing(false), 1000);
//     }, []);

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [groupedEvents]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = index % colors.length;
//             const cardColor = colors[colorIndex];
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // Format date headers to be more readable
//     const formatDateHeader = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         const date = new Date(year, month - 1, day);
//         return date.toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             month: 'long', 
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     // === UI States ===

//     if (loading) {
//         return (
//             <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
//                 <View style={[styles.centered, styles.overlay]}>
//                     <ActivityIndicator size="large" color="#FF6B6B" />
//                     <Text style={styles.loadingText}>Loading delicious events...</Text>
//                 </View>
//             </ImageBackground>
//         );
//     }

//     if (error) {
//         return (
//             <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
//                 <View style={[styles.centered, styles.overlay]}>
//                     <Icon name="alert-circle-outline" size={50} color="#FF6B6B" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                         <Text style={styles.retryText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             </ImageBackground>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
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

//     const dateKeys = Object.keys(groupedEvents);

//     if (dateKeys.length === 0) {
//         return (
//             <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
//                 <View style={[styles.centered, styles.overlay]}>
//                     <Icon name="restaurant-outline" size={50} color="#4a7c59" />
//                     <Text style={styles.emptyText}>No upcoming food events available.</Text>
//                     <Text style={styles.emptySubText}>Check back later for tasty updates!</Text>
//                 </View>
//             </ImageBackground>
//         );
//     }

//     // === Main Grouped Horizontal Lists ===

//     return (
//         <ImageBackground source={BACKGROUND_IMAGE} style={styles.backgroundImage} resizeMode="cover">
//             <View style={styles.overlay}>
//                 <ScrollView 
//                     style={styles.container} 
//                     contentContainerStyle={{ paddingBottom: 30 }}
//                     refreshControl={
//                         <RefreshControl
//                             refreshing={refreshing}
//                             onRefresh={onRefresh}
//                             colors={["#FF6B6B"]}
//                             tintColor="#FF6B6B"
//                         />
//                     }
//                 >
//                     <View style={styles.header}>
//                         <Text style={styles.appTitle}>Food Events</Text>
//                         <Text style={styles.appSubtitle}>Delicious experiences await</Text>
//                     </View>

//                     {dateKeys.map((date) => (
//                         <View key={date} style={styles.dateSection}>
//                             <View style={styles.dateHeaderContainer}>
//                                 <Icon name="calendar-outline" size={20} color="#4a4a4a" />
//                                 <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
//                             </View>
//                             <FlatList
//                                 data={groupedEvents[date]}
//                                 horizontal
//                                 keyExtractor={(item) => item.id}
//                                 renderItem={renderEventTile}
//                                 showsHorizontalScrollIndicator={false}
//                                 contentContainerStyle={styles.flatListContent}
//                             />
//                         </View>
//                     ))}
//                 </ScrollView>
//             </View>
//         </ImageBackground>
//     );
// }

// const styles = StyleSheet.create({
//     backgroundImage: {
//         flex: 1,
//         width: '100%',
//         height: SCREEN_HEIGHT,
//     },
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(255, 255, 255, 0.85)',
//     },
//     container: {
//         flex: 1,
//         paddingTop: 10,
//     },
//     header: {
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         marginBottom: 10,
//     },
//     appTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#4a4a4a',
//         marginBottom: 5,
//     },
//     appSubtitle: {
//         fontSize: 16,
//         color: '#777',
//     },
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     loadingText: {
//         marginTop: 15,
//         fontSize: 16,
//         color: '#4a4a4a',
//     },
//     errorText: {
//         color: "#FF6B6B",
//         fontSize: 16,
//         textAlign: "center",
//         marginVertical: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#4a7c59",
//         paddingHorizontal: 25,
//         paddingVertical: 12,
//         borderRadius: 25,
//         elevation: 2,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 18,
//         color: "#4a4a4a",
//         textAlign: "center",
//         marginTop: 15,
//         fontWeight: '600',
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: "#777",
//         textAlign: "center",
//         marginTop: 5,
//     },
//     dateSection: {
//         marginBottom: 25,
//     },
//     dateHeaderContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 8,
//         color: "#4a4a4a",
//     },
//     flatListContent: {
//         paddingLeft: 15,
//         paddingRight: 5,
//     },
//     cardContainer: {
//         width: CARD_WIDTH,
//         marginRight: 15,
//         borderRadius: 12,
//         backgroundColor: "transparent",
//         elevation: 4,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//     },
//     card: {
//         borderRadius: 12,
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//     },
//     dateBox: {
//         paddingVertical: 8,
//         alignItems: "center",
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     timeIcon: {
//         marginRight: 5,
//     },
//     timeText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "bold",
//     },
//     infoBox: {
//         padding: 15,
//         position: "relative",
//         minHeight: 140,
//     },
//     iconContainer: {
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     title: {
//         fontSize: 15,
//         fontWeight: "bold",
//         marginBottom: 5,
//         color: '#333',
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "#777",
//         textAlign: 'center',
//         marginBottom: 10,
//         lineHeight: 18,
//     },
//     viewMoreContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 'auto',
//     },
//     viewMoreText: {
//         color: "#4a7c59",
//         fontSize: 12,
//         fontWeight: "bold",
//         marginRight: 3,
//     },
//     cardDecoration: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 4,
//     },
// });



// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     ScrollView,
//     ImageBackground,
//     RefreshControl
// } from "react-native";
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// // Using a subtle gradient background instead of image
// const BackgroundGradient = ({ children }) => {
//   return (
//     <View style={styles.gradientBackground}>
//       {children}
//     </View>
//   );
// };

// // Food category mapping
// const getFoodIcon = (title, time) => {
//     const lowerTitle = (title || '').toLowerCase();
//     const lowerTime = (time || '').toLowerCase();

//     if (lowerTime.includes('breakfast') || lowerTitle.includes('breakfast') || lowerTitle.includes('morning')) 
//         return { icon: <Icon name="cafe" size={24} color="#E67E22" />, type: 'breakfast' };
//     if (lowerTime.includes('lunch') || lowerTitle.includes('lunch') || lowerTitle.includes('noon')) 
//         return { icon: <Icon name="restaurant" size={24} color="#27AE60" />, type: 'lunch' };
//     if (lowerTime.includes('dinner') || lowerTitle.includes('dinner') || lowerTitle.includes('evening')) 
//         return { icon: <FontAwesome5 name="utensils" size={24} color="#2980B9" />, type: 'dinner' };
//     if (lowerTime.includes('snack') || lowerTitle.includes('snack') || lowerTitle.includes('coffee')) 
//         return { icon: <Icon name="ice-cream" size={24} color="#8E44AD" />, type: 'snack' };
//     if (lowerTitle.includes('special') || lowerTitle.includes('event') || lowerTitle.includes('party')) 
//         return { icon: <MaterialCommunityIcons name="party-popper" size={24} color="#C0392B" />, type: 'special' };

//     return { icon: <Icon name="fast-food" size={24} color="#16A085" />, type: 'default' };
// };

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     const foodIcon = getFoodIcon(event.title, event.time);

//     return (
//         <TouchableOpacity 
//             style={styles.cardContainer}
//             onPress={onPress}
//             activeOpacity={0.9}
//         >
//             <View style={styles.card}>
//                 <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                     {event.time ? (
//                         <Text style={styles.timeText}>{event.time}</Text>
//                     ) : null}
//                     <Icon name="time-outline" size={14} color="#fff" style={styles.timeIcon} />
//                 </View>

//                 <View style={styles.infoBox}>
//                     <View style={styles.iconContainer}>
//                         {foodIcon.icon}
//                     </View>

//                     <Text style={styles.title} numberOfLines={1}>{event.title || "Untitled"}</Text>
//                     {event.subtitle ? (
//                         <Text style={styles.subtitle} numberOfLines={2}>{event.subtitle}</Text>
//                     ) : null}

//                     <View style={styles.viewMoreContainer}>
//                         <Text style={styles.viewMoreText}>View Details</Text>
//                         <Icon name="chevron-forward" size={16} color="#2C3E50" />
//                     </View>
//                 </View>

//                 <View style={[styles.cardDecoration, { backgroundColor: cardColor }]} />
//             </View>
//         </TouchableOpacity>
//     );
// });

// const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             time: row.TIME,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitle: row.SUBTITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 // Group by date
//                 const grouped = parsedEvents.reduce((acc, event) => {
//                     if (!acc[event.date]) {
//                         acc[event.date] = [];
//                     }
//                     acc[event.date].push(event);
//                     return acc;
//                 }, {});

//                 if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
//                     setGroupedEvents(grouped);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [groupedEvents, setGroupedEvents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const colors = ["#E67E22", "#27AE60", "#2980B9", "#8E44AD", "#16A085"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//     };

//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         loadData();
//         setTimeout(() => setRefreshing(false), 1000);
//     }, []);

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [groupedEvents]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = index % colors.length;
//             const cardColor = colors[colorIndex];
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // Format date headers to be more readable
//     const formatDateHeader = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         const date = new Date(year, month - 1, day);
//         return date.toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             month: 'long', 
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     // === UI States ===

//     if (loading) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <ActivityIndicator size="large" color="#E67E22" />
//                     <Text style={styles.loadingText}>Loading delicious events...</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (error) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="alert-circle-outline" size={50} color="#E74C3C" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                         <Text style={styles.retryText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
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

//     const dateKeys = Object.keys(groupedEvents);

//     if (dateKeys.length === 0) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="restaurant-outline" size={50} color="#27AE60" />
//                     <Text style={styles.emptyText}>No upcoming food events available.</Text>
//                     <Text style={styles.emptySubText}>Check back later for tasty updates!</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     // === Main Grouped Horizontal Lists ===

//     return (
//         <BackgroundGradient>
//             <ScrollView 
//                 style={styles.container} 
//                 contentContainerStyle={{ paddingBottom: 30 }}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={["#E67E22"]}
//                         tintColor="#E67E22"
//                     />
//                 }
//             >
//                 <View style={styles.header}>
//                     <Text style={styles.appTitle}>Food Events</Text>
//                     <Text style={styles.appSubtitle}>Delicious experiences await</Text>
//                 </View>

//                 {dateKeys.map((date) => (
//                     <View key={date} style={styles.dateSection}>
//                         <View style={styles.dateHeaderContainer}>
//                             <Icon name="calendar-outline" size={20} color="#2C3E50" />
//                             <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
//                         </View>
//                         <FlatList
//                             data={groupedEvents[date]}
//                             horizontal
//                             keyExtractor={(item) => item.id}
//                             renderItem={renderEventTile}
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.flatListContent}
//                         />
//                     </View>
//                 ))}
//             </ScrollView>
//         </BackgroundGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradientBackground: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//         backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
//     },
//     container: {
//         flex: 1,
//         paddingTop: 10,
//     },
//     header: {
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         marginBottom: 10,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         margin: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     appTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#2C3E50',
//         marginBottom: 5,
//     },
//     appSubtitle: {
//         fontSize: 16,
//         color: '#7F8C8D',
//     },
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     loadingText: {
//         marginTop: 15,
//         fontSize: 16,
//         color: '#2C3E50',
//     },
//     errorText: {
//         color: "#E74C3C",
//         fontSize: 16,
//         textAlign: "center",
//         marginVertical: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#27AE60",
//         paddingHorizontal: 25,
//         paddingVertical: 12,
//         borderRadius: 25,
//         elevation: 2,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 18,
//         color: "#2C3E50",
//         textAlign: "center",
//         marginTop: 15,
//         fontWeight: '600',
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: "#7F8C8D",
//         textAlign: "center",
//         marginTop: 5,
//     },
//     dateSection: {
//         marginBottom: 25,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         marginHorizontal: 10,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     dateHeaderContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 8,
//         color: "#2C3E50",
//     },
//     flatListContent: {
//         paddingLeft: 15,
//         paddingRight: 5,
//     },
//     cardContainer: {
//         width: CARD_WIDTH,
//         marginRight: 15,
//         borderRadius: 12,
//         backgroundColor: "transparent",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     card: {
//         borderRadius: 12,
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#EDEDED',
//     },
//     dateBox: {
//         paddingVertical: 8,
//         alignItems: "center",
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     timeIcon: {
//         marginRight: 5,
//     },
//     timeText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "bold",
//     },
//     infoBox: {
//         padding: 15,
//         position: "relative",
//         minHeight: 140,
//     },
//     iconContainer: {
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     title: {
//         fontSize: 15,
//         fontWeight: "bold",
//         marginBottom: 5,
//         color: '#2C3E50',
//         textAlign: 'center',
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "#7F8C8D",
//         textAlign: 'center',
//         marginBottom: 10,
//         lineHeight: 18,
//     },
//     viewMoreContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 'auto',
//     },
//     viewMoreText: {
//         color: "#2C3E50",
//         fontSize: 12,
//         fontWeight: "bold",
//         marginRight: 3,
//     },
//     cardDecoration: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 4,
//     },
// });




// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     ScrollView,
//     RefreshControl
// } from "react-native";
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// // Using a subtle gradient background instead of image
// const BackgroundGradient = ({ children }) => {
//   return (
//     <View style={styles.gradientBackground}>
//       {children}
//     </View>
//   );
// };

// // Food category mapping
// const getFoodIcon = (title, time) => {
//     const lowerTitle = (title || '').toLowerCase();
//     const lowerTime = (time || '').toLowerCase();

//     if (lowerTime.includes('breakfast') || lowerTitle.includes('breakfast') || lowerTitle.includes('morning')) 
//         return { icon: <Icon name="cafe" size={24} color="#E67E22" />, type: 'breakfast' };
//     if (lowerTime.includes('lunch') || lowerTitle.includes('lunch') || lowerTitle.includes('noon')) 
//         return { icon: <Icon name="restaurant" size={24} color="#27AE60" />, type: 'lunch' };
//     if (lowerTime.includes('dinner') || lowerTitle.includes('dinner') || lowerTitle.includes('evening')) 
//         return { icon: <FontAwesome5 name="utensils" size={24} color="#2980B9" />, type: 'dinner' };
//     if (lowerTime.includes('snack') || lowerTitle.includes('snack') || lowerTitle.includes('coffee')) 
//         return { icon: <Icon name="ice-cream" size={24} color="#8E44AD" />, type: 'snack' };
//     if (lowerTitle.includes('special') || lowerTitle.includes('event') || lowerTitle.includes('party')) 
//         return { icon: <MaterialCommunityIcons name="party-popper" size={24} color="#C0392B" />, type: 'special' };

//     return { icon: <Icon name="fast-food" size={24} color="#16A085" />, type: 'default' };
// };

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     const foodIcon = getFoodIcon(event.title, event.time);

//     // Function to render multiple subtitles with their times
//     const renderSubtitlesWithTimes = () => {
//         if (!event.subtitles || event.subtitles.length === 0) return null;

//         return event.subtitles.map((subtitle, index) => {
//             const time = event.times && event.times[index] ? event.times[index] : '';

//             return (
//                 <View key={index} style={styles.subtitleContainer}>
//                     {time ? (
//                         <View style={styles.timeSubtitleRow}>
//                             <Icon name="time-outline" size={12} color="#7F8C8D" style={styles.subtitleTimeIcon} />
//                             <Text style={styles.subtitleTimeText}>{time}</Text>
//                         </View>
//                     ) : null}
//                     <Text style={styles.subtitle} numberOfLines={2}>{subtitle}</Text>
//                 </View>
//             );
//         });
//     };

//     return (
//         <TouchableOpacity 
//             style={styles.cardContainer}
//             onPress={onPress}
//             activeOpacity={0.9}
//         >
//             <View style={styles.card}>
//                 <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                     <Text style={styles.dateText}>{event.date}</Text>
//                 </View>

//                 <View style={styles.infoBox}>
//                     <View style={styles.iconContainer}>
//                         {foodIcon.icon}
//                     </View>

//                     <Text style={styles.title} numberOfLines={1}>{event.title || "Untitled"}</Text>

//                     {renderSubtitlesWithTimes()}

//                     <View style={styles.viewMoreContainer}>
//                         <Text style={styles.viewMoreText}>View Details</Text>
//                         <Icon name="chevron-forward" size={16} color="#2C3E50" />
//                     </View>
//                 </View>

//                 <View style={[styles.cardDecoration, { backgroundColor: cardColor }]} />
//             </View>
//         </TouchableOpacity>
//     );
// });

// const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         // Extract multiple subtitles (SUBTITLE, SUBTITLE1, SUBTITLE2, etc.)
//                         const subtitles = [];
//                         let subtitleIndex = 1;

//                         // Add main subtitle if exists
//                         if (row.SUBTITLE) {
//                             subtitles.push(row.SUBTITLE);
//                         }

//                         // Add additional subtitles (SUBTITLE1, SUBTITLE2, etc.)
//                         while (row[`SUBTITLE${subtitleIndex}`]) {
//                             subtitles.push(row[`SUBTITLE${subtitleIndex}`]);
//                             subtitleIndex++;
//                         }

//                         // Extract multiple times (TIME, TIME1, TIME2, etc.)
//                         const times = [];
//                         let timeIndex = 1;

//                         // Add main time if exists
//                         if (row.TIME) {
//                             times.push(row.TIME);
//                         }

//                         // Add additional times (TIME1, TIME2, etc.)
//                         while (row[`TIME${timeIndex}`]) {
//                             times.push(row[`TIME${timeIndex}`]);
//                             timeIndex++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             times: times,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitles: subtitles,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 // Group by date
//                 const grouped = parsedEvents.reduce((acc, event) => {
//                     if (!acc[event.date]) {
//                         acc[event.date] = [];
//                     }
//                     acc[event.date].push(event);
//                     return acc;
//                 }, {});

//                 if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
//                     setGroupedEvents(grouped);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [groupedEvents, setGroupedEvents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const colors = ["#E67E22", "#27AE60", "#2980B9", "#8E44AD", "#16A085"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//     };

//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         loadData();
//         setTimeout(() => setRefreshing(false), 1000);
//     }, []);

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [groupedEvents]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = index % colors.length;
//             const cardColor = colors[colorIndex];
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // Format date headers to be more readable
//     const formatDateHeader = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         const date = new Date(year, month - 1, day);
//         return date.toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             month: 'long', 
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     // === UI States ===

//     if (loading) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <ActivityIndicator size="large" color="#E67E22" />
//                     <Text style={styles.loadingText}>Loading delicious events...</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (error) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="alert-circle-outline" size={50} color="#E74C3C" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                         <Text style={styles.retryText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
//                 title={selectedEvent.title}
//                 subtitles={selectedEvent.subtitles}
//                 times={selectedEvent.times}
//                 description={selectedEvent.details}
//                 img={selectedEvent.img}
//                 onBack={() => {
//                     setShowDetailPage(false);
//                     setSelectedEvent(null);
//                 }}
//             />
//         );
//     }

//     const dateKeys = Object.keys(groupedEvents);

//     if (dateKeys.length === 0) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="restaurant-outline" size={50} color="#27AE60" />
//                     <Text style={styles.emptyText}>No upcoming food events available.</Text>
//                     <Text style={styles.emptySubText}>Check back later for tasty updates!</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     // === Main Grouped Horizontal Lists ===

//     return (
//         <BackgroundGradient>
//             <ScrollView 
//                 style={styles.container} 
//                 contentContainerStyle={{ paddingBottom: 30 }}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={["#E67E22"]}
//                         tintColor="#E67E22"
//                     />
//                 }
//             >
//                 <View style={styles.header}>
//                     <Text style={styles.appTitle}>Food Events</Text>
//                     <Text style={styles.appSubtitle}>Delicious experiences await</Text>
//                 </View>

//                 {dateKeys.map((date) => (
//                     <View key={date} style={styles.dateSection}>
//                         <View style={styles.dateHeaderContainer}>
//                             <Icon name="calendar-outline" size={20} color="#2C3E50" />
//                             <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
//                         </View>
//                         <FlatList
//                             data={groupedEvents[date]}
//                             horizontal
//                             keyExtractor={(item) => item.id}
//                             renderItem={renderEventTile}
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.flatListContent}
//                         />
//                     </View>
//                 ))}
//             </ScrollView>
//         </BackgroundGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradientBackground: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     container: {
//         flex: 1,
//         paddingTop: 10,
//     },
//     header: {
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         marginBottom: 10,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         margin: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     appTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#2C3E50',
//         marginBottom: 5,
//     },
//     appSubtitle: {
//         fontSize: 16,
//         color: '#7F8C8D',
//     },
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     loadingText: {
//         marginTop: 15,
//         fontSize: 16,
//         color: '#2C3E50',
//     },
//     errorText: {
//         color: "#E74C3C",
//         fontSize: 16,
//         textAlign: "center",
//         marginVertical: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#27AE60",
//         paddingHorizontal: 25,
//         paddingVertical: 12,
//         borderRadius: 25,
//         elevation: 2,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 18,
//         color: "#2C3E50",
//         textAlign: "center",
//         marginTop: 15,
//         fontWeight: '600',
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: "#7F8C8D",
//         textAlign: "center",
//         marginTop: 5,
//     },
//     dateSection: {
//         marginBottom: 25,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         marginHorizontal: 10,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     dateHeaderContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 8,
//         color: "#2C3E50",
//     },
//     flatListContent: {
//         paddingLeft: 15,
//         paddingRight: 5,
//     },
//     cardContainer: {
//         width: CARD_WIDTH,
//         marginRight: 15,
//         borderRadius: 12,
//         backgroundColor: "transparent",
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     card: {
//         borderRadius: 12,
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#EDEDED',
//     },
//     dateBox: {
//         paddingVertical: 8,
//         alignItems: "center",
//         justifyContent: 'center',
//     },
//     dateText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "bold",
//     },
//     infoBox: {
//         padding: 15,
//         position: "relative",
//         minHeight: 160,
//     },
//     iconContainer: {
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     title: {
//         fontSize: 16,
//         fontWeight: "bold",
//         marginBottom: 10,
//         color: '#2C3E50',
//         textAlign: 'center',
//     },
//     subtitleContainer: {
//         marginBottom: 8,
//     },
//     timeSubtitleRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 2,
//     },
//     subtitleTimeIcon: {
//         marginRight: 4,
//     },
//     subtitleTimeText: {
//         fontSize: 12,
//         color: "#7F8C8D",
//         fontWeight: '500',
//     },
//     subtitle: {
//         fontSize: 14,
//         color: "#2C3E50",
//         textAlign: 'left',
//         lineHeight: 18,
//         fontWeight: '500',
//     },
//     viewMoreContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 'auto',
//     },
//     viewMoreText: {
//         color: "#2C3E50",
//         fontSize: 12,
//         fontWeight: "bold",
//         marginRight: 3,
//     },
//     cardDecoration: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 4,
//     },
// });




// import React, { useState, useEffect, useCallback } from "react";
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
//     Dimensions,
//     ActivityIndicator,
//     ScrollView,
//     RefreshControl
// } from "react-native";
// import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";
// import Icon from 'react-native-vector-icons/Ionicons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// // Using a subtle gradient background instead of image
// const BackgroundGradient = ({ children }) => {
//   return (
//     <View style={styles.gradientBackground}>
//       {children}
//     </View>
//   );
// };

// // Food category mapping
// const getFoodIcon = (title, time) => {
//     const lowerTitle = (title || '').toLowerCase();
//     const lowerTime = (time || '').toLowerCase();

//     if (lowerTime.includes('breakfast') || lowerTitle.includes('breakfast') || lowerTitle.includes('morning')) 
//         return { icon: <Icon name="cafe" size={24} color="#E67E22" />, type: 'breakfast' };
//     if (lowerTime.includes('lunch') || lowerTitle.includes('lunch') || lowerTitle.includes('noon')) 
//         return { icon: <Icon name="restaurant" size={24} color="#27AE60" />, type: 'lunch' };
//     if (lowerTime.includes('dinner') || lowerTitle.includes('dinner') || lowerTitle.includes('evening')) 
//         return { icon: <FontAwesome5 name="utensils" size={24} color="#2980B9" />, type: 'dinner' };
//     if (lowerTime.includes('snack') || lowerTitle.includes('snack') || lowerTitle.includes('coffee')) 
//         return { icon: <Icon name="ice-cream" size={24} color="#8E44AD" />, type: 'snack' };
//     if (lowerTitle.includes('special') || lowerTitle.includes('event') || lowerTitle.includes('party')) 
//         return { icon: <MaterialCommunityIcons name="party-popper" size={24} color="#C0392B" />, type: 'special' };

//     return { icon: <Icon name="fast-food" size={24} color="#16A085" />, type: 'default' };
// };

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     const foodIcon = getFoodIcon(event.title, event.time);

//     // Function to render multiple subtitles with their times on the same line
//     const renderSubtitlesWithTimes = () => {
//         if (!event.subtitles || event.subtitles.length === 0) return null;

//         return event.subtitles.map((subtitle, index) => {
//             const time = event.times && event.times[index] ? event.times[index] : '';

//             return (
//                 <View key={index} style={styles.subtitleContainer}>
//                     <Text style={styles.subtitle} numberOfLines={2}>
//                          <Text>{subtitle} - </Text>
//                         {time ? (
//                             <Text>

//                                 <Text style={styles.subtitleTimeText}> {time}  </Text>
//                             </Text>
//                         ) : null}

//                     </Text>
//                 </View>
//             );
//         });
//     };

//     return (
//         <TouchableOpacity 
//             style={styles.cardContainer}
//             onPress={onPress}
//             activeOpacity={0.9}
//         >
//             <View style={styles.card}>
//                 <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                     <Text style={styles.dateText}>{event.date}</Text>
//                 </View>

//                 <View style={styles.infoBox}>
//                     <View style={styles.iconContainer}>
//                         {foodIcon.icon}
//                     </View>

//                     <Text style={styles.title} numberOfLines={2}>{event.title || "Untitled"}</Text>

//                     {renderSubtitlesWithTimes()}

//                     <View style={styles.viewMoreContainer}>
//                         <Text style={styles.viewMoreText}>View Details</Text>
//                         <Icon name="chevron-forward" size={16} color="#2C3E50" />
//                     </View>
//                 </View>

//                 <View style={[styles.cardDecoration, { backgroundColor: cardColor }]} />
//             </View>
//         </TouchableOpacity>
//     );
// });

// const fetchEventsPeriodically = async (setGroupedEvents, setLoading, setError, currentGrouped) => {
//     try {
//         const response = await fetch(CsvLinks.food);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0); // Reset time for comparison

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE?.split("-") || [];
//                         const eventDate = new Date(year, month - 1, day);

//                         // Extract multiple subtitles (SUBTITLE, SUBTITLE1, SUBTITLE2, etc.)
//                         const subtitles = [];
//                         let subtitleIndex = 1;

//                         // Add main subtitle if exists
//                         if (row.SUBTITLE) {
//                             subtitles.push(row.SUBTITLE);
//                         }

//                         // Add additional subtitles (SUBTITLE1, SUBTITLE2, etc.)
//                         while (row[`SUBTITLE${subtitleIndex}`]) {
//                             subtitles.push(row[`SUBTITLE${subtitleIndex}`]);
//                             subtitleIndex++;
//                         }

//                         // Extract multiple times (TIME, TIME1, TIME2, etc.)
//                         const times = [];
//                         let timeIndex = 1;

//                         // Add main time if exists
//                         if (row.TIME) {
//                             times.push(row.TIME);
//                         }

//                         // Add additional times (TIME1, TIME2, etc.)
//                         while (row[`TIME${timeIndex}`]) {
//                             times.push(row[`TIME${timeIndex}`]);
//                             timeIndex++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             times: times,
//                             eventDate,
//                             title: row.TITLE,
//                             subtitles: subtitles,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .map(({ eventDate, ...rest }) => rest);

//                 // Group by date
//                 const grouped = parsedEvents.reduce((acc, event) => {
//                     if (!acc[event.date]) {
//                         acc[event.date] = [];
//                     }
//                     acc[event.date].push(event);
//                     return acc;
//                 }, {});

//                 if (JSON.stringify(grouped) !== JSON.stringify(currentGrouped)) {
//                     setGroupedEvents(grouped);
//                 }

//                 setLoading(false);
//                 setError(null);
//             },
//         });
//     } catch (err) {
//         console.error("Error fetching CSV:", err);
//         setLoading(false);
//         setError("Failed to load events. Please check your internet connection and try again.");
//     }
// };

// export default function Food() {
//     const [groupedEvents, setGroupedEvents] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);

//     const colors = ["#E67E22", "#27AE60", "#2980B9", "#8E44AD", "#16A085"];

//     const loadData = () => {
//         setLoading(true);
//         setError(null);
//         fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//     };

//     const onRefresh = useCallback(() => {
//         setRefreshing(true);
//         loadData();
//         setTimeout(() => setRefreshing(false), 1000);
//     }, []);

//     useEffect(() => {
//         loadData();

//         const intervalId = setInterval(() => {
//             fetchEventsPeriodically(setGroupedEvents, setLoading, setError, groupedEvents);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [groupedEvents]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const renderEventTile = useCallback(
//         ({ item, index }) => {
//             const colorIndex = index % colors.length;
//             const cardColor = colors[colorIndex];
//             return (
//                 <EventTile
//                     event={item}
//                     cardColor={cardColor}
//                     onPress={() => handleViewMore(item)}
//                 />
//             );
//         },
//         [colors, handleViewMore]
//     );

//     // Format date headers to be more readable
//     const formatDateHeader = (dateStr) => {
//         const [day, month, year] = dateStr.split('-');
//         const date = new Date(year, month - 1, day);
//         return date.toLocaleDateString('en-US', { 
//             weekday: 'long', 
//             month: 'long', 
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     // === UI States ===

//     if (loading) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <ActivityIndicator size="large" color="#E67E22" />
//                     <Text style={styles.loadingText}>Loading delicious events...</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (error) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="alert-circle-outline" size={50} color="#E74C3C" />
//                     <Text style={styles.errorText}>{error}</Text>
//                     <TouchableOpacity style={styles.retryButton} onPress={loadData}>
//                         <Text style={styles.retryText}>Retry</Text>
//                     </TouchableOpacity>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     if (showDetailPage && selectedEvent) {
//         return (
//             <ViewMoreDetailFood
//                 title={selectedEvent.title}
//                 subtitles={selectedEvent.subtitles}
//                 times={selectedEvent.times}
//                 description={selectedEvent.details}
//                 img={selectedEvent.img}
//                 onBack={() => {
//                     setShowDetailPage(false);
//                     setSelectedEvent(null);
//                 }}
//             />
//         );
//     }

//     const dateKeys = Object.keys(groupedEvents);

//     if (dateKeys.length === 0) {
//         return (
//             <BackgroundGradient>
//                 <View style={[styles.centered]}>
//                     <Icon name="restaurant-outline" size={50} color="#27AE60" />
//                     <Text style={styles.emptyText}>No upcoming food events available.</Text>
//                     <Text style={styles.emptySubText}>Check back later for tasty updates!</Text>
//                 </View>
//             </BackgroundGradient>
//         );
//     }

//     // === Main Grouped Horizontal Lists ===

//     return (
//         <BackgroundGradient>
//             <ScrollView 
//                 style={styles.container} 
//                 contentContainerStyle={{ paddingBottom: 30 }}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={onRefresh}
//                         colors={["#E67E22"]}
//                         tintColor="#E67E22"
//                     />
//                 }
//             >
//                 <View style={styles.header}>
//                     <Text style={styles.appTitle}>Food Events</Text>
//                     <Text style={styles.appSubtitle}>Delicious experiences await</Text>
//                 </View>

//                 {dateKeys.map((date) => (
//                     <View key={date} style={styles.dateSection}>
//                         <View style={styles.dateHeaderContainer}>
//                             <Icon name="calendar-outline" size={20} color="#2C3E50" />
//                             <Text style={styles.dateHeader}>{formatDateHeader(date)}</Text>
//                         </View>
//                         <FlatList
//                             data={groupedEvents[date]}
//                             horizontal
//                             keyExtractor={(item) => item.id}
//                             renderItem={renderEventTile}
//                             showsHorizontalScrollIndicator={false}
//                             contentContainerStyle={styles.flatListContent}
//                         />
//                     </View>
//                 ))}
//             </ScrollView>
//         </BackgroundGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradientBackground: {
//         flex: 1,
//         backgroundColor: '#f8f9fa',
//     },
//     container: {
//         flex: 1,
//         paddingTop: 10,
//     },
//     header: {
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         marginBottom: 10,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         margin: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     appTitle: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         color: '#2C3E50',
//         marginBottom: 5,
//     },
//     appSubtitle: {
//         fontSize: 16,
//         color: '#7F8C8D',
//     },
//     centered: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingHorizontal: 20,
//     },
//     loadingText: {
//         marginTop: 15,
//         fontSize: 16,
//         color: '#2C3E50',
//     },
//     errorText: {
//         color: "#E74C3C",
//         fontSize: 16,
//         textAlign: "center",
//         marginVertical: 16,
//         fontWeight: "bold",
//     },
//     retryButton: {
//         backgroundColor: "#27AE60",
//         paddingHorizontal: 25,
//         paddingVertical: 12,
//         borderRadius: 25,
//         elevation: 2,
//     },
//     retryText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     emptyText: {
//         fontSize: 18,
//         color: "#2C3E50",
//         textAlign: "center",
//         marginTop: 15,
//         fontWeight: '600',
//     },
//     emptySubText: {
//         fontSize: 14,
//         color: "#7F8C8D",
//         textAlign: "center",
//         marginTop: 5,
//     },
//     dateSection: {
//         marginBottom: 25,
//         backgroundColor: 'white',
//         borderRadius: 12,
//         marginHorizontal: 10,
//         paddingVertical: 10,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 2.22,
//         elevation: 3,
//     },
//     dateHeaderContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         marginBottom: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         marginLeft: 8,
//         color: "#2C3E50",
//     },
//     flatListContent: {
//         paddingLeft: 15,
//         paddingRight: 5,
//     },
//     cardContainer: {
//         width: CARD_WIDTH,
//         marginRight: 15,
//         borderRadius: 12,
//         backgroundColor: "transparent",
//         // shadowColor: "#000",
//         // shadowOffset: { width: 0, height: 2 },
//         // shadowOpacity: 0.2,
//         // shadowRadius: 4,
//         // elevation: 4,
//     },
//     card: {
//         borderRadius: 12,
//         overflow: 'hidden',
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#EDEDED',
//     },
//     dateBox: {
//         paddingVertical: 8,
//         alignItems: "center",
//         justifyContent: 'center',
//     },
//     dateText: {
//         color: "#fff",
//         fontSize: 13,
//         fontWeight: "bold",
//     },
//     infoBox: {
//         padding: 15,
//         position: "relative",
//     },
//     iconContainer: {
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: "bold",
//         marginBottom: 8,
//         color: '#2C3E50',
//         textAlign: 'center',
//     },
//     subtitleContainer: {
//         marginBottom: 6,
//     },
//     subtitleTimeIcon: {
//         marginRight: 4,
//     },
//     subtitleTimeText: {
//         fontSize: 12,
//         color: "#7F8C8D",
//         fontWeight: '500',
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "#2C3E50",
//         textAlign: 'left',
//         lineHeight: 18,
//         fontWeight: '500',
//     },
//     viewMoreContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: 10,
//     },
//     viewMoreText: {
//         color: "#2C3E50",
//         fontSize: 12,
//         fontWeight: "bold",
//         marginRight: 3,
//     },
//     cardDecoration: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 4,
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
import ViewMoreDetailFood from "../ViewMore/ViewMoreDetailFood";
import Papa from "papaparse";
import CsvLinks from "../Csv/CsvLinks";
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;

// Using a subtle gradient background instead of image
const BackgroundGradient = ({ children }) => {
    return (
        <View style={styles.gradientBackground}>
            {children}
        </View>
    );
};

// Food category mapping
const getFoodIcon = (title, time) => {
    const lowerTitle = (title || '').toLowerCase();
    const lowerTime = (time || '').toLowerCase();

    if (lowerTime.includes('breakfast') || lowerTitle.includes('breakfast') || lowerTitle.includes('morning'))
        return { icon: <Icon name="cafe" size={24} color="#E67E22" />, type: 'breakfast' };
    if (lowerTime.includes('lunch') || lowerTitle.includes('lunch') || lowerTitle.includes('noon'))
        return { icon: <Icon name="restaurant" size={24} color="#27AE60" />, type: 'lunch' };
    if (lowerTime.includes('dinner') || lowerTitle.includes('dinner') || lowerTitle.includes('evening'))
        return { icon: <FontAwesome5 name="utensils" size={24} color="#2980B9" />, type: 'dinner' };
    if (lowerTime.includes('snack') || lowerTitle.includes('snack') || lowerTitle.includes('coffee'))
        return { icon: <Icon name="ice-cream" size={24} color="#8E44AD" />, type: 'snack' };
    if (lowerTitle.includes('special') || lowerTitle.includes('event') || lowerTitle.includes('party'))
        return { icon: <MaterialCommunityIcons name="party-popper" size={24} color="#C0392B" />, type: 'special' };

    return { icon: <Icon name="fast-food" size={24} color="#16A085" />, type: 'default' };
};

const EventTile = React.memo(({ event, onPress, cardColor }) => {
    const foodIcon = getFoodIcon(event.title, event.times[0] || "");

    // Render multiple subtitles + times on same line
    const renderSubtitlesWithTimes = () => {
        if (!event.subtitles || event.subtitles.length === 0) return null;

        return event.subtitles.map((subtitle, index) => {
            const time = event.times && event.times[index] ? event.times[index] : '';
            return (
                <View key={index} style={styles.subtitleContainer}>
                    <Text style={styles.subtitle} numberOfLines={2}>
                        {subtitle}{time ? <Text style={styles.subtitleTimeText}> - {time}</Text> : ""}
                    </Text>
                </View>
            );
        });
    };

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={styles.card}>
                <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
                    <Text style={styles.dateText}>{event.date}</Text>
                </View>

                <View style={styles.infoBox}>
                    <View style={styles.iconContainer}>
                        {foodIcon.icon}
                    </View>

                    <Text style={styles.title} numberOfLines={2}>{event.title || "Untitled"}</Text>

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
        const response = await fetch(CsvLinks.food);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const parsedEvents = result.data
                    .map((row, index) => {
                        const [day, month, year] = row.DATE?.split("-") || [];
                        const eventDate = new Date(year, month - 1, day);

                        // Extract subtitles
                        const subtitles = [];
                        if (row.SUBTITLE) subtitles.push(row.SUBTITLE);
                        let i = 1;
                        while (row[`SUBTITLE${i}`]) {
                            subtitles.push(row[`SUBTITLE${i}`]);
                            i++;
                        }

                        // Extract times
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
                    .filter((event) => event.eventDate >= today)
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
            },
        });
    } catch (err) {
        console.error("Error fetching CSV:", err);
        setLoading(false);
        setError("Failed to load events. Please check your internet connection and try again.");
    }
};

export default function Food() {
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
        }, 30000);
        return () => clearInterval(intervalId);
    }, []); // ✅ fixed

    const handleViewMore = useCallback((event) => {
        setSelectedEvent(event);
        setShowDetailPage(true);
    }, []);

    const renderEventTile = useCallback(
        ({ item, index }) => {
            const cardColor = colors[index % colors.length];
            return (
                <EventTile
                    event={item}
                    cardColor={cardColor}
                    onPress={() => handleViewMore(item)}
                />
            );
        },
        [colors, handleViewMore]
    );

    const formatDateHeader = (dateStr) => {
        const [day, month, year] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // === UI States ===

    if (loading) {
        return (
            <BackgroundGradient>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#E67E22" />
                    <Text style={styles.loadingText}>Loading delicious events...</Text>
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
            <ViewMoreDetailFood
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
                    <Icon name="restaurant-outline" size={50} color="#27AE60" />
                    <Text style={styles.emptyText}>No upcoming food events available.</Text>
                    <Text style={styles.emptySubText}>Check back later for tasty updates!</Text>
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
                        colors={["#E67E22"]}
                        tintColor="#E67E22"
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.appTitle}>Food Events</Text>
                    <Text style={styles.appSubtitle}>Delicious experiences await</Text>
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
        backgroundColor: '#f8f9fa',
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
        width: CARD_WIDTH,
        marginRight: 15,
        borderRadius: 12,
        backgroundColor: "transparent",
    },
    card: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EDEDED',
    },
    dateBox: {
        paddingVertical: 8,
        alignItems: "center",
        justifyContent: 'center',
    },
    dateText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "bold",
    },
    infoBox: {
        padding: 15,
        position: "relative",
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: '#2C3E50',
        textAlign: 'center',
    },
    subtitleContainer: {
        marginBottom: 6,
    },
    subtitleTimeText: {
        fontSize: 12,
        color: "#7F8C8D",
        fontWeight: '500',
    },
    subtitle: {
        fontSize: 13,
        color: "#2C3E50",
        lineHeight: 18,
        fontWeight: '500',
    },
    viewMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
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


import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
import Papa from "papaparse";
import CsvLinks from "../Csv/CsvLinks";

const CARD_WIDTH = Dimensions.get("window").width / 2 - 20;

const EventTile = React.memo(({ event, onPress, cardColor }) => {
    return (
        <View style={styles.card}>
            <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
                <Text style={styles.dateText}>{event.date}</Text>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.title}>{event.title}</Text>
                {event.subtitle ? <Text style={styles.subtitle}>{event.subtitle}</Text> : null}

                <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
                    <Text style={styles.viewMoreText}>View More</Text>
                </TouchableOpacity>

                <View style={styles.cornerFold} />
            </View>
        </View>
    );
});

const fetchPujaEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
    try {
        const response = await fetch(CsvLinks.puja);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // reset time for comparison

                const parsedEvents = result.data
                    .map((row, index) => {
                        // Assuming date format is dd-mm-yyyy
                        const [day, month, year] = row.DATE.split("-");
                        const eventDate = new Date(year, month - 1, day);

                        return {
                            id: row.ID || index.toString(),
                            date: row.DATE,
                            time: row.TIME,
                            eventDate, // temp for filtering
                            title: row.TITLE,
                            subtitle: row.SUBTITLE,
                            details: row.DETAILS?.replace(/pull stops\./gi, '\npull stops.'),
                            img: row.IMG,
                        };
                    })
                    // filter only future or today events
                    .filter(event => event.eventDate >= today)
                    // remove temporary eventDate before setting state
                    .map(({ eventDate, ...rest }) => rest);

                // Only update state if events actually changed (avoid infinite loops)
                if (JSON.stringify(parsedEvents) !== JSON.stringify(currentEvents)) {
                    setEvents(parsedEvents);
                }
                setLoading(false);
            },
        });
    } catch (err) {
        console.error("Error fetching CSV:", err);
        setLoading(false);
    }
};

export default function Puja() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailPage, setShowDetailPage] = useState(false);
    const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

    useEffect(() => {
        fetchPujaEventsPeriodically(setEvents, setLoading, events);

        const intervalId = setInterval(() => {
            fetchPujaEventsPeriodically(setEvents, setLoading, events);
        }, 30000);

        return () => clearInterval(intervalId);
    }, [events]);

    const handleViewMore = useCallback((event) => {
        setSelectedEvent(event);
        setShowDetailPage(true);
    }, []);

    const renderEventTile = useCallback(
        ({ item, index }) => {
            const colorIndex = Math.floor(index / 2) % colors.length;
            const cardColor = colors[colorIndex];
            return <EventTile event={item} cardColor={cardColor} onPress={() => handleViewMore(item)} />;
        },
        [colors, handleViewMore]
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#c45c00" />
                <Text>Loading events...</Text>
            </View>
        );
    }

    if (showDetailPage && selectedEvent) {
        return (
            <ViewMoreDetailPuja
                title={selectedEvent.title}
                subtitle={selectedEvent.subtitle}
                description={selectedEvent.details}
                img={selectedEvent.img}
                onBack={() => {
                    setShowDetailPage(false);
                    setSelectedEvent(null);
                }}
            />
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={renderEventTile}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff4e6",
        padding: 10,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 8,
        backgroundColor: "transparent",
        marginBottom: 15,
        elevation: 4,
    },
    dateBox: {
        paddingVertical: 6,
        alignItems: "center",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    dateText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },
    infoBox: {
        backgroundColor: "#fff",
        padding: 10,
        position: "relative",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        minHeight: 110,
        justifyContent: "space-between",
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: "crimson",
        fontWeight: "bold",
    },
    viewMoreButton: {
        backgroundColor: "#4a7c59",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: "flex-start",
        marginTop: 6,
    },
    viewMoreText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    cornerFold: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
        borderStyle: "solid",
        borderRightWidth: 16,
        borderTopWidth: 16,
        borderRightColor: "transparent",
        borderTopColor: "#e6af74",
        zIndex: 2,
    },
});



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
// import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
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

//                 {/* Subtitles + Times horizontal */}
//                 {event.subtimes && event.subtimes.length > 0 && (
//                     <View>
//                         {event.subtimes.map((st, idx) => (
//                             <View
//                                 key={idx}
//                                 style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}
//                             >
//                                 <Text style={styles.subtitle}>{st.subtitle}</Text>
//                                 {st.time ? (
//                                     <Text style={styles.timeText}>  ({st.time})</Text>
//                                 ) : null}
//                             </View>
//                         ))}
//                     </View>
//                 )}

//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// const fetchPujaEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.puja);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE.split("-");
//                         const eventDate = new Date(year, month - 1, day);

//                         // collect subtitle + time pairs
//                         let subtimes = [];
//                         let i = 0;
//                         while (true) {
//                             const subKey = i === 0 ? "SUBTITLE" : `SUBTITLE${i}`;
//                             const timeKey = i === 0 ? "TIME" : `TIME${i}`;
//                             if (!row[subKey] && !row[timeKey]) break;
//                             subtimes.push({
//                                 subtitle: row[subKey] || "",
//                                 time: row[timeKey] || "",
//                             });
//                             i++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             eventDate,
//                             title: row.TITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, '\npull stops.'),
//                             img: row.IMG,
//                             subtimes, // array of subtitle + time pairs
//                         };
//                     })
//                     .filter(event => event.eventDate >= today)
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

// export default function Puja() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

//     useEffect(() => {
//         fetchPujaEventsPeriodically(setEvents, setLoading, events);

//         const intervalId = setInterval(() => {
//             fetchPujaEventsPeriodically(setEvents, setLoading, events);
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
//             <ViewMoreDetailPuja
//                 title={selectedEvent.title}
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
//         // elevation: 4,
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
//     timeText: {
//         fontSize: 12,
//         color: "gray",
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
// import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const SCREEN_WIDTH = Dimensions.get("window").width;

// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     // calculate dynamic height based on number of subtimes
//     const subtitleCount = event.subtimes?.length || 0;
//     const dynamicHeight = 80 + subtitleCount * 20; // base height + 20 per subtitle

//     // calculate dynamic width based on longest subtitle or title
//     const allTexts = [event.title, ...(event.subtimes?.map(st => st.subtitle) || [])];
//     const maxLength = Math.max(...allTexts.map(t => t.length));
//     const dynamicWidth = Math.min(SCREEN_WIDTH * 0.9, Math.max(SCREEN_WIDTH / 2, maxLength * 8)); // 8 pixels per char approx

//     return (
//         <View style={[styles.card, { minHeight: dynamicHeight, width: dynamicWidth }]}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 <Text style={styles.dateText}>{event.date}</Text>
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title}</Text>

//                 {/* {event.subtimes && event.subtimes.length > 0 && (
//                     <View style={{ marginTop: 4 }}>
//                         {event.subtimes.map((st, idx) => (
//                             <View
//                                 key={idx}
//                                 style={{
//                                     flexDirection: "row",
//                                     alignItems: "center",
//                                     marginTop: idx === 0 ? 0 : 4,
//                                 }}
//                             >
//                                 <Text style={styles.subtitle} numberOfLines={1} ellipsizeMode="tail">
//                                     {st.subtitle}
//                                 </Text>
//                                 {st.time ? (
//                                     <Text style={styles.timeText}>  ({st.time})</Text>
//                                 ) : null}
//                             </View>
//                         ))}
//                     </View>
//                 )} */}


//                 {event.subtimes && event.subtimes.length > 0 && (
//                     <View style={{ marginTop: 4 }}>
//                         {event.subtimes.map((st, idx) => (
//                             <Text
//                                 key={idx}
//                                 style={{ flexDirection: "row" }}
//                                 numberOfLines={1}
//                             >
//                                 <Text style={styles.subtitle}>{st.subtitle} {st.time}</Text>
//                                 {/* {st.time ? <Text style={styles.timeText}> ({st.time})</Text> : null} */}
//                             </Text>
//                         ))}
//                     </View>
//                 )}



//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// const fetchPujaEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.puja);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE.split("-");
//                         const eventDate = new Date(year, month - 1, day);

//                         let subtimes = [];
//                         let i = 0;
//                         while (true) {
//                             const subKey = i === 0 ? "SUBTITLE" : `SUBTITLE${i}`;
//                             const timeKey = i === 0 ? "TIME" : `TIME${i}`;
//                             if (!row[subKey] && !row[timeKey]) break;
//                             subtimes.push({
//                                 subtitle: row[subKey] || "",
//                                 time: row[timeKey] || "",
//                             });
//                             i++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             eventDate,
//                             title: row.TITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                             subtimes,
//                         };
//                     })
//                     .filter(event => event.eventDate >= today)
//                     .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

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

// export default function Puja() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

//     useEffect(() => {
//         fetchPujaEventsPeriodically(setEvents, setLoading, events);

//         const intervalId = setInterval(() => {
//             fetchPujaEventsPeriodically(setEvents, setLoading, events);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [events]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const groupedEvents = events.reduce((acc, event) => {
//         if (!acc[event.date]) acc[event.date] = [];
//         acc[event.date].push(event);
//         return acc;
//     }, {});

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
//             <ViewMoreDetailPuja
//                 title={selectedEvent.title}
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
//         <ScrollView style={styles.container}>
//             {Object.keys(groupedEvents).map((date, dateIdx) => (
//                 <View key={date}>
//                     <Text style={styles.dateHeader}>{date}</Text>
//                     <FlatList
//                         horizontal
//                         data={groupedEvents[date]}
//                         keyExtractor={(item) => item.id}
//                         renderItem={({ item, index }) => {
//                             const cardColor = colors[index % colors.length];
//                             return (
//                                 <EventTile
//                                     event={item}
//                                     cardColor={cardColor}
//                                     onPress={() => handleViewMore(item)}
//                                 />
//                             );
//                         }}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 15 }}
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
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#4a4a4a",
//         paddingHorizontal: 10,
//         marginBottom: 6,
//     },
//     card: {
//         borderRadius: 8,
//         backgroundColor: "transparent",
//         marginRight: 10,
//         marginBottom: 5,
//     },
//     dateBox: {
//         paddingVertical: 6,
//         alignItems: "center",
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//         paddingHorizontaln: 5
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
//         justifyContent: "space-between",
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: "bold",
//         marginBottom: 4,
//     },
//     subtitle: {
//         fontSize: 13,
//         color: "crimson",
//         fontWeight: "bold",
//     },
//     timeText: {
//         fontSize: 12,
//         color: "gray",
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
// import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const SCREEN_WIDTH = Dimensions.get("window").width;
// const CARD_MIN_WIDTH = SCREEN_WIDTH / 2; // minimum width

// // ----------------- TILE -----------------
// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     // सभी texts (title + subtitles + time) को collect करो
//     const allTexts = [
//         event.title,
//         ...(event.subtimes?.map(
//             (st) => `${st.subtitle}${st.time ? " (" + st.time + ")" : ""}`
//         ) || []),
//     ];

//     // सबसे बड़ा length निकालो
//     const maxLength = Math.max(...allTexts.map((t) => t.length));

//     // dynamic width निकालो
//     const dynamicWidth = Math.min(
//         SCREEN_WIDTH * 0.9,
//         Math.max(CARD_MIN_WIDTH, maxLength * 8) // 8px प्रति character approx
//     );

//     return (
//         <View style={[styles.card, { width: dynamicWidth }]}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 <Text style={styles.dateText}>{event.date}</Text>
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title}</Text>

//                 {/* ✅ Subtitle + time ek hi line mai hamesha */}
//                 {event.subtimes && event.subtimes.length > 0 && (
//     <View style={{ marginTop: 4 }}>
//         {event.subtimes.map((st, idx) => (
//             <Text key={idx} style={styles.subtimeLine}>
//                 <Text style={styles.subtitle}>{st.subtitle}</Text>
//                 {st.time ? (
//                     <Text style={styles.timeText}> ({st.time})</Text>
//                 ) : null}
//             </Text>
//         ))}
//     </View>
// )}


//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// // ----------------- FETCH CSV -----------------
// const fetchPujaEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.puja);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE.split("-");
//                         const eventDate = new Date(year, month - 1, day);

//                         let subtimes = [];
//                         let i = 0;
//                         while (true) {
//                             const subKey = i === 0 ? "SUBTITLE" : `SUBTITLE${i}`;
//                             const timeKey = i === 0 ? "TIME" : `TIME${i}`;
//                             if (!row[subKey] && !row[timeKey]) break;
//                             subtimes.push({
//                                 subtitle: row[subKey] || "",
//                                 time: row[timeKey] || "",
//                             });
//                             i++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             eventDate,
//                             title: row.TITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                             subtimes,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

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

// // ----------------- MAIN COMPONENT -----------------
// export default function Puja() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const colors = ["#84119d", "#ec7e1d", "#f10a11", "#0d89bb"];

//     useEffect(() => {
//         fetchPujaEventsPeriodically(setEvents, setLoading, events);

//         const intervalId = setInterval(() => {
//             fetchPujaEventsPeriodically(setEvents, setLoading, events);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [events]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const groupedEvents = events.reduce((acc, event) => {
//         if (!acc[event.date]) acc[event.date] = [];
//         acc[event.date].push(event);
//         return acc;
//     }, {});

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
//             <ViewMoreDetailPuja
//                 title={selectedEvent.title}
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
//         <ScrollView style={styles.container}>
//             {Object.keys(groupedEvents).map((date) => (
//                 <View key={date}>
//                     <Text style={styles.dateHeader}>{date}</Text>
//                     <FlatList
//                         horizontal
//                         data={groupedEvents[date]}
//                         keyExtractor={(item) => item.id}
//                         renderItem={({ item, index }) => {
//                             const cardColor = colors[index % colors.length];
//                             return (
//                                 <EventTile
//                                     event={item}
//                                     cardColor={cardColor}
//                                     onPress={() => handleViewMore(item)}
//                                 />
//                             );
//                         }}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{
//                             paddingLeft: 10,
//                             paddingRight: 10,
//                             paddingBottom: 15,
//                         }}
//                     />
//                 </View>
//             ))}
//         </ScrollView>
//     );
// }

// // ----------------- STYLES -----------------
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff4e6",
//         paddingTop: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#4a4a4a",
//         paddingHorizontal: 10,
//         marginBottom: 6,
//     },
//     card: {
//         borderRadius: 8,
//         backgroundColor: "transparent",
//         marginRight: 10,
//         marginBottom: 5,
//     },
//     dateBox: {
//         paddingVertical: 6,
//         alignItems: "center",
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//         paddingHorizontal: 5,
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
//         justifyContent: "space-between",
//     },
//     title: {
//         fontSize: 14,
//         fontWeight: "bold",
//         marginBottom: 4,
//     },
//     subtimeContainer: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         marginTop: 4,
//         alignItems: "center",
//     },
//     subtimeBox: {
//         marginRight: 12,
//         marginBottom: 6,
//     },
//     subtimeLine: {
//     flexDirection: "row", // subtitle + time ek line me
//     flexWrap: "nowrap",
//     marginTop: 2, // subtitle nayi line ka spacing
// },

//     subtitle: {
//         fontSize: 13,
//         color: "crimson",
//         fontWeight: "bold",
//     },
//     timeText: {
//         fontSize: 12,
//         color: "gray",
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
// import ViewMoreDetailPuja from "../ViewMore/ViewMoreDetailPuja";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const SCREEN_WIDTH = Dimensions.get("window").width;
// const CARD_MIN_WIDTH = SCREEN_WIDTH / 2; // minimum width

// // ----------------- TILE -----------------
// const EventTile = React.memo(({ event, onPress, cardColor }) => {
//     return (
//         <View style={styles.card}>
//             <View style={[styles.dateBox, { backgroundColor: cardColor }]}>
//                 <Text style={styles.dateText}>{event.date}</Text>
//             </View>

//             <View style={styles.infoBox}>
//                 <Text style={styles.title}>{event.title}</Text>

//                 {/* ✅ Subtitle + time in single lines */}
//                 {event.subtimes && event.subtimes.length > 0 && (
//                     <View style={styles.subtimeContainer}>
//                         {event.subtimes.map((st, idx) => (
//                             <Text key={idx} style={styles.subtimeLine} numberOfLines={1}>
//                                 {st.subtitle && (
//                                     <Text style={styles.subtitle}>{st.subtitle}</Text>
//                                 )}
//                                 {st.time && (
//                                     <Text style={styles.timeText}> - {st.time}</Text>
//                                 )}
//                             </Text>
//                         ))}
//                     </View>
//                 )}

//                 <TouchableOpacity style={styles.viewMoreButton} onPress={onPress}>
//                     <Text style={styles.viewMoreText}>View More</Text>
//                 </TouchableOpacity>

//                 <View style={styles.cornerFold} />
//             </View>
//         </View>
//     );
// });

// // ----------------- FETCH CSV -----------------
// const fetchPujaEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
//     try {
//         const response = await fetch(CsvLinks.puja);
//         const csvText = await response.text();

//         Papa.parse(csvText, {
//             header: true,
//             skipEmptyLines: true,
//             complete: (result) => {
//                 const today = new Date();
//                 today.setHours(0, 0, 0, 0);

//                 const parsedEvents = result.data
//                     .map((row, index) => {
//                         const [day, month, year] = row.DATE.split("-");
//                         const eventDate = new Date(year, month - 1, day);

//                         let subtimes = [];
//                         let i = 0;
//                         while (true) {
//                             const subKey = i === 0 ? "SUBTITLE" : `SUBTITLE${i}`;
//                             const timeKey = i === 0 ? "TIME" : `TIME${i}`;
//                             if (!row[subKey] && !row[timeKey]) break;
                            
//                             // Only add if we have at least one value
//                             if (row[subKey] || row[timeKey]) {
//                                 subtimes.push({
//                                     subtitle: row[subKey] || "",
//                                     time: row[timeKey] || "",
//                                 });
//                             }
//                             i++;
//                         }

//                         return {
//                             id: row.ID || index.toString(),
//                             date: row.DATE,
//                             eventDate,
//                             title: row.TITLE,
//                             details: row.DETAILS?.replace(/pull stops\./gi, "\npull stops."),
//                             img: row.IMG,
//                             subtimes,
//                         };
//                     })
//                     .filter((event) => event.eventDate >= today)
//                     .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

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

// // ----------------- MAIN COMPONENT -----------------
// export default function Puja() {
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedEvent, setSelectedEvent] = useState(null);
//     const [showDetailPage, setShowDetailPage] = useState(false);
//     const colors = ["#84119d", "#ec7e1d", "#f10a11", "#0d89bb"];

//     useEffect(() => {
//         fetchPujaEventsPeriodically(setEvents, setLoading, events);

//         const intervalId = setInterval(() => {
//             fetchPujaEventsPeriodically(setEvents, setLoading, events);
//         }, 30000);

//         return () => clearInterval(intervalId);
//     }, [events]);

//     const handleViewMore = useCallback((event) => {
//         setSelectedEvent(event);
//         setShowDetailPage(true);
//     }, []);

//     const groupedEvents = events.reduce((acc, event) => {
//         if (!acc[event.date]) acc[event.date] = [];
//         acc[event.date].push(event);
//         return acc;
//     }, {});

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
//             <ViewMoreDetailPuja
//                 title={selectedEvent.title}
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
//         <ScrollView style={styles.container}>
//             {Object.keys(groupedEvents).map((date) => (
//                 <View key={date}>
//                     <Text style={styles.dateHeader}>{date}</Text>
//                     <FlatList
//                         horizontal
//                         data={groupedEvents[date]}
//                         keyExtractor={(item) => item.id}
//                         renderItem={({ item, index }) => {
//                             const cardColor = colors[index % colors.length];
//                             return (
//                                 <EventTile
//                                     event={item}
//                                     cardColor={cardColor}
//                                     onPress={() => handleViewMore(item)}
//                                 />
//                             );
//                         }}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={{
//                             paddingLeft: 10,
//                             paddingRight: 10,
//                             paddingBottom: 15,
//                         }}
//                     />
//                 </View>
//             ))}
//         </ScrollView>
//     );
// }

// // ----------------- STYLES -----------------
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff4e6",
//         paddingTop: 10,
//     },
//     dateHeader: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#4a4a4a",
//         paddingHorizontal: 10,
//         marginBottom: 6,
//         marginTop: 10,
//     },
//     card: {
//         // width: SCREEN_WIDTH * 0.8, // Fixed width for consistent layout
//         borderRadius: 8,
//         backgroundColor: "transparent",
//         marginRight: 10,
//         marginBottom: 5,
//         // elevation: 4,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//     },
//     dateBox: {
//         paddingVertical: 6,
//         alignItems: "center",
//         borderTopLeftRadius: 8,
//         borderTopRightRadius: 8,
//         paddingHorizontal: 5,
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
//         // minHeight: 100, // Minimum height
//     },
//     title: {
//         fontSize: 16,
//         fontWeight: "bold",
//         marginBottom: 8,
//         textAlign: "center",
//     },
//     subtimeContainer: {
//         marginBottom: 8,
//     },
//     subtimeLine: {
//         fontSize: 13,
//         lineHeight: 20,
//         marginBottom: 4,
//     },
//     subtitle: {
//         color: "crimson",
//         fontWeight: "bold",
//     },
//     timeText: {
//         color: "gray",
//         fontWeight: "500",
//     },
//     viewMoreButton: {
//         backgroundColor: "#4a7c59",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 4,
//         alignSelf: "center",
//         marginTop: 8,
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
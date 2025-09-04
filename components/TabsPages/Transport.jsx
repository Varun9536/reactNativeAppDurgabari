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
import ViewMoreDetailTransport from "../ViewMore/ViewMoreDetailTransport";
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

const fetchTransportEventsPeriodically = async (setEvents, setLoading, currentEvents) => {
    try {
        const response = await fetch(CsvLinks.transport);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const parsedEvents = result.data.map((row, index) => ({
                    id: row.ID || index.toString(),
                    date: row.DATE,
                    time: row.TIME,
                    title: row.TITLE,
                    subtitle: row.SUBTITLE,
                    details: row.DETAILS?.replace(/pull stops\./gi, '\npull stops.'),
                    img: row.IMG,
                }));

                // Update only if data changed
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

export default function Transport() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailPage, setShowDetailPage] = useState(false);

    const colors = ["#84119dff", "#ec7e1dff", "#f10a11ff", "#0d89bbff"];

    useEffect(() => {
        // Fetch initially and every 30 seconds
        fetchTransportEventsPeriodically(setEvents, setLoading, events);

        const intervalId = setInterval(() => {
            fetchTransportEventsPeriodically(setEvents, setLoading, events);
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
            <ViewMoreDetailTransport
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

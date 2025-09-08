// components/OngoingEventsCarousel.js

import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Papa from "papaparse";
import CsvLinks from "../Csv/CsvLinks";

const { width } = Dimensions.get("window");

const OngoingEventsCarousel = () => {
  const carouselRef = useRef(null);
  const [eventData, setEventData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Clean date string safely
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const clean = dateStr.replace(/\r|\n/g, "").trim(); // remove hidden chars
    const parts = clean.split("-");
    if (parts.length !== 3) return null;

    const dd = parts[0].padStart(2, "0");
    const mm = parts[1].padStart(2, "0");
    const yyyy = parts[2];
    return `${dd}-${mm}-${yyyy}`;
  };

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await fetch(CsvLinks.puja);
      const csvText = await response.text();

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      // ✅ today in dd-mm-yyyy
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      const todayStr = `${dd}-${mm}-${yyyy}`;

    
      const cleaned = parsed.data
        .map((row, idx) => {
          const eventName = row.TITLE?.trim();
          const time = row.TIME?.trim();
          const DATE = normalizeDate(row.DATE);

        

          if (eventName && DATE === todayStr) {
            return time
              ? `${eventName} ${time}`
              : `${eventName} `;
          }
          return null;
        })
        .filter((item) => item !== null);

      setEventData(cleaned);
      setError(null);
    } catch (err) {
      console.error("CSV fetch/parse error:", err);
      setError("Unable to fetch events, try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
    const poll = setInterval(fetchEventData, 20000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    if (!eventData.length) return;
    const scrollIntv = setInterval(() => {
      const next = (activeIndex + 1) % eventData.length;
      setActiveIndex(next);
      carouselRef.current?.scrollToIndex({ index: next, animated: true });
    }, 3000);
    return () => clearInterval(scrollIntv);
  }, [activeIndex, eventData]);

  const shouldShowContent = !loading && !error && eventData.length > 0;

  return (
    <View style={styles.container}>
      {shouldShowContent && <Text style={styles.heading}>Ongoing Events</Text>}

      {loading ? (
        <ActivityIndicator size="small" color="#ffcc00" />
      ) : 
      error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : shouldShowContent ? (
        <FlatList
          ref={carouselRef}
          data={eventData}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={styles.eventText}>{item}</Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noEventText}>No events today</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignItems: "center",
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  slide: {
    width: width,
    alignItems: "center",
  },
  eventText: {
    fontSize: 16,
    color: "#fff",
    fontStyle: "italic",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 8,
    paddingHorizontal: 25,
    borderRadius: 14,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
  },
  noEventText: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
  },
});

export default OngoingEventsCarousel;

// // components/OngoingEventsCarousel.js

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Text,
//   View,
//   Dimensions,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const { width } = Dimensions.get("window");

// const OngoingEventsCarousel = () => {
//   const carouselRef = useRef(null);
//   const [eventData, setEventData] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Clean date string, but keep MM-DD-YYYY format
//   const normalizeDate = (dateStr) => {
//     if (!dateStr) return null;
//     return dateStr.replace(/\r|\n/g, "").trim(); // No format flipping
//   };

//   const fetchEventData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(CsvLinks.puja);
//       const csvText = await response.text();

//       const parsed = Papa.parse(csvText, {
//         header: true,
//         skipEmptyLines: true,
//       });

//       // ✅ Get today's date in MM-DD-YYYY
//       const today = new Date();
//       const mm = String(today.getMonth() + 1).padStart(2, "0");
//       const dd = String(today.getDate()).padStart(2, "0");
//       const yyyy = today.getFullYear();
//       const todayStr = `${mm}-${dd}-${yyyy}`;

//       const cleaned = parsed.data
//         .map((row, idx) => {
//           const eventName = row.TITLE?.trim();
//           const time = row.TIME?.trim();
//           const DATE = normalizeDate(row.DATE);

//           // if (eventName && DATE === todayStr) {
//           //   return time ? `${eventName} ${time}` : `${eventName}`;
//           // }

//           if (eventName && DATE === todayStr && time) {
//             const [startStr, endStr] = time.split("-").map((t) => t.trim());

//             const parseTime = (t) => {
//               const [hourMinute, modifier] = t.split(" ");
//               let [hours, minutes] = hourMinute.split(":").map(Number);
//               if (modifier === "PM" && hours !== 12) hours += 12;
//               if (modifier === "AM" && hours === 12) hours = 0;

//               const dateObj = new Date();
//               dateObj.setHours(hours);
//               dateObj.setMinutes(minutes);
//               dateObj.setSeconds(0);
//               return dateObj;
//             };

//             const now = new Date();
//             const startTime = parseTime(startStr);
//             const endTime = parseTime(endStr);

//             if (now >= startTime && now <= endTime) {
//               return `${eventName} ${time}`;
//             }
//           }






//           return null;
//         })
//         .filter((item) => item !== null);

//       setEventData(cleaned);
//       setError(null);
//     } catch (err) {
//       console.error("CSV fetch/parse error:", err);
//       setError("Unable to fetch events, try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEventData();
//     const poll = setInterval(fetchEventData, 20000);
//     return () => clearInterval(poll);
//   }, []);

//   useEffect(() => {
//     if (!eventData.length) return;
//     const scrollIntv = setInterval(() => {
//       const next = (activeIndex + 1) % eventData.length;
//       setActiveIndex(next);
//       carouselRef.current?.scrollToIndex({ index: next, animated: true });
//     }, 3000);
//     return () => clearInterval(scrollIntv);
//   }, [activeIndex, eventData]);

//   const shouldShowContent = !loading && !error && eventData.length > 0;

//   return (
//     <View style={styles.container}>
//       {shouldShowContent && <Text style={styles.heading}>Ongoing Events</Text>}

//       {loading ? (
//         <ActivityIndicator size="small" color="#ffcc00" />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : shouldShowContent ? (
//         <FlatList
//           ref={carouselRef}
//           data={eventData}
//           horizontal
//           pagingEnabled
//           scrollEnabled={false}
//           keyExtractor={(_, idx) => idx.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.slide}>
//               <Text style={styles.eventText}>{item}</Text>
//             </View>
//           )}
//           showsHorizontalScrollIndicator={false}
//         />
//       ) : (
//         <Text style={styles.noEventText}>No events today</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: "95%",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//     marginBottom: 6,
//     textShadowColor: "rgba(0,0,0,0.3)",
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 2,
//   },
//   slide: {
//     width: width,
//     alignItems: "center",
//   },
//   eventText: {
//     fontSize: 16,
//     color: "#fff",
//     fontStyle: "italic",
//     backgroundColor: "rgba(255,255,255,0.15)",
//     paddingVertical: 8,
//     paddingHorizontal: 25,
//     borderRadius: 14,
//     textAlign: "center",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     textAlign: "center",
//     marginVertical: 10,
//   },
//   noEventText: {
//     color: "#ccc",
//     fontSize: 14,
//     textAlign: "center",
//     marginVertical: 10,
//     fontStyle: "italic",
//   },
// });

// export default OngoingEventsCarousel;




// components/OngoingEventsCarousel.js

// import React, { useEffect, useRef, useState } from "react";
// import {
//   FlatList,
//   Text,
//   View,
//   Dimensions,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import Papa from "papaparse";
// import CsvLinks from "../Csv/CsvLinks";

// const { width } = Dimensions.get("window");

// const OngoingEventsCarousel = () => {
//   const carouselRef = useRef(null);
//   const [eventData, setEventData] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [eventLabel, setEventLabel] = useState("Events Currently in Progress");

//   const normalizeDate = (dateStr) => {
//     if (!dateStr) return null;
//     return dateStr.replace(/\r|\n/g, "").trim();
//   };

//   const fetchEventData = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(CsvLinks.puja);
//       const csvText = await response.text();

//       const parsed = Papa.parse(csvText, {
//         header: true,
//         skipEmptyLines: true,
//       });

//       const today = new Date();
//       const mm = String(today.getMonth() + 1).padStart(2, "0");
//       const dd = String(today.getDate()).padStart(2, "0");
//       const yyyy = today.getFullYear();
//       const todayStr = `${mm}-${dd}-${yyyy}`;

//       const now = new Date();
//       const ongoing = [];
//       const upcoming = [];

    



//       parsed.data.forEach((row) => {
//         const DATE = normalizeDate(row.DATE);

//         if (DATE !== todayStr) return;

//         // Loop through all possible subtitles and times
//         Object.keys(row).forEach((key) => {
//           if (key.startsWith("SUBTITLE")) {
//             const index = key.replace("SUBTITLE", ""); // get 1,2,3...
//             const eventName = row[`SUBTITLE${index}`]?.trim();
//             const time = row[`TIME${index}`]?.trim();
//             if (!eventName || !time) return;

//             const [startStr, endStr] = time.split("-").map((t) => t.trim());

//             const parseTime = (t) => {
//               const [hourMinute, modifier] = t.split(" ");
//               let [hours, minutes] = hourMinute.split(":").map(Number);
//               if (modifier === "PM" && hours !== 12) hours += 12;
//               if (modifier === "AM" && hours === 12) hours = 0;

//               const dateObj = new Date();
//               dateObj.setHours(hours);
//               dateObj.setMinutes(minutes);
//               dateObj.setSeconds(0);
//               return dateObj;
//             };

//             const startTime = parseTime(startStr);
//             const endTime = parseTime(endStr);

//             if (now >= startTime && now <= endTime) {
//               ongoing.push(`${eventName} ${time}`);
//             } else if (now < startTime) {
//               upcoming.push(`${eventName} ${time}`);
//             }
//           }
//         });
//       });


//       if (ongoing.length > 0) {
//         setEventData(ongoing);
//         setEventLabel("Events Currently in Progress");
//       } else if (upcoming.length > 0) {
//         setEventData(upcoming);
//         setEventLabel("Today's Upcoming Events");
//       }


//       else {
//         setEventData([]);
//       }

//       setError(null);
//     } catch (err) {
//       console.error("CSV fetch/parse error:", err);
//       setError("Unable to fetch events, try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEventData();
//     const poll = setInterval(fetchEventData, 20000);
//     return () => clearInterval(poll);
//   }, []);

//   useEffect(() => {
//     if (!eventData.length) return;
//     const scrollIntv = setInterval(() => {
//       const next = (activeIndex + 1) % eventData.length;
//       setActiveIndex(next);
//       carouselRef.current?.scrollToIndex({ index: next, animated: true });
//     }, 3000);
//     return () => clearInterval(scrollIntv);
//   }, [activeIndex, eventData]);

//   const shouldShowContent = !loading && !error && eventData.length > 0;

//   return (
//     <View style={styles.container}>
//       {shouldShowContent && <Text style={styles.heading}>{eventLabel}</Text>}

//       {loading ? (
//         <ActivityIndicator size="small" color="#ffcc00" />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : shouldShowContent ? (
//         <FlatList
//           ref={carouselRef}
//           data={eventData}
//           horizontal
//           pagingEnabled
//           scrollEnabled={false}
//           keyExtractor={(_, idx) => idx.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.slide}>
//               <Text style={styles.eventText}>{item}</Text>
//             </View>
//           )}
//           showsHorizontalScrollIndicator={false}
//         />
//       ) : (
//         <Text style={styles.noEventText}>No events today</Text>
//       )}
//     </View>
//   );
// };







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

export default function OngoingEventsCarousel() {
  const carouselRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [eventData, setEventData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventLabel, setEventLabel] = useState("Events Currently in Progress");

  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr.replace(/\r|\n/g, "").trim();
  };

  // Convert date string in format MM-DD-YYYY or DD-MM-YYYY or YYYY-MM-DD to Date object
  // You may adjust this according to your CSV format
  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // Try MM-DD-YYYY
    const parts1 = dateStr.split("-");
    if (parts1.length === 3) {
      // Check if first part is month or year
      if (parts1[0].length === 4) {
        // YYYY-MM-DD
        return new Date(`${parts1[0]}-${parts1[1]}-${parts1[2]}T00:00:00`);
      } else {
        // MM-DD-YYYY
        return new Date(`${parts1[2]}-${parts1[0]}-${parts1[1]}T00:00:00`);
      }
    }
    return null;
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

      if (!parsed.data || parsed.data.length === 0) {
        setError("No event data available");
        setEventData([]);
        setLoading(false);
        return;
      }

      const today = new Date();
      const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const now = new Date();

      const ongoing = [];
      const upcoming = [];

      parsed.data.forEach((row) => {
        const DATE = normalizeDate(row.DATE);
        const eventDate = parseDate(DATE);

        if (!eventDate) return;

        // Only process rows where eventDate is today
        if (
          eventDate.getFullYear() !== todayMidnight.getFullYear() ||
          eventDate.getMonth() !== todayMidnight.getMonth() ||
          eventDate.getDate() !== todayMidnight.getDate()
        ) {
          return;
        }

        // Loop through all subtitles and times
        Object.keys(row).forEach((key) => {
          if (key.startsWith("SUBTITLE")) {
            const index = key.replace("SUBTITLE", "");
            const eventName = row[`SUBTITLE${index}`]?.trim();
            const time = row[`TIME${index}`]?.trim();
            if (!eventName || !time) return;

            const [startStr, endStr] = time.split("-").map((t) => t.trim());

            const parseTime = (t) => {
              if (!t) return null;
              const [hourMinute, modifier] = t.split(" ");
              if (!hourMinute || !modifier) return null;
              let [hours, minutes] = hourMinute.split(":").map(Number);
              if (isNaN(hours) || isNaN(minutes)) return null;
              if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
              if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

              const dateObj = new Date(
                eventDate.getFullYear(),
                eventDate.getMonth(),
                eventDate.getDate(),
                hours,
                minutes,
                0
              );
              return dateObj;
            };

            const startTime = parseTime(startStr);
            const endTime = parseTime(endStr);

            if (!startTime || !endTime) return;

            if (now >= startTime && now <= endTime) {
              ongoing.push(`${eventName} (${time})`);
            } else if (now < startTime) {
              upcoming.push(`${eventName} (${time})`);
            }
          }
        });
      });

      if (ongoing.length > 0) {
        setEventData(ongoing);
        setEventLabel("Events Currently in Progress");
      } else if (upcoming.length > 0) {
        setEventData(upcoming);
        setEventLabel("Today's Upcoming Events");
      } else {
        setEventData([]);
        setEventLabel("No events today");
      }

      setError(null);
    } catch (err) {
      console.error("CSV fetch/parse error:", err);
      setError("Unable to fetch events, try again later.");
      setEventData([]);
      setEventLabel("No events today");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
    const poll = setInterval(fetchEventData, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    if (!eventData.length) return;

    activeIndexRef.current = 0;
    setActiveIndex(0);

    const scrollInterval = setInterval(() => {
      let nextIndex = (activeIndexRef.current + 1) % eventData.length;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);

      if (carouselRef.current && eventData.length > 0) {
        try {
          carouselRef.current.scrollToIndex({ index: nextIndex, animated: true });
        } catch (error) {
          // Defensive catch for scroll failures
          console.warn("scrollToIndex failed:", error);
        }
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [eventData]);

  const shouldShowContent = !loading && !error && eventData.length > 0;

  return (
    <View style={styles.container}>
      {eventLabel && <Text style={styles.heading}>{eventLabel}</Text>}

      {loading ? (
        <ActivityIndicator size="small" color="#ffcc00" />
      ) : error ? (
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
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={2}
        />
      ) : (
        <Text style={styles.noEventText}>No events today</Text>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width: "100%",
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


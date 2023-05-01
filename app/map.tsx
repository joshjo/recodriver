import { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import * as Location from 'expo-location';

import { TOKEN_KEY } from "@constants";
import { useAuth } from "@context/auth";


const TWO_SECONDS = 2000;

export default function Details() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [message, setMessage] = useState("");
  const [isRunning, setIsRunning] = useState(true);
  const interval = useRef(null);
  const ws = useRef(null);
  const { signOut } = useAuth();

  useEffect(() => {
    const districtId = "7f5fa428-54e5-4f66-a1c8-0fe99010f7f7";
    const journeyId = "302ac07b-8a99-4e94-95e6-dfa64e0fbcf0";

    ws.current = new WebSocket(`ws://localhost:8956/ws/live/${districtId}/?journey_id=${journeyId}`, null, {
      headers: {
        Authorization: "Bearer 83db38f149026ad03b5b50d729590495c55cf6ff",
      },
    });

    ws.current.onopen = () => {
      console.log('WebSocket is open');
    };

    ws.current.onmessage = (e) => {
      // console.log('Received message: ', e.data);
    };

    ws.current.onerror = (e) => {
      console.log('WebSocket error: ', e.message);
    };

    ws.current.onclose = (e) => {
      console.log('WebSocket closed: ', e.code, e.reason);
    };
    startInterval();

    async function setupLocation () {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn("Permission to access location was denied");
        // setErrorMsg('Permission to access location was denied');
        return;
      }
    }

    setupLocation();

    return () => {
      ws.current.close();
      clearInterval(interval.current);
    };

  }, []);

  function startInterval() {
    if (ws.current) {
      clearInterval(interval.current);
    }
    interval.current = setInterval(async () => {
      let currentLocation = await Location.getCurrentPositionAsync({});
      // setLocation(location);
      // console.log("every 2 seconds", location);
      const { coords: { longitude, latitude } } = currentLocation;
      const cRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.02,
      };
      setRegion(cRegion);
      if (mapRef.current) {
        mapRef.current.animateToRegion(cRegion);
      }
      ws.current.send(JSON.stringify({
        type: "update_location",
        data: currentLocation,
      }));
    }, TWO_SECONDS);
  }

  function stopInterval() {
    clearInterval(interval.current);
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map}>
        <Marker coordinate={region} />
      </MapView>
      <View style={styles.float}>
        <Text>Hola</Text>
        <Button title="Start" onPress={startInterval} />
        <Button title="Stop" onPress={stopInterval} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  float: {
    position: 'absolute',
    height: 300,
    bottom: 50,
  }
});

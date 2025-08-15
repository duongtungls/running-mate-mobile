import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LeafletView, MapShapeType } from 'react-native-leaflet-view';
import { MapPin, X, Maximize2 } from 'lucide-react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

interface SimpleMapViewProps {
  startLatLng?: number[];
  endLatLng?: number[];
  polyline?: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const MAP_HEIGHT = 250;

// Polyline decoder for Leaflet format
const decodePolyline = (encoded: string): [number, number][] => {
  if (!encoded) return [];

  let index = 0,
    lat = 0,
    lng = 0;
  const coordinates: [number, number][] = [];

  while (index < encoded.length) {
    // Decode latitude
    let byte = 0,
      shift = 0,
      result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    // Decode longitude
    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    // Leaflet expects [lat, lng] format
    coordinates.push([lat / 100000, lng / 100000]);
  }

  return coordinates;
};

export default function SimpleMapView({
  startLatLng,
  endLatLng,
  polyline,
}: SimpleMapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadHtml = async () => {
      try {
        const path = require('../assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await FileSystem.readAsStringAsync(asset.localUri!);

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        Alert.alert('Error loading HTML', JSON.stringify(error));
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapData = useMemo(() => {
    if (!startLatLng || startLatLng.length < 2) return null;

    // Decode route coordinates
    const routeCoords = polyline ? decodePolyline(polyline) : [];

    // Calculate bounds
    const allCoords = [startLatLng];
    if (endLatLng && endLatLng.length >= 2) {
      allCoords.push(endLatLng);
    }
    allCoords.push(...routeCoords);

    const latitudes = allCoords.map((coord) => coord[0]);
    const longitudes = allCoords.map((coord) => coord[1]);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Create map layers
    const mapLayers = [
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        baseLayerIsChecked: true,
        baseLayerName: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    ];

    // Create markers
    const markers = [
      {
        id: 'start',
        position: { lat: startLatLng[0], lng: startLatLng[1] },
        icon: '🟢',
        size: [12, 12],
      },
    ];

    if (endLatLng && endLatLng.length >= 2) {
      markers.push({
        id: 'end',
        position: { lat: endLatLng[0], lng: endLatLng[1] },
        icon: '🔴',
        size: [12, 12],
      });
    }

    // Create polyline shapes for the route
    let shapes: any[] = [];

    if (routeCoords.length > 0) {
      // Use the actual polyline data
      shapes = [
        {
          shapeType: MapShapeType.POLYLINE,
          color: '#ef4444',
          weight: 4,
          opacity: 0.9,
          id: 'route',
          positions: routeCoords.map(([lat, lng]) => ({ lat, lng })),
        },
      ];
    } else if (endLatLng && endLatLng.length >= 2) {
      // Create a simple line between start and end points if no polyline
      shapes = [
        {
          shapeType: MapShapeType.POLYLINE,
          color: '#3b82f6',
          weight: 3,
          opacity: 0.7,
          id: 'direct-route',
          positions: [
            { lat: startLatLng[0], lng: startLatLng[1] },
            { lat: endLatLng[0], lng: endLatLng[1] },
          ],
          dashArray: '5, 5',
        },
      ];
    }

    return {
      centerPosition: { lat: centerLat, lng: centerLng },
      zoom: routeCoords.length > 0 ? 14 : 15,
      mapLayers,
      markers,
      shapes,
      routeCoords,
    };
  }, [startLatLng, endLatLng, polyline]);

  if (!webViewContent) {
    return <ActivityIndicator size="large" />;
  }

  const renderMap = (isFullscreenMode: boolean) => {
    if (!mapData) return null;

    return (
      <View
        style={isFullscreenMode ? styles.fullscreenContainer : styles.container}
      >
        <LeafletView
          source={{ html: webViewContent }}
          mapCenterPosition={mapData.centerPosition}
          mapMarkers={mapData.markers}
          mapShapes={mapData.shapes}
          onMessageReceived={(message) => {
            try {
              // Message received: message
            } catch (error) {
              console.error('Error handling message:', error);
            }
          }}
        />

        {/* Expand button for normal view */}
        {!isFullscreenMode && (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setIsFullscreen(true)}
          >
            <Maximize2 size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!startLatLng || startLatLng.length < 2) {
    return (
      <View style={styles.placeholder}>
        <MapPin size={48} color="rgba(255, 255, 255, 0.5)" />
        <Text style={styles.placeholderText}>
          No GPS data available for this activity
        </Text>
        <Text style={styles.subtext}>
          Map will show when activity has location data
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Normal map view */}
      {renderMap(false)}

      {/* Fullscreen modal */}
      <Modal
        visible={isFullscreen}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsFullscreen(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header with close button */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Route Map</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFullscreen(false)}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen map */}
          {renderMap(true)}
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: MAP_HEIGHT,
    position: 'relative',
  },
  fullscreenContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  fullscreenMap: {
    flex: 1,
  },
  expandButton: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
  mapInfo: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
  },
  fullscreenMapInfo: {
    top: 60, // Account for modal header
  },
  mapInfoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  placeholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 12,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
});

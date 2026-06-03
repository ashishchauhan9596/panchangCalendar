/**
 * CityPickerModal — City Selector Modal Component
 *
 * Renders a full list of predefined cities with search filtering.
 * Selecting a city updates the settings store and triggers notification rescheduling.
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { useSettingsStore } from '../stores/settingsStore';
import { scheduleWeeklyNotifications } from '../services/notificationService';
import { requestLocationPermission, getCurrentCoordinates, getNearestCity } from '../services/locationService';
import cities from '../constants/cities.json';
import type { CityInfo } from '../engine/types';

interface CityPickerModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CityPickerModal({ visible, onClose }: CityPickerModalProps) {
  const [search, setSearch] = useState('');
  const { city, setCity } = useSettingsStore();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleAutoDetect = async () => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Location Permission Required',
          'Please grant location permissions in your device settings to auto-detect your city.'
        );
        setGpsError('Permission denied.');
        return;
      }

      const coords = await getCurrentCoordinates();
      const nearest = getNearestCity(coords.latitude, coords.longitude);
      
      setCity(nearest);
      await scheduleWeeklyNotifications(nearest);
      
      Alert.alert(
        'Location Detected',
        `Auto-detected: ${nearest.name}, ${nearest.state} (${nearest.country})`
      );
      
      onClose();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || 'Could not auto-detect location.';
      setGpsError(errMsg);
      Alert.alert('Detection Failed', errMsg);
    } finally {
      setGpsLoading(false);
    }
  };

  const filteredCities = useMemo(() => {
    if (!search.trim()) return cities;
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase()) ||
        c.state.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleSelectCity = async (item: CityInfo) => {
    setCity(item);
    // Automatically reschedule notifications for the new city
    try {
      await scheduleWeeklyNotifications(item);
    } catch (err) {
      console.error('Failed to reschedule notifications on city change:', err);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Select Location</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city, state, or country..."
            placeholderTextColor={Colors.text.tertiary}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          <Pressable
            style={[styles.gpsButton, gpsLoading && styles.gpsButtonDisabled]}
            onPress={handleAutoDetect}
            disabled={gpsLoading}
          >
            {gpsLoading ? (
              <ActivityIndicator size="small" color={Colors.accent.saffron} />
            ) : (
              <Text style={styles.gpsButtonText}>📡 Auto-Detect Location (GPS)</Text>
            )}
          </Pressable>
          {gpsError && <Text style={styles.gpsErrorText}>⚠️ {gpsError}</Text>}
        </View>

        {/* City List */}
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => `${item.name}-${item.lat}-${item.lng}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isSelected = item.name === city.name && item.lat === city.lat;
            return (
              <Pressable
                style={[styles.cityItem, isSelected && styles.cityItemActive]}
                onPress={() => handleSelectCity(item)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.cityName}>
                    📍 {item.name}, {item.state}
                  </Text>
                  <Text style={styles.cityCountry}>{item.country}</Text>
                </View>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations found matching your search.</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.deepIndigo,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.glass.borderLight,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  closeButtonText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text.primary,
    fontSize: Typography.size.md,
  },
  gpsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gpsButtonDisabled: {
    opacity: 0.6,
  },
  gpsButtonText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
  },
  gpsErrorText: {
    color: '#ef4444',
    fontSize: Typography.size.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityItemActive: {
    borderBottomColor: Colors.accent.saffron,
  },
  cityName: {
    color: Colors.text.primary,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.semiBold,
  },
  cityCountry: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    marginTop: 2,
  },
  checkIcon: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
  },
  emptyContainer: {
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.md,
  },
});

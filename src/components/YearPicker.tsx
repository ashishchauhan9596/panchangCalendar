/**
 * YearPicker — Year Jump Navigation
 *
 * A modal-style year picker that lets users jump to any year
 * for the "infinite time machine" feature.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

interface YearPickerProps {
  visible: boolean;
  currentYear: number;
  onSelectYear: (year: number) => void;
  onClose: () => void;
}

export function YearPicker({
  visible,
  currentYear,
  onSelectYear,
  onClose,
}: YearPickerProps) {
  const [inputYear, setInputYear] = useState(currentYear.toString());
  const thisYear = new Date().getFullYear();

  // Quick jump buttons
  const quickYears = [
    thisYear - 50,
    thisYear - 10,
    thisYear - 1,
    thisYear,
    thisYear + 1,
    thisYear + 10,
    thisYear + 50,
  ];

  const handleGo = () => {
    const year = parseInt(inputYear, 10);
    if (!isNaN(year) && year >= 1 && year <= 9999) {
      onSelectYear(year);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Jump to Year</Text>
          <Text style={styles.subtitle}>
            Navigate to any year — past or future
          </Text>

          {/* Year Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={inputYear}
              onChangeText={setInputYear}
              keyboardType="number-pad"
              maxLength={4}
              selectTextOnFocus
              placeholderTextColor={Colors.text.tertiary}
              placeholder="Year"
            />
            <Pressable style={styles.goButton} onPress={handleGo}>
              <Text style={styles.goText}>Go</Text>
            </Pressable>
          </View>

          {/* Quick Jump Buttons */}
          <Text style={styles.quickLabel}>Quick Jump</Text>
          <View style={styles.quickGrid}>
            {quickYears.map((y) => (
              <Pressable
                key={y}
                style={[
                  styles.quickButton,
                  y === currentYear && styles.quickButtonActive,
                ]}
                onPress={() => {
                  onSelectYear(y);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.quickText,
                    y === currentYear && styles.quickTextActive,
                  ]}
                >
                  {y}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Cancel */}
          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
    width: '85%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    ...Shadows.lg,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size['2xl'],
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.sm,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    color: Colors.text.primary,
    fontSize: Typography.size['3xl'],
    fontWeight: Typography.weight.bold,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  goButton: {
    backgroundColor: Colors.accent.saffron,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goText: {
    color: '#fff',
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
  },
  quickLabel: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  quickButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  quickButtonActive: {
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    borderColor: Colors.accent.saffron,
  },
  quickText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.medium,
  },
  quickTextActive: {
    color: Colors.accent.saffron,
    fontWeight: Typography.weight.bold,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  cancelText: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.md,
  },
});

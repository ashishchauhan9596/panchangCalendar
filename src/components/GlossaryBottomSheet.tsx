import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useTranslation, TranslationKey } from '../i18n';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface GlossaryBottomSheetProps {
  visible: boolean;
  termKey: string | null;
  currentValue?: string;
  onClose: () => void;
}

export function GlossaryBottomSheet({
  visible,
  termKey,
  currentValue,
  onClose,
}: GlossaryBottomSheetProps) {
  const { t } = useTranslation();

  if (!termKey) return null;

  // We construct the translation keys dynamically
  const titleKey = `glossary.${termKey}.title` as TranslationKey;
  const descKey = `glossary.${termKey}.desc` as TranslationKey;

  const title = t(titleKey);
  const desc = t(descKey);

  // If the translation returns the exact key string, it means it's missing or invalid term
  if (title === titleKey) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Tap area outside bottom sheet to close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sliding Panel */}
        <View style={styles.sheet}>
          {/* Drag indicator bar */}
          <View style={styles.dragIndicator} />

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.title}>{title}</Text>

            {/* Current Value Display */}
            {currentValue && (
              <View style={styles.valueContainer}>
                <Text style={styles.valueLabel}>Current Value today:</Text>
                <Text style={styles.valueText}>{currentValue}</Text>
              </View>
            )}

            {/* Meaning Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>📖 Meaning</Text>
              <Text style={styles.bodyText}>{desc}</Text>
            </View>

            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Got it</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(10, 8, 20, 0.65)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: '#102030',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: SCREEN_HEIGHT * 0.75,
    ...Shadows.lg,
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingBottom: Spacing.lg,
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    marginBottom: Spacing.md,
  },
  valueContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.glass.borderLight,
  },
  valueLabel: {
    color: Colors.text.tertiary,
    fontSize: Typography.size.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueText: {
    color: Colors.accent.saffron,
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    color: Colors.text.primary,
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.bold,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    color: Colors.text.secondary,
    fontSize: Typography.size.md,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: Colors.accent.saffron,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
    minHeight: 44, // Accessibility
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.bold,
  },
});

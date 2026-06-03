/**
 * ErrorBoundary — Catches React render errors and displays the actual error
 * message instead of the generic Expo Go "Something went wrong" screen.
 */

import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🐛 App Crash Detected</Text>
          <Text style={styles.subtitle}>Error details:</Text>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.errorText}>
              {this.state.error?.message || 'Unknown error'}
            </Text>
            <Text style={styles.stackText}>
              {this.state.error?.stack || 'No stack trace'}
            </Text>
          </ScrollView>
          <Pressable
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#ff6b6b',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#ffd93d',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  stackText: {
    color: '#aaa',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#ff8e3c',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

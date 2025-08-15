import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#22c55e', '#0d9488', '#0891b2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

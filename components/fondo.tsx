import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Declara el tipo de props
interface FondoProps {
  children?: ReactNode;
}

const Fondo: React.FC<FondoProps> = ({ children }) => (
  <View style={styles.container}>
    <LinearGradient
      colors={['#5B86E5', '#36D1C4', '#f9d423']}
      start={{ x: 0.2, y: 0.1 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />

    <View style={[styles.circle, styles.circle1]} />
    <View style={[styles.circle, styles.circle2]} />
    <View style={[styles.circle, styles.circle3]} />

    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.13,
  },
  circle1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#ffb347',
    top: -width * 0.3,
    left: -width * 0.2,
  },
  circle2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#6a82fb',
    top: height * 0.15,
    right: -width * 0.2,
  },
  circle3: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: '#ff5f6d',
    bottom: -width * 0.3,
    left: width * 0.1,
  },
});

export default Fondo;

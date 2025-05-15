import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface BotonUsuarioProps {
  titulo: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?:boolean;
}

export default function Boton({ titulo, onPress,disabled=false }: BotonUsuarioProps) {
  return (
    <TouchableOpacity style={[styles.boton, disabled && styles.disabled]} onPress={onPress} disabled={disabled}>
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: '#23cebe',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 20,
    width: 200,
  },
  texto: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
  },
  disabled:{
    opacity:0.6,
  },
});
// components/AlertModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  message: string;
  onClose: () => void;
};

const AlertModal = ({ visible, message, onClose }: Props) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.background}>
      <View style={styles.modal}>
        <Text style={styles.text}>{message}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    minWidth: 240,
    alignItems: 'center',
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.17,
    shadowRadius: 12,
  },
  text: {
    fontSize: 16,
    color: '#d84f5f',
    marginBottom: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2edbd1',
    paddingVertical: 10,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AlertModal;

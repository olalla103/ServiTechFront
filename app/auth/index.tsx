// /app/auth/index.tsx
import { Text, View } from 'react-native';

export default function AuthIndex() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Página de autenticación. Elige login o registro.</Text>
    </View>
  );
}

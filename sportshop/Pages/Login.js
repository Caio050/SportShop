import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    navigation.navigate('Products');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 20 }}>
      <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
        Bem-vindo de volta
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={{ backgroundColor: '#222', color: 'white', padding: 10, marginBottom: 10, borderRadius: 5 }}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ backgroundColor: '#222', color: 'white', padding: 10, marginBottom: 20, borderRadius: 5 }}
      />

      <Button title="Login" onPress={handleSubmit} color="#FF0000" />

      <Text
        style={{ color: 'white', marginTop: 20, textAlign: 'center' }}
        onPress={() => navigation.navigate('Signup')}
      >
        Não tem conta? Cadastre-se
      </Text>
    </View>
  );
}
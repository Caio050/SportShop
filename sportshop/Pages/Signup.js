import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    navigation.navigate('Products');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 20 }}>
      <Text style={{ color: 'white', fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
        Criar Conta
      </Text>

      <TextInput
        placeholder="Nome completo"
        placeholderTextColor="#999"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        style={inputStyle}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={inputStyle}
      />

      <TextInput
        placeholder="Cep"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        style={inputStyle}
      />

      <TextInput
        placeholder="Endereço"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
        style={inputStyle}
      />
          
         <TextInput
        placeholder="Numero da Casa"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
        style={inputStyle}
      />
     <TextInput
      placeholder="Data de nascimento (DD/MM/AAAA)"
      placeholderTextColor="#999"
      keyboardType="numeric"
      value={formData.birthDate}
      onChangeText={(text) =>
      setFormData({ ...formData, birthDate: text })
  }
           style={inputStyle}
      />
       <TextInput
        placeholder="senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
        style={inputStyle}
      />
       <TextInput
        placeholder="Confirmar senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(text) =>
          setFormData({ ...formData, confirmPassword: text })
        }
        style={inputStyle}
      />






<Button title="Cadastrar" onPress={handleSubmit} color="#FF0000"/>

      <Text
        style={{ color: 'white', marginTop: 20, textAlign: 'center' }}
        onPress={() => navigation.navigate('Login')}
      >
        Já tem conta? Login
      </Text>
    </View>
  );
}

const inputStyle = {
  backgroundColor: '#222',
  color: 'white',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
};
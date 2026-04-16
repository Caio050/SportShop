import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View } from 'react-native';

import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Products from './Pages/Products';
import DetalheProduto from './Pages/DetalheProduto';
import Carrinho from './Pages/Carrinho';

import AdminMenu from './PagesADM/AdminMenu';
import AdminListaProdutos from './PagesADM/AdminListaProdutos';
import AdminCriarProduto from './PagesADM/AdminCriarProduto';
import AdminEditarProduto from './PagesADM/AdminEditarProduto';
import AdminListaPedidos from './PagesADM/AdminListaPedidos';
import AdminDetalhePedido from './PagesADM/AdminDetalhePedido';

import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();

function CartIcon({ navigation }) {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Carrinho')} style={{ marginRight: 8 }}>
      <Text style={{ fontSize: 22 }}>🛒{total > 0 ? ' ' + total : ''}</Text>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a1a' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Products"
            component={Products}
            options={({ navigation }) => ({
              title: '⚡ SportShop',
              headerRight: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <CartIcon navigation={navigation} />
                  <TouchableOpacity onPress={() => navigation.navigate('AdminMenu')}>
                    <Text style={{ color: '#FF4500', fontWeight: 'bold', fontSize: 13 }}>ADM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#fff', fontSize: 13 }}>Login</Text>
                  </TouchableOpacity>
                </View>
              ),
            })}
          />

          <Stack.Screen
            name="DetalheProduto"
            component={DetalheProduto}
            options={{ title: 'Detalhes do Produto' }}
          />

          <Stack.Screen name="Login" component={Login} options={{ title: 'Entrar' }} />
          <Stack.Screen name="Signup" component={Signup} options={{ title: 'Criar Conta' }} />

          <Stack.Screen
            name="Carrinho"
            component={Carrinho}
            options={{ title: '🛒 Meu Carrinho' }}
          />

          <Stack.Screen
            name="AdminMenu"
            component={AdminMenu}
            options={{ title: '⚙️ Painel Admin' }}
          />
          <Stack.Screen
            name="AdminListaProdutos"
            component={AdminListaProdutos}
            options={{ title: 'Gerenciar Produtos' }}
          />
          <Stack.Screen
            name="AdminCriarProduto"
            component={AdminCriarProduto}
            options={{ title: 'Novo Produto' }}
          />
          <Stack.Screen
            name="AdminEditarProduto"
            component={AdminEditarProduto}
            options={{ title: 'Editar Produto' }}
          />
          <Stack.Screen
            name="AdminListaPedidos"
            component={AdminListaPedidos}
            options={{ title: 'Pedidos' }}
          />
          <Stack.Screen
            name="AdminDetalhePedido"
            component={AdminDetalhePedido}
            options={{ title: 'Detalhe do Pedido' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

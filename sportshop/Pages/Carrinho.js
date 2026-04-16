import { useContext } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Image, Alert
} from 'react-native';
import { CartContext } from '../CartContext';
import { criarPedido } from '../database';

export default function Carrinho({ navigation }) {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useContext(CartContext);

  async function handleFinalizar() {
    if (cart.length === 0) return;
    Alert.alert(
      'Finalizar pedido',
      `Total: R$ ${getTotal().toFixed(2).replace('.', ',')}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar', onPress: async () => {
            try {
              await criarPedido('Cliente', getTotal(), cart);
              clearCart();
              Alert.alert('✅ Pedido realizado!', 'Seu pedido foi registrado com sucesso.', [
                { text: 'OK', onPress: () => navigation.navigate('Products') }
              ]);
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível finalizar o pedido.');
            }
          }
        }
      ]
    );
  }

  const formatPrice = (preco, price) => {
    if (preco) return 'R$ ' + Number(preco).toFixed(2).replace('.', ',');
    return price || 'R$ 0,00';
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.btnVoltarText}>Ver produtos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.itemImg} />
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.itemNome} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPreco}>{formatPrice(item.preco, item.price)}</Text>
              <View style={styles.qtdRow}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.qtdBtn}>
                  <Text style={styles.qtdBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtdNum}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.qtdBtn}>
                  <Text style={styles.qtdBtnText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.subtotal}>
              R$ {(((item.preco || 0)) * item.quantity).toFixed(2).replace('.', ',')}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {getTotal().toFixed(2).replace('.', ',')}</Text>
        </View>
        <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
          <Text style={styles.btnFinalizarText}>✓  Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f', gap: 16 },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { color: '#aaa', fontSize: 18 },
  btnVoltar: { backgroundColor: '#FF4500', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  btnVoltarText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  item: {
    backgroundColor: '#1a1a1a', borderRadius: 12,
    flexDirection: 'row', overflow: 'hidden',
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  itemImg: { width: 90, height: 90 },
  itemInfo: { flex: 1, padding: 10 },
  itemNome: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  itemPreco: { color: '#aaa', fontSize: 13, marginBottom: 8 },
  qtdRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtdBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  qtdBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  qtdNum: { color: '#fff', fontSize: 16, fontWeight: '700', minWidth: 24, textAlign: 'center' },
  removeBtn: { marginLeft: 8 },
  removeText: { fontSize: 18 },
  subtotal: { color: '#FF4500', fontWeight: '800', fontSize: 14, padding: 10, justifyContent: 'center', alignSelf: 'center' },
  footer: {
    backgroundColor: '#1a1a1a', padding: 16,
    borderTopWidth: 1, borderColor: '#2a2a2a',
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  totalLabel: { color: '#aaa', fontSize: 16 },
  totalValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  btnFinalizar: { backgroundColor: '#FF4500', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  btnFinalizarText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});

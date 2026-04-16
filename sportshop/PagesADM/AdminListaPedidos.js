import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getPedidos } from '../database';

const STATUS_COLORS = {
  'Pendente': '#FFA500',
  'Em preparo': '#2196F3',
  'Enviado': '#9C27B0',
  'Entregue': '#4CAF50',
  'Cancelado': '#f44336',
};

export default function AdminListaPedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function carregar() {
    setLoading(true);
    const data = await getPedidos();
    setPedidos(data);
    setLoading(false);
  }

  const formatPrice = (p) => 'R$ ' + Number(p).toFixed(2).replace('.', ',');

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#FF4500" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{pedidos.length} pedido(s) no total</Text>
      </View>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AdminDetalhePedido', { pedido: item })}
          >
            <View style={styles.cardTop}>
              <Text style={styles.cardId}>Pedido #{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[item.status] || '#888') + '33' }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || '#888' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.cliente}>👤 {item.cliente || 'Cliente'}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.total}>{formatPrice(item.total)}</Text>
              <Text style={styles.data}>{new Date(item.criado_em).toLocaleDateString('pt-BR')}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyText}>Nenhum pedido ainda</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' },
  header: {
    padding: 14, backgroundColor: '#1a1a1a',
    borderBottomWidth: 1, borderColor: '#2a2a2a',
  },
  headerText: { color: '#aaa', fontSize: 13 },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardId: { color: '#fff', fontWeight: '700', fontSize: 15 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontWeight: '700', fontSize: 12 },
  cliente: { color: '#aaa', fontSize: 13, marginBottom: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  total: { color: '#FF4500', fontWeight: '800', fontSize: 16 },
  data: { color: '#666', fontSize: 12 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#666', fontSize: 15 },
});

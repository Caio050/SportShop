import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Alert
} from 'react-native';
import { getItensPedido, atualizarStatusPedido } from '../database';

const STATUS_OPTIONS = ['Pendente', 'Em preparo', 'Enviado', 'Entregue', 'Cancelado'];
const STATUS_COLORS = {
  'Pendente': '#FFA500',
  'Em preparo': '#2196F3',
  'Enviado': '#9C27B0',
  'Entregue': '#4CAF50',
  'Cancelado': '#f44336',
};

export default function AdminDetalhePedido({ route, navigation }) {
  const { pedido } = route.params;
  const [itens, setItens] = useState([]);
  const [status, setStatus] = useState(pedido.status);

  useEffect(() => {
    carregarItens();
  }, []);

  async function carregarItens() {
    const data = await getItensPedido(pedido.id);
    setItens(data);
  }

  async function handleStatus(novoStatus) {
    await atualizarStatusPedido(pedido.id, novoStatus);
    setStatus(novoStatus);
    Alert.alert('✅ Status atualizado', `Pedido marcado como "${novoStatus}"`);
  }

  const formatPrice = (p) => 'R$ ' + Number(p).toFixed(2).replace('.', ',');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedido #{pedido.id}</Text>
        <Text style={styles.info}>Cliente: {pedido.cliente}</Text>
        <Text style={styles.info}>Data: {new Date(pedido.criado_em).toLocaleString('pt-BR')}</Text>
        <Text style={styles.total}>Total: {formatPrice(pedido.total)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status atual</Text>
        <View style={[styles.statusBig, { backgroundColor: (STATUS_COLORS[status] || '#888') + '22' }]}>
          <Text style={[styles.statusBigText, { color: STATUS_COLORS[status] || '#888' }]}>{status}</Text>
        </View>
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Alterar status</Text>
        <View style={styles.statusGrid}>
          {STATUS_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => handleStatus(s)}
              style={[styles.statusBtn, s === status && { borderColor: STATUS_COLORS[s], backgroundColor: STATUS_COLORS[s] + '22' }]}
            >
              <Text style={[styles.statusBtnText, s === status && { color: STATUS_COLORS[s] }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itens do pedido</Text>
        {itens.length === 0 ? (
          <Text style={styles.info}>Nenhum item registrado.</Text>
        ) : (
          itens.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
              <Text style={styles.itemQtd}>x{item.quantidade}</Text>
              <Text style={styles.itemPreco}>{formatPrice(item.preco * item.quantidade)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  section: {
    backgroundColor: '#1a1a1a', margin: 12, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#2a2a2a',
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 12 },
  info: { color: '#aaa', fontSize: 14, marginBottom: 4 },
  total: { color: '#FF4500', fontSize: 18, fontWeight: '800', marginTop: 8 },
  statusBig: { borderRadius: 10, padding: 12, alignItems: 'center' },
  statusBigText: { fontSize: 18, fontWeight: '800' },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#333', backgroundColor: '#1e1e1e',
  },
  statusBtnText: { color: '#aaa', fontSize: 13 },
  itemRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderColor: '#2a2a2a',
  },
  itemNome: { flex: 1, color: '#ddd', fontSize: 14 },
  itemQtd: { color: '#888', fontSize: 14, marginHorizontal: 12 },
  itemPreco: { color: '#FF4500', fontSize: 14, fontWeight: '700' },
});

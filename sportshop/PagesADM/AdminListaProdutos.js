import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, Alert, ActivityIndicator, TextInput
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getProdutos, deletarProduto } from '../database';

export default function AdminListaProdutos({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  async function carregar() {
    setLoading(true);
    const data = await getProdutos();
    setProdutos(data);
    setLoading(false);
  }

  async function confirmarExclusao(produto) {
    Alert.alert(
      'Excluir produto',
      `Deseja excluir "${produto.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive',
          onPress: async () => {
            await deletarProduto(produto.id);
            carregar();
          }
        }
      ]
    );
  }

  const formatPrice = (p) => 'R$ ' + Number(p).toFixed(2).replace('.', ',');

  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.count}>{produtos.length} produto(s) cadastrado(s)</Text>
        <TouchableOpacity
          style={styles.btnNovo}
          onPress={() => navigation.navigate('AdminCriarProduto')}
        >
          <Text style={styles.btnNovoText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Buscar produto..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagem }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome} numberOfLines={2}>{item.nome}</Text>
              <Text style={styles.cardCat}>{item.categoria}</Text>
              <Text style={styles.cardPreco}>{formatPrice(item.preco)}</Text>
              <Text style={styles.cardEstoque}>
                {item.estoque > 0 ? `Estoque: ${item.estoque}` : '⚠️ Esgotado'}
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => navigation.navigate('AdminEditarProduto', { produto: item })}
              >
                <Text style={styles.btnEditarText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnExcluir}
                onPress={() => confirmarExclusao(item)}
              >
                <Text style={styles.btnExcluirText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 14, backgroundColor: '#1a1a1a',
    borderBottomWidth: 1, borderColor: '#2a2a2a',
  },
  count: { color: '#aaa', fontSize: 13 },
  btnNovo: { backgroundColor: '#FF4500', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  btnNovoText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  searchWrap: { padding: 10 },
  searchInput: {
    backgroundColor: '#1e1e1e', color: '#fff',
    borderRadius: 10, paddingHorizontal: 14, height: 42,
    borderWidth: 1, borderColor: '#333',
  },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: 12,
    flexDirection: 'row', overflow: 'hidden',
    borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardImg: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 10, justifyContent: 'center' },
  cardNome: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardCat: { color: '#888', fontSize: 11, marginBottom: 4 },
  cardPreco: { color: '#FF4500', fontSize: 15, fontWeight: '800' },
  cardEstoque: { color: '#aaa', fontSize: 11, marginTop: 2 },
  cardActions: { justifyContent: 'center', padding: 10, gap: 8 },
  btnEditar: {
    backgroundColor: '#2a2a5a', borderRadius: 8,
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
  },
  btnEditarText: { fontSize: 18 },
  btnExcluir: {
    backgroundColor: '#5a1a1a', borderRadius: 8,
    width: 40, height: 40, justifyContent: 'center', alignItems: 'center',
  },
  btnExcluirText: { fontSize: 18 },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyText: { color: '#666', fontSize: 15 },
});

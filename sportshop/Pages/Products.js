import { useState, useContext, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, Image, StyleSheet,
  ActivityIndicator, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CartContext } from '../CartContext';
import { getProdutos } from '../database';

const CATEGORIAS = ['Todos', 'Futebol', 'Basquete', 'Academia', 'Roupas', 'Calçados', 'Tênis', 'Geral'];

export default function Products({ navigation }) {
  const { cart, addToCart } = useContext(CartContext);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useFocusEffect(
    useCallback(() => {
      carregarProdutos();
    }, [])
  );

  async function carregarProdutos() {
    setLoading(true);
    try {
      const data = await getProdutos();
      setProdutos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtrados = produtos.filter((p) => {
    const matchSearch = p.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoriaAtiva === 'Todos' || p.categoria === categoriaAtiva;
    return matchSearch && matchCat;
  });

  const formatPrice = (preco) => {
    return 'R$ ' + Number(preco).toFixed(2).replace('.', ',');
  };

  const handleAddToCart = (produto) => {
    addToCart({
      id: produto.id,
      name: produto.nome,
      price: formatPrice(produto.preco),
      preco: produto.preco,
      image: produto.imagem,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Buscar produtos..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Categorias */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriaScroll}>
        {CATEGORIAS.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setCategoriaAtiva(cat)}
            style={[styles.catBtn, categoriaAtiva === cat && styles.catBtnAtivo]}
          >
            <Text style={[styles.catText, categoriaAtiva === cat && styles.catTextAtivo]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ padding: 10, gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />

            {item.estoque <= 5 && item.estoque > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Últimas unidades!</Text>
              </View>
            )}
            {item.estoque === 0 && (
              <View style={[styles.badge, { backgroundColor: '#555' }]}>
                <Text style={styles.badgeText}>Esgotado</Text>
              </View>
            )}

            <View style={styles.cardBody}>
              <Text style={styles.cardNome} numberOfLines={2}>{item.nome}</Text>
              <Text style={styles.cardCategoria}>{item.categoria}</Text>
              <Text style={styles.cardPreco}>{formatPrice(item.preco)}</Text>

              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                style={[styles.btnCarrinho, item.estoque === 0 && { backgroundColor: '#555' }]}
                disabled={item.estoque === 0}
              >
                <Text style={styles.btnCarrinhoText}>
                  {item.estoque === 0 ? 'Esgotado' : '+ Carrinho'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' },
  loadingText: { color: '#fff', marginTop: 12, fontSize: 16 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e1e1e', margin: 10, borderRadius: 10,
    paddingHorizontal: 12, borderWidth: 1, borderColor: '#333',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', height: 44, fontSize: 15 },
  categoriaScroll: { paddingHorizontal: 10, marginBottom: 4 },
  catBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#1e1e1e', marginRight: 8, borderWidth: 1, borderColor: '#333',
  },
  catBtnAtivo: { backgroundColor: '#FF4500', borderColor: '#FF4500' },
  catText: { color: '#aaa', fontSize: 13, fontWeight: '500' },
  catTextAtivo: { color: '#fff', fontWeight: '700' },
  card: {
    flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12,
    overflow: 'hidden', borderWidth: 1, borderColor: '#2a2a2a',
  },
  cardImage: { width: '100%', height: 150 },
  badge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#FF4500', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardBody: { padding: 10 },
  cardNome: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 2 },
  cardCategoria: { color: '#888', fontSize: 11, marginBottom: 6 },
  cardPreco: { color: '#FF4500', fontSize: 16, fontWeight: '800', marginBottom: 8 },
  btnCarrinho: {
    backgroundColor: '#FF4500', borderRadius: 8,
    paddingVertical: 8, alignItems: 'center',
  },
  btnCarrinhoText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#666', fontSize: 16 },
});

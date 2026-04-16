import { useState, useEffect, useContext } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { CartContext } from '../CartContext';
import { getProdutoById } from '../database';

export default function DetalheProduto({ route, navigation }) {
  const { produtoId } = route.params;
  const { cart, addToCart } = useContext(CartContext);
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);

  const itemNoCarrinho = cart.find(i => i.id === produtoId);

  useEffect(() => {
    carregarProduto();
  }, []);

  async function carregarProduto() {
    try {
      const data = await getProdutoById(produtoId);
      setProduto(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (preco) => 'R$ ' + Number(preco).toFixed(2).replace('.', ',');

  const handleAddToCart = () => {
    for (let i = 0; i < quantidade; i++) {
      addToCart({
        id: produto.id,
        name: produto.nome,
        price: formatPrice(produto.preco),
        preco: produto.preco,
        image: produto.imagem,
      });
    }
    Alert.alert('✅ Adicionado!', `${quantidade}x ${produto.nome} no carrinho.`, [
      { text: 'Continuar comprando' },
      { text: 'Ver carrinho', onPress: () => navigation.navigate('Carrinho') },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: '#fff' }}>Produto não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Imagem principal */}
      <Image source={{ uri: produto.imagem }} style={styles.imagem} />

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.catRow}>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{produto.categoria}</Text>
          </View>
          {produto.estoque > 0 ? (
            <Text style={styles.estoqueOk}>✓ Em estoque ({produto.estoque} unidades)</Text>
          ) : (
            <Text style={styles.estoqueFora}>✗ Esgotado</Text>
          )}
        </View>

        <Text style={styles.nome}>{produto.nome}</Text>
        <Text style={styles.preco}>{formatPrice(produto.preco)}</Text>

        {/* Parcelas simuladas */}
        <Text style={styles.parcela}>
          ou 10x de {formatPrice(produto.preco / 10)} sem juros
        </Text>

        <View style={styles.divider} />

        {/* Descrição */}
        <Text style={styles.sectionTitle}>📋 Descrição do produto</Text>
        <Text style={styles.descricao}>{produto.descricao || 'Sem descrição disponível.'}</Text>

        <View style={styles.divider} />

        {/* Detalhes */}
        <Text style={styles.sectionTitle}>📦 Informações</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Categoria</Text>
          <Text style={styles.infoVal}>{produto.categoria}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Disponibilidade</Text>
          <Text style={styles.infoVal}>{produto.estoque > 0 ? `${produto.estoque} unidades` : 'Esgotado'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Frete</Text>
          <Text style={[styles.infoVal, { color: '#4CAF50' }]}>Grátis acima de R$ 200</Text>
        </View>

        <View style={styles.divider} />

        {/* Quantidade */}
        {produto.estoque > 0 && (
          <>
            <Text style={styles.sectionTitle}>Quantidade</Text>
            <View style={styles.qtdRow}>
              <TouchableOpacity
                onPress={() => setQuantidade(Math.max(1, quantidade - 1))}
                style={styles.qtdBtn}
              >
                <Text style={styles.qtdBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtdNum}>{quantidade}</Text>
              <TouchableOpacity
                onPress={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                style={styles.qtdBtn}
              >
                <Text style={styles.qtdBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Bottom CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={[styles.btnComprar, produto.estoque === 0 && { backgroundColor: '#555' }]}
          onPress={handleAddToCart}
          disabled={produto.estoque === 0}
        >
          <Text style={styles.btnComprarText}>
            {produto.estoque === 0 ? 'Produto Esgotado' : '🛒  Adicionar ao Carrinho'}
          </Text>
        </TouchableOpacity>

        {itemNoCarrinho && (
          <TouchableOpacity
            style={styles.btnVerCarrinho}
            onPress={() => navigation.navigate('Carrinho')}
          >
            <Text style={styles.btnVerCarrinhoText}>
              Ver carrinho ({itemNoCarrinho.quantity} no carrinho)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' },
  imagem: { width: '100%', height: 300, backgroundColor: '#1a1a1a' },
  info: { padding: 16 },
  catRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  catTag: { backgroundColor: '#FF4500', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  catTagText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  estoqueOk: { color: '#4CAF50', fontSize: 13, fontWeight: '600' },
  estoqueFora: { color: '#f44', fontSize: 13, fontWeight: '600' },
  nome: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8, lineHeight: 28 },
  preco: { color: '#FF4500', fontSize: 30, fontWeight: '900', marginBottom: 4 },
  parcela: { color: '#aaa', fontSize: 13, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#2a2a2a', marginVertical: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  descricao: { color: '#bbb', fontSize: 14, lineHeight: 22 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#1e1e1e' },
  infoKey: { color: '#888', fontSize: 14 },
  infoVal: { color: '#ddd', fontSize: 14, fontWeight: '600' },
  qtdRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  qtdBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  qtdBtnText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  qtdNum: { color: '#fff', fontSize: 22, fontWeight: '700', minWidth: 30, textAlign: 'center' },
  cta: { padding: 16, paddingBottom: 32, gap: 10 },
  btnComprar: {
    backgroundColor: '#FF4500', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center',
  },
  btnComprarText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  btnVerCarrinho: {
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', borderWidth: 1, borderColor: '#FF4500',
  },
  btnVerCarrinhoText: { color: '#FF4500', fontSize: 15, fontWeight: '700' },
});

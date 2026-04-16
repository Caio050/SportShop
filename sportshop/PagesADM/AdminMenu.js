import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MenuItem = ({ icon, title, subtitle, color, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.menuIcon, { backgroundColor: color + '22' }]}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
    </View>
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSub}>{subtitle}</Text>
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

export default function AdminMenu({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Painel Administrativo</Text>
        <Text style={styles.headerSub}>SportShop — Gerenciamento</Text>
      </View>

      <Text style={styles.sectionLabel}>PRODUTOS</Text>
      <MenuItem
        icon="📦"
        title="Listar Produtos"
        subtitle="Ver, editar e excluir produtos"
        color="#FF4500"
        onPress={() => navigation.navigate('AdminListaProdutos')}
      />
      <MenuItem
        icon="➕"
        title="Novo Produto"
        subtitle="Cadastrar produto no catálogo"
        color="#4CAF50"
        onPress={() => navigation.navigate('AdminCriarProduto')}
      />

      <Text style={styles.sectionLabel}>VENDAS</Text>
      <MenuItem
        icon="🧾"
        title="Pedidos"
        subtitle="Acompanhar pedidos realizados"
        color="#2196F3"
        onPress={() => navigation.navigate('AdminListaPedidos')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    backgroundColor: '#1a1a1a', padding: 24,
    borderBottomWidth: 1, borderColor: '#2a2a2a', marginBottom: 8,
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerSub: { color: '#888', fontSize: 13, marginTop: 4 },
  sectionLabel: {
    color: '#666', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.5, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1a1a1a', marginHorizontal: 12, marginBottom: 8,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#2a2a2a',
  },
  menuIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1 },
  menuTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  menuSub: { color: '#888', fontSize: 13, marginTop: 2 },
  menuArrow: { color: '#555', fontSize: 24, fontWeight: '300' },
});

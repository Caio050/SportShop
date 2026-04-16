import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Image, ActivityIndicator
} from 'react-native';
import { criarProduto } from '../database';

const CATEGORIAS = ['Futebol', 'Basquete', 'Academia', 'Roupas', 'Calçados', 'Tênis', 'Geral'];

export default function AdminCriarProduto({ navigation }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [categoria, setCategoria] = useState('Geral');
  const [estoque, setEstoque] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSalvar() {
    if (!nome.trim() || !preco.trim()) {
      Alert.alert('Erro', 'Nome e preço são obrigatórios.');
      return;
    }
    const precoNum = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNum) || precoNum <= 0) {
      Alert.alert('Erro', 'Digite um preço válido.');
      return;
    }
    setSaving(true);
    try {
      await criarProduto(nome.trim(), precoNum, descricao.trim(), imagem.trim(), categoria, estoque || '0');
      Alert.alert('✅ Sucesso', 'Produto criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>

        {/* Preview da imagem */}
        {imagem.length > 10 && (
          <Image source={{ uri: imagem }} style={styles.preview} />
        )}

        <Text style={styles.label}>URL da Imagem</Text>
        <TextInput
          style={styles.input}
          placeholder="https://exemplo.com/imagem.jpg"
          placeholderTextColor="#555"
          value={imagem}
          onChangeText={setImagem}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Nome do Produto *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Bola de Futebol Oficial"
          placeholderTextColor="#555"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Preço (R$) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0,00"
          placeholderTextColor="#555"
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Estoque</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#555"
          value={estoque}
          onChangeText={setEstoque}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Categoria</Text>
        <View style={styles.catGrid}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoria(cat)}
              style={[styles.catBtn, categoria === cat && styles.catBtnAtivo]}
            >
              <Text style={[styles.catText, categoria === cat && styles.catTextAtivo]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Descreva o produto em detalhes..."
          placeholderTextColor="#555"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.btnSalvar, saving && { opacity: 0.7 }]}
          onPress={handleSalvar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSalvarText}>✓  Salvar Produto</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnCancelarText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  form: { padding: 16, gap: 4 },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 16, backgroundColor: '#1a1a1a' },
  label: { color: '#aaa', fontSize: 13, fontWeight: '600', marginTop: 12, marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#1e1e1e', color: '#fff',
    borderRadius: 10, paddingHorizontal: 14,
    height: 48, borderWidth: 1, borderColor: '#333', fontSize: 15,
  },
  textarea: { height: 120, paddingTop: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    backgroundColor: '#1e1e1e', borderWidth: 1, borderColor: '#333',
  },
  catBtnAtivo: { backgroundColor: '#FF4500', borderColor: '#FF4500' },
  catText: { color: '#aaa', fontSize: 13 },
  catTextAtivo: { color: '#fff', fontWeight: '700' },
  btnSalvar: {
    backgroundColor: '#FF4500', borderRadius: 12,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  btnSalvarText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  btnCancelar: {
    borderRadius: 12, paddingVertical: 14,
    alignItems: 'center', marginTop: 10, marginBottom: 32,
    borderWidth: 1, borderColor: '#333',
  },
  btnCancelarText: { color: '#888', fontSize: 15 },
});

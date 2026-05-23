import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Configurações</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Persistência Local</Text>
          <Text style={styles.cardText}>
            As tarefas são salvas localmente com Zustand + AsyncStorage e sincronizadas com a API quando você altera os dados.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Navegação</Text>
          <Text style={styles.cardText}>
            Este app usa Expo Router com abas e navegação em pilha para detalhes de tarefas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  card: {
    backgroundColor: '#f6f6f6',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9e9e9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111',
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
});

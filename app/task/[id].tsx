import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTaskStore } from '../../src/store/useTaskStore';

export default function TaskDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const task = useTaskStore((state) => state.tasks.find((item) => item._id === params.id));
  const toggleTaskCompleted = useTaskStore((state) => state.toggleTaskCompleted);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  if (!params.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <Text style={styles.title}>Tarefa não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Tarefa</Text>
          <Text style={styles.title}>{task.text}</Text>

          <View style={styles.row}>
            <Text style={styles.badgeLabel}>Status</Text>
            <Text style={[styles.badge, task.completed ? styles.done : styles.pending]}>
              {task.completed ? 'Concluída' : 'Pendente'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.badgeLabel}>Prazo</Text>
            <Text style={[styles.date, isOverdue ? styles.overdue : styles.onTime]}>
              {dueDate ? dueDate.toLocaleDateString() : 'Sem prazo'}
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={() => void toggleTaskCompleted(task._id)}
            >
              <Text style={styles.buttonText}>
                {task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => {
                void deleteTask(task._id).then(() => router.back());
              }}
            >
              <Text style={styles.secondaryButtonText}>Excluir tarefa</Text>
            </Pressable>
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#555',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#666',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 20,
  },
  row: {
    marginBottom: 14,
  },
  badgeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    fontWeight: '700',
  },
  done: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  pending: {
    backgroundColor: '#fff8e1',
    color: '#b26a00',
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
  },
  overdue: {
    color: '#d32f2f',
  },
  onTime: {
    color: '#2e7d32',
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#111',
  },
  secondaryButton: {
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#111',
    fontWeight: '700',
  },
});

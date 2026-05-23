import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TaskItem, addTask as apiAddTask, deleteTask as apiDeleteTask, getAllTasks as apiGetAllTasks, updateTask as apiUpdateTask } from '../utils/handle-api';

type TaskPayload = {
    text: string;
    completed: boolean;
    dueDate: string | null;
};

interface TaskState {
    tasks: TaskItem[];
    loadTasks: () => Promise<void>;
    addTask: (task: TaskPayload) => Promise<void>;
    updateTask: (taskId: string, task: TaskPayload) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleTaskCompleted: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            loadTasks: async () => {
                await apiGetAllTasks((nextTasks) => set((state) => ({
                    tasks: typeof nextTasks === 'function' ? nextTasks(state.tasks) : nextTasks,
                })));
            },
            addTask: async (task) => {
                await apiAddTask(task.text, task.completed, task.dueDate, (nextTasks) => set((state) => ({
                    tasks: typeof nextTasks === 'function' ? nextTasks(state.tasks) : nextTasks,
                })), () => undefined);
            },
            updateTask: async (taskId, task) => {
                await apiUpdateTask(taskId, task.text, task.completed, task.dueDate, (nextTasks) => set((state) => ({
                    tasks: typeof nextTasks === 'function' ? nextTasks(state.tasks) : nextTasks,
                })), () => undefined);
            },
            deleteTask: async (id) => {
                await apiDeleteTask(id, (nextTasks) => set((state) => ({
                    tasks: typeof nextTasks === 'function' ? nextTasks(state.tasks) : nextTasks,
                })));
            },
            toggleTaskCompleted: async (id) => {
                const task = useTaskStore.getState().tasks.find((item) => item._id === id);

                if (!task) return;

                await apiUpdateTask(id, task.text, !task.completed, task.dueDate ?? null, (nextTasks) => set((state) => ({
                    tasks: typeof nextTasks === 'function' ? nextTasks(state.tasks) : nextTasks,
                })), () => undefined);
            }
        }),
        {
            name: 'tasks-storage-v2',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
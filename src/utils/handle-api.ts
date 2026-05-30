import React from 'react';
import { Task } from '@/types/Task';
import { useAuthStore } from '@/store/useAuthStore';

const API_URL = 'http://localhost:5000';

function getHeaders(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = useAuthStore.getState().token;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers;
}

export const getAllTasks = async (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);
  try {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/`, { headers: getHeaders() });
    const data = await response.json();
    setTasks(data);
  } catch (err) {
    console.error(err);
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const addTask = async (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onSuccess: () => void
) => {
  try {
    const response = await fetch(`${API_URL}/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, completed, dueDate }),
    });
    if (response.ok) {
      onSuccess();
      getAllTasks(setTasks);
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateTask = async (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  onSuccess: () => void
) => {
  try {
    const response = await fetch(`${API_URL}/update`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ _id: taskId, text, completed, dueDate }),
    });
    if (response.ok) {
      onSuccess();
      getAllTasks(setTasks);
    }
  } catch (err) {
    console.error(err);
  }
};

export const deleteTask = async (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ _id }),
    });
    if (response.ok) {
      getAllTasks(setTasks);
    }
  } catch (err) {
    console.error(err);
  }
};

export const login = async (data: any): Promise<{ token: string; user: any }> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao fazer login' }));
    throw new Error(err.error || 'Falha ao fazer login');
  }

  return await response.json();
};


export const signUp = async (data: any): Promise<{ token: string; user: any }> => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Falha ao criar conta' }));
    throw new Error(err.error || 'Falha ao criar conta'); 
  }

  return await response.json();
}

export const logOut = (): void => {
  useAuthStore.getState().logout();
}
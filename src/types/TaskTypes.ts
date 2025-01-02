import { useMutation, useQuery, useQueryClient } from "react-query";

export interface Task {
  id: string;
  description: string;
  recurrence: {
    type: string;
  };
  schedule: string;
  type: string;
  params: ThermostatParams;
}

export interface ThermostatParams {
  setpoint: number;
  target: string;
}

export async function getTasks(): Promise<Task[]> {
  const response = await fetch("http://localhost:3000/tasks/");
  if (!response.ok) {
    throw new Error("Response was not ok");
  }
  return response.json();
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Response was not ok");
  }
}

export async function addTask(task: Task): Promise<Task> {
  const response = await fetch("http://localhost:3000/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
  if (!response.ok) {
    throw new Error("Response was not ok");
  }
  return response.json();
}

export async function updateTask(taskId: string, task: Task): Promise<Task> {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
  if (!response.ok) {
    throw new Error("Response was not ok");
  }
  return response.json();
}

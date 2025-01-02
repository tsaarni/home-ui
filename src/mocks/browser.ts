import { StatusCodes } from "http-status-codes";
import { http, HttpResponse, RequestHandler } from "msw";
import { setupWorker } from "msw/browser";
import type { Task } from "../types/TaskTypes";

const tasks = new Map<string, Task>();

const handlers: Array<RequestHandler> = [];

export default function mocks() {
  generateInitialTasks();
  return setupWorker(...handlers);
}

function generateInitialTasks() {
  const now = new Date();
  tasks.set("1", {
    id: "1",
    description: "Turn on the heat",
    recurrence: { type: "none" },
    schedule: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0).toISOString(),
    type: "thermostat",
    params: {
      setpoint: 22,
      target: "all"
    }
  });
  tasks.set("2", {
    id: "2",
    description: "Turn off the heat",
    recurrence: { type: "none" },
    schedule: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 6, 0, 0, 0).toISOString(),
    type: "thermostat",
    params: {
      setpoint: 18,
      target: "all"
    }
  });
}

type AddTaskParams = {
  taskId: string;
};

handlers.push(
  http.get("http://localhost:3000/tasks/", () => {
    return HttpResponse.json(Array.from(tasks.values()));
  })
);

handlers.push(
  http.get<AddTaskParams>("http://localhost:3000/tasks/:taskId", async ({ params }) => {
    const taskId = params.taskId;
    const task = tasks.get(taskId);
    if (!task) {
      return HttpResponse.json(undefined, { status: StatusCodes.NOT_FOUND });
    }
    return HttpResponse.json(task);
  })
);

handlers.push(
  http.put<AddTaskParams, Task>("http://localhost:3000/tasks/:taskId", async ({ params, request }) => {
    try {
      const newTaskId = params.taskId;
      const newTask = await request.json();
      tasks.set(newTaskId, newTask);
      return HttpResponse.json(undefined, { status: StatusCodes.CREATED });
    } catch {
      return HttpResponse.json(undefined, { status: StatusCodes.BAD_REQUEST });
    }
  })
);

handlers.push(
  http.post<AddTaskParams, Task>("http://localhost:3000/tasks/", async ({ request }) => {
    try {
      const newTaskId = String(tasks.size + 1);
      const newTask = await request.json();
      newTask.id = newTaskId;
      tasks.set(newTaskId, newTask);
      return HttpResponse.json(undefined, { status: StatusCodes.CREATED });
    } catch {
      return HttpResponse.json(undefined, { status: StatusCodes.BAD_REQUEST });
    }
  })
);

handlers.push(
  http.delete<AddTaskParams>("http://localhost:3000/tasks/:taskId", async ({ params }) => {
    const taskId = params.taskId;
    tasks.delete(taskId);
    return HttpResponse.json(undefined, { status: StatusCodes.NO_CONTENT });
  })
);

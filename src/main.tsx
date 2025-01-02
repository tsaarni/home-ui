import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App";
import "./index.css";
import Layout from "./Layout";
import mocks from "./mocks/browser";
import TaskEdit from "./TaskEdit";
import Tasks from "./Tasks";

if (process.env.NODE_ENV === "development") {
  const worker = mocks();
  await worker.start();
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<App />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/tasks/new" element={<TaskEdit />} />
              <Route path="/tasks/:taskId" element={<TaskEdit />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);

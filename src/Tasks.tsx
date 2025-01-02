import { Button, Card, Container, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconPencil, IconRipple, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router";
import classes from "./Task.module.css";
import { ThermostatParams, deleteTask, getTasks } from "./types/TaskTypes";
import { humanReadableDate } from "./utils";

export default function Tasks() {
  const { data: tasks, isLoading } = useQuery("tasks", getTasks);
  const queryClient = useQueryClient();
  const deleteTaskMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container size="30rem">
      {tasks?.map((task) => (
        <Stack key={task.id} py="xs">
          <Card>
            <Group justify="space-between">
              <Text fw={500}>{humanReadableDate(task.schedule)}</Text>
              <IconRipple style={{ transform: "rotate(90deg)" }} />
            </Group>
            <SimpleGrid
              verticalSpacing={"0.1rem"}
              style={{
                gridTemplateColumns: "auto 1fr",
                paddingBottom: "var(--mantine-spacing-md)",
                paddingTop: "var(--mantine-spacing-xs)"
              }}
            >
              <div
                style={{
                  color: "var(--mantine-color-gray-6)"
                }}
              >
                Setpoint
              </div>
              <div>{task.params.setpoint} °C</div>
              <div style={{ color: "var(--mantine-color-gray-6)" }}>Target</div>
              <div>{task.params.target}</div>
            </SimpleGrid>
            <Group justify="space-between">
              <Button rightSection={<IconPencil size={14} />}>Edit</Button>
              <IconTrash className={classes.deleteButton} onClick={() => deleteTaskMutation.mutate(task.id)} />
            </Group>
          </Card>
        </Stack>
      ))}
    </Container>
  );
}

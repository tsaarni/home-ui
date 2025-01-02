import {
  ActionIcon,
  AngleSlider,
  Button,
  Container,
  Fieldset,
  Group,
  MultiSelect,
  NumberInput,
  Radio,
  rem,
  Select,
  SimpleGrid,
  Slider,
  Space,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { DateInput, DatePickerInput, TimeInput } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { useForm } from "@mantine/form";
import { IconClock } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router";
import type { Task } from "./types/TaskTypes";
import { addTask, getTasks, updateTask } from "./types/TaskTypes";

const areaOptions = [
  "Heat pump",
  "Storage car",
  "Storage road",
  "Toilet",
  "Living room",
  "Kitchen",
  "Bedroom",
  "Bathroom",
  "Office",
  "Empty room"
];

export default function TaskEdit() {
  const params = useParams();
  const ref = useRef<HTMLInputElement>(null);

  const { data: tasks, isLoading } = useQuery("tasks", getTasks);
  const task = tasks?.find((task) => task.id === params.taskId);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      date: task ? dayjs(task.schedule).format("YYYY-MM-DD") : "",
      time: task ? dayjs(task.schedule).format("HH:mm") : "",
      setpoint: task?.params.setpoint,
      target: task?.params.target,
      recurrence: task?.recurrence.type
    }
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSubmit = form.onSubmit((values) => {
    console.log(values);
    queryClient.invalidateQueries("tasks");
    navigate("/tasks");
  });

  if (isLoading) return <div>Loading...</div>;
  const pickerControl = (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  return (
    <Container size="30rem" px={0}>
      <Title order={3}>Schedule Heating</Title>
      <Space h="md" />

      <form onSubmit={onSubmit}>
        <Fieldset legend="When to activate">
          <Stack gap="xs">
            <TimeInput
              label="Time"
              key={form.key("time")}
              {...form.getInputProps("time")}
              ref={ref}
              leftSection={pickerControl}
              placeholder="Select the time to execute the task"
            />
            <Radio.Group label="Day" key={form.key("when")} {...form.getInputProps("when")} defaultValue="today">
              <Group>
                <Radio value="today" label="Today" />
                <Radio value="tomorrow" label="Tomorrow" />
              </Group>
            </Radio.Group>

            <Radio.Group
              label="Recurrence"
              key={form.key("recurrence")}
              {...form.getInputProps("recurrence")}
              defaultValue="no"
            >
              <Group>
                <Radio value="no" label="No" />
                <Radio value="daily" label="Daily" />
                <Radio value="weekly" label="Weekly" />
              </Group>
            </Radio.Group>
          </Stack>
        </Fieldset>

        <Space h="md" />

        <Fieldset legend="Settings">
          <Stack gap="xs" px={0}>
            <Text size="sm">Temperature</Text>
            <Slider
              defaultValue={22}
              min={5}
              max={30}
              labelAlwaysOn
              marks={[
                { value: 5, label: "5 °C" },
                { value: 10, label: "10 °C" },
                { value: 15, label: "15 °C" },
                { value: 20, label: "20 °C" },
                { value: 25, label: "25 °C" },
                { value: 30, label: "30 °C" }
              ]}
            />
            <Space h="md" />

            <MultiSelect
              label="Thermostat"
              key={form.key("target")}
              {...form.getInputProps("target")}
              placeholder="Select the thermostats to control"
              data={areaOptions}
            />
          </Stack>
        </Fieldset>
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
}

import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet } from "react-router";

const menuItems = [
  { name: "Home", url: "/" },
  { name: "Tasks", url: "/tasks" },
  { name: "New Task", url: "/tasks/new" }
];

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          HOME
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {menuItems.map((item) => (
          <NavLink href={item.url} label={item.name} key={item.url} />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

'use client'

import { JSX, useEffect, useState } from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import cx from 'clsx';
import classes from "./ThemeToggle.module.css";

function ThemeToggle(): JSX.Element {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => queueMicrotask(() => setMounted(true)), []);

  const handleToggleTheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <ActionIcon
      variant="default"
      size="xl"
      radius="md"
      aria-label="Toggle color scheme"
      aria-pressed={mounted ? colorScheme === "dark" : undefined}
      onClick={handleToggleTheme}
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
}

export default ThemeToggle;
"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Drawer,
  NavLink,
  Stack,
  Title,
  Text,
} from "@mantine/core";

import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/services";
import type { DecodedToken } from "@/types";
import { getInitials, nameToColor } from "@/utils/utils";
import { ThemeToggle } from "@/components";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Blog", href: "/" },
  { label: "About", href: "/about" },
  { label: "Newsletter", href: "/newsletter" },
];

function Header(): JSX.Element {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [menuOpened, setMenuOpened] = useState(false);

  useEffect(() => {
    const decoded = authService.getDecodedToken();
    if (decoded && !authService.isTokenExpired()) {
      queueMicrotask(() => setUser(decoded));
    }
  }, []);

  const initials = useMemo(() => {
    const name = user?.sub ?? "";
    return name ? getInitials(name) : "";
  }, [user]);

  const avatarColor = useMemo(() => {
    const name = user?.sub ?? "";
    return name ? nameToColor(name) : undefined;
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
  };

  return (
    <Container size="xl" px="md" fluid>
      <Flex align="center" justify="space-between" gap="md" py="sm">
        {/* Left: Brand */}
        <Title order={6} fw={600} fz={20} style={{ letterSpacing: 0.2 }}>
          One Blog
        </Title>

        {/* Right: Navigation, Theme toggle, Auth (desktop only) */}
        <Group gap="md" align="center" wrap="nowrap" visibleFrom="sm">
          {/* Navigation */}
          <Group gap="md" align="center" wrap="nowrap" visibleFrom="sm">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Anchor
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  underline={active ? "always" : "hover"}
                  fw={active ? 500 : 400}
                  className="header-link"
                  style={{
                    fontSize: 18,
                    transition: "color 150ms ease, font-weight 150ms ease",
                  }}
                >
                  {link.label}
                </Anchor>
              );
            })}
          </Group>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth section */}
          {user ? (
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Avatar
                  variant="filled"
                  radius="xl"
                  size={36}
                  color={avatarColor}
                >
                  <Text component="span" size="sm" fw={700} c="white">
                    {initials}
                  </Text>
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleLogout}>
                  <Text size="md" fw={600} c="red">
                    Logout
                  </Text>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button
              size="sm"
              variant="filled"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          )}
        </Group>

        {/* Mobile burger - fixed position */}
        <Box hiddenFrom="sm">
          <Burger
            opened={menuOpened}
            onClick={() => setMenuOpened((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpened}
            aria-controls="mobile-nav-drawer"
            color="currentColor"
            size="sm"
          />
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer
        id="mobile-nav-drawer"
        opened={menuOpened}
        onClose={() => setMenuOpened(false)}
        position="right"
        size="sm"
        padding="sm"
        withOverlay
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        aria-label="Mobile navigation drawer"
        withCloseButton={false}
      >
        <Stack>
          {user ? (
            <Group justify="space-between" align="center">
              <Stack gap="sm" align="center" w="100%">
                <Avatar
                  variant="filled"
                  radius="xl"
                  size={48}
                  color={avatarColor}
                  styles={{ root: { outlineOffset: 2 } }}
                >
                  <Text component="span" size="sm" fw={700} c="white">
                    {initials}
                  </Text>
                </Avatar>
                <Text fw={600}>{user.sub}</Text>
              </Stack>
            </Group>
          ) : (
            <Button
              variant="filled"
              size="sm"
              onClick={() => {
                setMenuOpened(false);
                router.push("/login");
              }}
              aria-label="Login"
            >
              Login
            </Button>
          )}

          {/* Navigation links */}
          <Stack gap="xs" align="center" w="100%">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <NavLink
                  key={link.href}
                  label={link.label}
                  active={active}
                  onClick={() => {
                    setMenuOpened(false);
                    router.push(link.href);
                  }}
                  variant="light"
                />
              );
            })}
            <Group>
              <ThemeToggle />
              <Button size="sm" variant="filled" onClick={handleLogout}>
                Logout
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Drawer>
    </Container>
  );
}

export default Header;

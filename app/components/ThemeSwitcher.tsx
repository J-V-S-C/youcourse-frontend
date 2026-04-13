'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MaterialUISwitch } from './ui/MaterialUISwitch';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 56, height: 30, margin: 8 }} />;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const handleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <MaterialUISwitch
      checked={isDark}
      onChange={handleTheme}
      color="success"
      sx={{ m: 1 }}
      aria-label="Alternar tema"
    />
  );
}

'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = useMemo(() => {
    const isDark = resolvedTheme === 'dark';

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: isDark ? '#90caf9' : '#1976d2',
          dark: isDark ? '#42a5f5' : '#115293',
          contrastText: '#ffffff',
        },
        text: {
          primary: isDark ? '#ededed' : '#171717',
          secondary: isDark ? '#a3a3a3' : '#737373',
        },
        background: {
          default: isDark ? '#0a0a0a' : '#ffffff',
          paper: isDark ? '#171717' : '#ffffff',
        },
      },
    });
  }, [resolvedTheme]);

  if (!mounted) {
    const ssrTheme = createTheme({ palette: { mode: 'dark' } });
    return <ThemeProvider theme={ssrTheme}>{children}</ThemeProvider>;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
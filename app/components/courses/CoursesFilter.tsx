'use client';

import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

interface CoursesFilterProps {
  initialQ?: string;
  initialSort?: string;
}

export default function CoursesFilter({ initialQ, initialSort }: CoursesFilterProps) {
  const router = useRouter();

  const updateUrl = (q: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (sort && sort !== 'recent') params.set('sort', sort);
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <TextField
        fullWidth
        placeholder="Buscar cursos..."
        defaultValue={initialQ}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--muted)' }} />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'var(--background)',
            borderRadius: 2,
          },
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            updateUrl((e.target as HTMLInputElement).value, initialSort ?? 'recent');
          }
        }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          label="Ordenar por"
          defaultValue={initialSort ?? 'recent'}
          onChange={(e) => updateUrl(initialQ ?? '', e.target.value)}
          sx={{
            bgcolor: 'var(--background)',
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--border)',
            },
          }}
        >
          <MenuItem value="recent">Mais Recentes</MenuItem>
          <MenuItem value="rating">Melhor Avaliados</MenuItem>
          <MenuItem value="name">Nome A-Z</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}

import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes';
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App; 
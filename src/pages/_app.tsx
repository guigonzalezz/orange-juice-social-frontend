import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { AuthProvider } from '../contexts/AuthContext'
import { theme } from '../styles/theme';
import { UsuarioProvider } from '../contexts/UsuarioContext';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AuthProvider>
      <UsuarioProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>
              Orange Juice
            </title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
            <link
              rel="icon"
              type="image/x-icon"
              href="../../public/favicon.ico"
            ></link>
          </Head>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </LocalizationProvider>
        </CacheProvider>
      </UsuarioProvider>
    </AuthProvider>
  );
};

export default App;

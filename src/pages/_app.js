import { useRef, useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache';
import theme from '@/styles/theme';
import BaseLayout from '@/layouts/BaseLayout';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { useRouter } from 'next/router';
import "@/styles/index.scss";
import GlobalScripts from '@/components/GlobalScripts';
import { SettingsProvider } from '@/context/SettingsContext';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
  const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout = Component.getLayout ?? (page => <BaseLayout contentHeightFixed={contentHeightFixed}>{page}</BaseLayout>)
  const tawkMessengerRef = useRef();
  const router = useRouter();



  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SettingsProvider>
          <GlobalScripts />
          {getLayout(<Component {...pageProps} />)}
          <TawkMessengerReact ref={tawkMessengerRef} propertyId="67d06a8394256e190a48045e" widgetId="1im3204h5" customStyle={customStyle} />
        </SettingsProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

const customStyle = {
  visibility: {
    desktop: {
      xOffset: '15',
      yOffset: '15',
      position: 'br'
    },

    mobile: {
      xOffset: 15,
      yOffset: 15,
      position: 'br'
    }
  }
};

export default App;
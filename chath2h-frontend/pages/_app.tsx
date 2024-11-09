import { RainbowKitProvider, getDefaultWallets, Theme, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import Layout from 'components/Layout';
import GlobalStateProvider from 'globalState';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import Head from 'next/head';
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/Calendar.css';
import 'styles/globals.css';
import { polygon, polygonMumbai } from 'viem/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { merge } from 'lodash';
import Router from 'next/router';

const { publicRuntimeConfig } = getConfig();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const singleChain =
  typeof window !== 'undefined' &&
  window.location.origin &&
  (window.location.origin === 'https://h2h-chat.test.neti-soft.com' ||
    window.location.origin === 'http://localhost:3000')
    ? polygonMumbai
    : polygon;

const { chains, publicClient } = configureChains([singleChain], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'Chat2H',
  projectId: '6dc380440e708fde2c00b05379cfc744',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const buttonTheme = merge(lightTheme(), {
  colors: {
    accentColor: '#39aba4'
  }
} as Theme);

const app = function App({ Component, pageProps }: AppProps) {
  axios.defaults.headers.lang = pageProps._nextI18Next?.initialLocale;

  return (
    <>
      <Head>
        <title>Chat H2H</title>
        <meta name="description" content="Chat human to human" />
        <meta name="color-scheme" content="light only" />
        <meta
          name="viewport"
          content="width=device-width, minimum-scale=1, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastContainer limit={2} transition={Slide} position="top-center" />
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} initialChain={singleChain.id} theme={buttonTheme}>
          <main>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <GlobalStateProvider>
                  <Component {...pageProps} />
                </GlobalStateProvider>
              </Layout>
            </QueryClientProvider>
          </main>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
};

const makeUrl = () => {
  if (typeof window !== 'undefined') {
    if (window.location.href.includes('http://localhost')) {
      console.log('backend url: ' + publicRuntimeConfig.backendUrl);
      return publicRuntimeConfig.backendUrl;
    } else {
      return '/api/';
    }
  }
  return null;
};

axios.defaults.withCredentials = true;
axios.defaults.baseURL = makeUrl();

axios.interceptors.response.use(
  (request) => {
    return request;
  },
  (error) => {
    if (error?.config?.url.includes('advertisement')) return;
    if (axios.isCancel(error)) throw error;
    if (error.response?.data?.skipGlobalExceptionHandler) throw error; // if backend decided
    //(skipGlobalExceptionHandler is set on backend when throwing exception) to do not show error using global mechanisms - skip it
    const status = error.response?.status;
    const ethersError = error.response?.data?.error?.code;

    let errorData =
      error.response?.data?.error ??
      error.response?.error ??
      error.response?.data?.error_description ??
      error.message;

    if (ethersError) {
      errorData = `${errorData.code}, ${errorData.argument}, ${errorData.value}`;
    }

    let msg;

    switch (status) {
      case 401:
        msg = '401 Unauthorized';
        break;
      case 400:
        msg = 'Bad request';
        break;
      case 403:
        msg = 'Forbidden';
        break;
      case 404:
        msg = 'Not found';
        break;
      case 409:
        msg = 'Conflict';
        break;
      case 500:
        msg = 'Technical error';
        break;
      default:
        msg = `Unexpected error, status: ${status}:`;
        break;
    }

    if (console && console.error) console.error(msg, errorData);

    if (errorData) {
      toast.clearWaitingQueue();
      toast.error(
        <p className="toast__centered">
          Error occurred.
          <br />
          Check console for more details
        </p>,
        { position: 'top-center' }
      );
    }
    switch (status) {
      case 404:
        Router.push('');
        break;
      case 403:
        Router.push('');
        break;

      default:
        throw error;
    }
  }
);

export default appWithTranslation(app);

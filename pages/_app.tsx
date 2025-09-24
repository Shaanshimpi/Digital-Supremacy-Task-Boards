import React from 'react';
import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import '@/src/styles/default.css';
import PropTypes from 'prop-types';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';

import 'nprogress/nprogress.css';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  },
  colors: {
    brand: {
      light: '#0079bf',
      dark: '#005a8d'
    },
    success: {
      light: '#70b500',
      dark: '#5a9a00'
    },
    danger: {
      light: '#eb5a46',
      dark: '#c94a3a'
    },
    info: {
      light: '#ff9f1a',
      dark: '#e68a00'
    },
    warning: {
      light: '#f2d600',
      dark: '#d9bd00'
    },
    darkblue: {
      light: '#eae6ff',
      dark: '#a9a1cc'
    },
    lightblue: {
      light: '#f2faf9',
      dark: '#cce8e3'
    },
    performance: {
      light: '#0079bf',
      dark: '#005a8d'
    },
    bug: {
      light: '#eb5a46',
      dark: '#c94a3a'
    },
    feature: {
      light: '#61bd4f',
      dark: '#4a9b3c'
    },
    information: {
      light: '#ff9f1a',
      dark: '#e68a00'
    },
    bg: {
      light: '#ffffff',
      dark: '#1a202c'
    }
  }
});

const DigitalSupremacyApp = ({ Component, pageProps }): JSX.Element => {
  return (
    <>
      <Head>
        <title>Digital Supremacy</title>
        <link rel="shortcut icon" href="/digsup-icon.svg.png"></link>
      </Head>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <NextNprogress color="#0079bf" startPosition={0.3} stopDelayMs={200} height={4} />
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
};

DigitalSupremacyApp.propTypes = {
  pageProps: PropTypes.object
};

export default DigitalSupremacyApp;

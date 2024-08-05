import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import { createCustomTheme } from './theme';
import store from './redux';

// Router.events.on('routeChangeStart', () => NProgress.start());
// Router.events.on('routeChangeComplete', () => NProgress.done());
// Router.events.on('routeChangeError', () => NProgress.done());

import { BrowserRouter as Router } from 'react-router-dom';
// import NProgress from 'nprogress';
import { ThemeProvider } from '@material-ui/core';
import ruLocale from 'date-fns/locale/ru';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import TagManager from 'react-gtm-module';

import './index.scss';
import { ErrorBoundary } from 'react-error-boundary';

window.dataLayer = window.dataLayer || [];

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: process.env.REACT_APP_ENV,
    tracesSampleRate: 1.0,
  });
}

const localeMap = {
  ru: ruLocale,
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const SafeHydrate = ({ children }) => (
  <div suppressHydrationWarning>{typeof window === 'undefined' ? null : children}</div>
);

if (process.env.REACT_APP_GTM_ID) {
  TagManager.initialize({ gtmId: process.env.REACT_APP_GTM_ID });
}

window.name = 'freeunion-admin';

const theme = createCustomTheme({
  responsiveFontSizes: true,
  roundedCorners: true,
  theme: 'LIGHT',
});

ReactDOM.render(
  <React.StrictMode>
    <SafeHydrate>
      <Router>
        <ReduxProvider store={store}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['ru']}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <App />
              </ErrorBoundary>
            </LocalizationProvider>
          </ThemeProvider>
        </ReduxProvider>
      </Router>
    </SafeHydrate>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

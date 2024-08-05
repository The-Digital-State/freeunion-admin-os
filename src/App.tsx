import Head from 'react-helmet';

import SplashScreen from './components/organisms/SplashScreen';
import Routes from 'Routes';
import { useEffect } from 'react';
import { useSelector } from './redux';
import { useLocation, useHistory } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import stylesToast from 'shared/styles/Toast.module.scss';
import 'cropperjs/dist/cropper.css';
import { ModalProvider } from 'context/Modal';

function App() {
  const config = useSelector((state) => state.config);
  const location = useLocation();
  const history = useHistory();
  // const organizations = useSelector((state) => state.organizations);

  useEffect(() => {
    if ((location.pathname === '/signin' || location.pathname === '/') && config.isAuthenticated) {
      // history.push(`/${organizations.adminOrganizations[0].id}/union`);
    }
  }, [config.isAuthenticated, location, history]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=0.1" />
      </Head>
      <SplashScreen>
        <ModalProvider>
          <Routes />
        </ModalProvider>
      </SplashScreen>
      <ToastContainer progressClassName={stylesToast.toastProgressBar} />
    </>
  );
}

export default App;

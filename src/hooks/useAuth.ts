import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../redux';
import { login, logout } from '../services/api/auth';
import { setAuthenticated } from '../redux/slices/config';
import sockets from 'shared/modules/sockets';

const useAuth = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const config = useSelector((state) => state.config);

  useEffect(() => {
    setIsInitializing(true);

    const token = localStorage.getItem('token');

    dispatch(setAuthenticated(!!token && token !== 'null'));
  }, []);

  useEffect(() => {
    setIsInitializing(false);
  }, [config.isAuthenticated]);

  const handleLogin = async (username: string, password: string, code?: string) => {
    setIsLoading(true);

    try {
      const response = await login(username, password, code);

      if (response.need_2fa) {
        return response;
      } else {
        localStorage.setItem('token', response.token);
        localStorage.setItem('notificationToken', response.notificationToken);
        sockets.init(response.notificationToken);

        dispatch(setAuthenticated(true));
      }
    } catch (e) {
      throw new Error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('notificationToken');
      sockets.disconnect();
      dispatch(setAuthenticated(false));
      window.location.reload();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isInitializing,
    isAuthenticated: config.isAuthenticated,
    logout: handleLogout,
    login: handleLogin,
  };
};

export default useAuth;

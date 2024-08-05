import { api } from './helper';

export type Profile = {
  id: number;
  avatar: string;
  name: string;
};

// type GetUserResponse = {
//   data: {
//     id: number;
//     public_avatar: string;
//     login: string;
//   };
// };

export const login = async (
  username: string,
  password: string,
  code?: string
): Promise<{ token: string; need_2fa: string[]; notificationToken: string }> => {
  try {
    const response = await api().post('/auth/login', {
      email: username,
      password,
      '2fa': code
        ? {
            method: 'totp',
            password: code,
          }
        : undefined,
      device_name: navigator?.userAgent,
    });

    window.dataLayer.push({
      event: 'event',
      eventProps: {
        category: 'account',
        action: 'login',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response.data.errors?.[0];
  }
};

export const logout = async () => {
  let response;

  try {
    response = await api().post('/auth/logout');

    if (response.data) {
      return Promise.resolve();
    } else {
      throw new Error('Filed to logout');
    }
  } catch (e) {
    console.error(e);
    throw new Error('Filed to logout');
  }
};

export const getUser = (): Promise<any> => {
  return api()
    .get<any>('/auth/user')

    .then((response) => {
      const profile = response.data.data;

      return {
        ...profile,

        avatar: profile.public_avatar,
        name: profile.login,
      };
    });
};

export async function getUserData() {
  try {
    const response = await api().get<any>('/me/user');
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export async function addTemplateToSettings(arrayTemplate) {
  try {
    const response = await api().post<any>(`/me/settings`, {
      templates: arrayTemplate,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

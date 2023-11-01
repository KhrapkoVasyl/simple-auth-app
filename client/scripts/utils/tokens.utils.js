import {
  ACCESS_TOKEN_KEY,
  USER_ROLE_KEY,
  homePagesByRole,
} from '../constants/web-pages.constants.js';
import { getUserProfile } from './fetch.utils.js';

export const checkAccesToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) {
    localStorage.clear();
    window.location.replace('./sign-in.html');
  }

  return accessToken;
};

export const getAccessTokenAndRole = async () => {
  const accessToken = checkAccesToken();
  const userRole = localStorage.getItem(USER_ROLE_KEY);

  if (userRole) {
    return [accessToken, userRole];
  }

  const userProfile = await getUserProfile(accessToken).catch(() => null);
  if (userProfile) {
    const role = userProfile;
    localStorage.setItem(USER_ROLE_KEY, role);
    return [accessToken, role];
  }

  localStorage.clear();
  window.location.replace('./sign-in.html');
};

export const redirectToHomePage = (role) => {
  const homePage = homePagesByRole[role];
  window.location.replace(`./${homePage}`);
};

export const logOut = () => {
  localStorage.clear();
  window.location.replace('./sign-in.html');
};

export const redirectToHomePageIfTokenSet = async () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    const userProfile = await getUserProfile(accessToken).catch(() => {
      localStorage.clear();
      return null;
    });

    if (userProfile) {
      const { role } = userProfile;
      localStorage.setItem(USER_ROLE_KEY, role);
      redirectToHomePage(role);
    }
  }
};

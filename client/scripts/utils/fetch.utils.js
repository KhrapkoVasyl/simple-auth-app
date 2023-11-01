import { apiEndpoints } from '../constants/api.constants.js';
import { errorMessages } from '../constants/error-messages.constants.js';
import { resStatuses } from '../constants/res-statuses.constants.js';
import { webPages } from '../constants/web-pages.constants.js';

export const formBearerTokenAuthHeader = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`,
});

export const handleUnauthorizedResponse = (err) => {
  const status = err?.response?.status;
  if (status === resStatuses.UNAUTHORIZED_EXCEPTION) {
    localStorage.clear();
    window.location.replace(webPages.SIGN_IN);
  }

  throw err;
};

export const signIn = async ({ email, password }) =>
  axios.post(apiEndpoints.signIn, { email, password }).then((res) => {
    const accessToken = res?.data?.accessToken;
    if (!accessToken) throw new Error(errorMessages.GETTING_ACCESS_TOKEN_ERROR);

    return accessToken;
  });

export const signUp = async ({ name, email, password, group, variant }) =>
  axios
    .post(apiEndpoints.signUp, { name, email, password, group, variant })
    .then((res) => res?.data?.accessToken);

export const getUserProfile = async (accessToken) =>
  axios
    .get(apiEndpoints.profile, {
      headers: formBearerTokenAuthHeader(accessToken),
    })
    .then((res) => {
      const userProfile = res?.data;
      if (!userProfile)
        throw new Error(errorMessages.GETTING_USER_PROFILE_ERROR);

      return userProfile;
    })
    .catch(handleUnauthorizedResponse);

export const getUsers = async (accessToken) =>
  axios
    .get(apiEndpoints.users, {
      headers: formBearerTokenAuthHeader(accessToken),
    })
    .then((res) => {
      const users = res?.data;
      if (!users) throw new Error(errorMessages.GETTING_USERS_ERROR);

      return users;
    })
    .catch(handleUnauthorizedResponse);

export const getUser = async (userId, accessToken) =>
  axios
    .get(`${apiEndpoints.users}/${userId}`, {
      headers: formBearerTokenAuthHeader(accessToken),
    })
    .then((res) => {
      const user = res?.data;
      if (!user) throw new Error(errorMessages.GETTING_USER_ERROR);

      return user;
    })
    .catch(handleUnauthorizedResponse);

export const updateProfile = async (
  accessToken,
  { name, email, group, variant }
) =>
  axios
    .patch(
      apiEndpoints.profile,
      { name, email, group, variant },
      {
        headers: formBearerTokenAuthHeader(accessToken),
      }
    )
    .then((res) => res?.data)
    .catch(handleUnauthorizedResponse);

export const updateUser = async (
  userId,
  accessToken,
  { name, email, group, variant }
) =>
  axios
    .patch(
      `${apiEndpoints.users}/${userId}`,
      { name, email, group, variant },
      {
        headers: formBearerTokenAuthHeader(accessToken),
      }
    )
    .then((res) => res?.data)
    .catch(handleUnauthorizedResponse);

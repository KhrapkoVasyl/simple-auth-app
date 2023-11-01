import {
  ACCESS_TOKEN_KEY,
  USER_ROLE_KEY,
} from './constants/web-pages.constants.js';
import { resStatuses } from './constants/res-statuses.constants.js';
import { validateForm } from './utils/form.utils.js';
import { getUserProfile, signUp } from './utils/fetch.utils.js';
import {
  redirectToHomePage,
  redirectToHomePageIfTokenSet,
} from './utils/tokens.utils.js';
import { errorMessages } from './constants/error-messages.constants.js';
import { validationRegexps } from './constants/validation.constants.js';

await redirectToHomePageIfTokenSet();
const form = document.querySelector('.sign-up-form');

const onValidSignUpData = async (signUpData) => {
  const accessToken = await signUp(signUpData).catch((err) => {
    const status = err?.response?.status;
    const alertMessage =
      status === resStatuses.CONFLICT_EXCEPTION
        ? errorMessages.USER_WITH_EMAIL_ALREADY_EXISTS
        : errorMessages.SIGN_UP_ERROR;

    alert(alertMessage);
  });

  if (!accessToken) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  const user = await getUserProfile(accessToken).catch(() => null);
  if (user) {
    localStorage.setItem(USER_ROLE_KEY, user.role);
    redirectToHomePage(user.role);
    return;
  }

  window.location.replace('./sign-in.html');
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const [isValid, formDataValues] = validateForm(form, validationRegexps);

  if (isValid) await onValidSignUpData(formDataValues);
});

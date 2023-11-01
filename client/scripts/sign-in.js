import { errorMessages } from './constants/error-messages.constants.js';
import {
  ACCESS_TOKEN_KEY,
  USER_ROLE_KEY,
} from './constants/web-pages.constants.js';
import { validationRegexps } from './constants/validation.constants.js';
import { getUserProfile, signIn } from './utils/fetch.utils.js';
import { validateForm } from './utils/form.utils.js';
import {
  redirectToHomePage,
  redirectToHomePageIfTokenSet,
} from './utils/tokens.utils.js';

await redirectToHomePageIfTokenSet();

const form = document.querySelector('.sign-in-form');

const onValidSignInData = async (signInData) => {
  const accessToken = await signIn(signInData).catch(() => {
    alert(errorMessages.INCORRECT_CREDENTIALS);
  });
  if (!accessToken) return;

  const user = await getUserProfile(accessToken).catch(() => {
    alert(errorMessages.INCORRECT_CREDENTIALS);
  });

  if (user) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_ROLE_KEY, user.role);
    redirectToHomePage(user.role);
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const [isValid, formDataValues] = validateForm(form, validationRegexps);

  if (isValid) await onValidSignInData(formDataValues);
});

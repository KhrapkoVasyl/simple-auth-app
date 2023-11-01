import { getAccessTokenAndRole, logOut } from './utils/tokens.utils.js';
import { userRoles } from './constants/roles.constants.js';
import {
  getUser,
  getUserProfile,
  updateProfile,
  updateUser,
} from './utils/fetch.utils.js';
import { webPages } from './constants/web-pages.constants.js';
import { errorMessages } from './constants/error-messages.constants.js';
import { validationRegexps } from './constants/validation.constants.js';
import { validateForm } from './utils/form.utils.js';

const [accessToken, role] = await getAccessTokenAndRole();
const logOutBtn = document.querySelector('.log-out-btn');

const form = document.querySelector('.user-info');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const groupInput = document.getElementById('group');
const variantInput = document.getElementById('variant');

const backToUserProfileLink = document.querySelector('.user-link');
const backToUsersLink = document.querySelector('.back-link');

const isAmdin = role === userRoles.ADMIN;
if (isAmdin) {
  backToUsersLink.classList.remove('hide-back-to-users-link');
}

const searchParams = new URLSearchParams(window.location.search);
const userId = searchParams.get('userId');

const isProcessingCurrentUser = !isAmdin || !userId;

const backToUserLink = `./${webPages.USER}`;
backToUserProfileLink.href = isProcessingCurrentUser
  ? backToUserLink
  : `${backToUserLink}?userId=${userId}`;

const getUserMethod = isProcessingCurrentUser
  ? getUserProfile.bind(null, accessToken)
  : getUser.bind(null, userId, accessToken);

const user = await getUserMethod().catch(() => {
  alert(`${errorMessages.GETTING_USER_ERROR}! Try again`);
});

if (user) {
  const { name, email, group, variant } = user;
  nameInput.value = name;
  emailInput.value = email;
  groupInput.value = group;
  variantInput.value = variant;
}

const onValidUserData = async (dataToUpdate) => {
  const updateUserMethod = isProcessingCurrentUser
    ? updateProfile.bind(null, accessToken, dataToUpdate)
    : updateUser.bind(null, userId, accessToken, dataToUpdate);

  await updateUserMethod()
    .then(() => alert('Successfully update user data'))
    .catch(() => {
      alert(`${errorMessages.UPDATE_USER_ERROR}! Try again`);
    });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const [isValid, formDataValues] = validateForm(form, validationRegexps);

  if (isValid) await onValidUserData(formDataValues);
});

logOutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  logOut();
});

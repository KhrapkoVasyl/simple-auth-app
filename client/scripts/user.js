import { getAccessTokenAndRole, logOut } from './utils/tokens.utils.js';
import { userRoles } from './constants/roles.constants.js';
import { getUser, getUserProfile } from './utils/fetch.utils.js';
import { webPages } from './constants/web-pages.constants.js';
import { errorMessages } from './constants/error-messages.constants.js';

const [accessToken, role] = await getAccessTokenAndRole();
const logOutBtn = document.querySelector('.log-out-btn');

const nameSpan = document.getElementById('name');
const emailSpan = document.getElementById('email');
const groupSpan = document.getElementById('group');
const variantSpan = document.getElementById('variant');

const title = document.querySelector('.title');
const editUserLink = document.querySelector('.edit-link');
const backLink = document.querySelector('.back-link');

const isAmdin = role === userRoles.ADMIN;
if (isAmdin) {
  backLink.classList.remove('hide-back-link');
}

const searchParams = new URLSearchParams(window.location.search);
const userId = searchParams.get('userId');

const getUserMethod =
  !isAmdin || !userId
    ? getUserProfile.bind(null, accessToken)
    : getUser.bind(null, userId, accessToken);

const user = await getUserMethod().catch(() => {
  title.textContent = `${errorMessages.GETTING_USER_ERROR}!`;
  title.classList.add('error-text');
  setTimeout(() => alert(errorMessages.GETTING_USER_ERROR), 100);
});

if (user) {
  const { name, email, group, variant } = user;
  nameSpan.textContent = name;
  emailSpan.textContent = email;
  groupSpan.textContent = group;
  variantSpan.textContent = variant;

  let linkToEditUser = `./${webPages.EDIT_USER}`;
  editUserLink.href =
    !isAmdin || !userId ? linkToEditUser : linkToEditUser + `?userId=${userId}`;
}

logOutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  logOut();
});

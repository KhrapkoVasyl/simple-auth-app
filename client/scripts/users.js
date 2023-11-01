import { getAccessTokenAndRole, logOut } from './utils/tokens.utils.js';
import { userRoles } from './constants/roles.constants.js';
import { getUser, getUserProfile, getUsers } from './utils/fetch.utils.js';
import { webPages } from './constants/web-pages.constants.js';
import { errorMessages } from './constants/error-messages.constants.js';

const [accessToken, role] = await getAccessTokenAndRole();
const isAmdin = role === userRoles.ADMIN;
if (!isAmdin) {
  window.location.replace(`./${webPages.USER}`);
}

const logOutBtn = document.querySelector('.log-out-btn');

const title = document.querySelector('.title');
const table = document.querySelector('.user-info');

const users = await getUsers(accessToken).catch(() => {
  title.textContent = `${errorMessages.GETTING_USERS_ERROR}! Try again`;
  title.classList.add('error-text');
  setTimeout(() => alert(errorMessages.GETTING_USERS_ERROR), 100);
});

if (users) {
  for (const user of users) {
    const { id, name, email, group, variant, role } = user;

    table.innerHTML += `
      <tr>
      <td><a href="./user.html?userId=${id}" class="user-link">${name}</a></td>
      <td>${email}</td>
      <td>${group}</td>
      <td>${variant}</td>
      <td>${role}</td>
    </tr>
      `;
  }
}

logOutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  logOut();
});

function ensureAdmin() {

const token = localStorage.getItem("token");

const role = localStorage.getItem("role");

const username = localStorage.getItem("username");

if (!token || role !== "ADMIN") {


window.location.href = "/admin-login.html";

return false;


}

const welcomeText =
document.getElementById("welcomeText");

if (welcomeText) {


welcomeText.innerText =
  `Welcome back, ${username}`;


}

return true;
}

/* LOAD ADMIN API TEST */

async function loadAdminData() {

const token = localStorage.getItem("token");

const apiResult =
document.getElementById("apiResult");

apiResult.innerHTML = `     <p>Loading admin data...</p>
  `;

try {

const response = await fetch("/admin/home", {

  headers: {
    "Authorization": "Bearer " + token
  }
});

if (response.status === 401 ||
    response.status === 403) {

  logout();

  return;
}

const text = await response.text();

apiResult.innerHTML = `

  <h2 style="margin-bottom:15px;">
    API Response
  </h2>

  <p style="
      color:#16a34a;
      font-size:18px;
      font-weight:600;
  ">
    ${text}
  </p>

`;


} catch (error) {


console.error(error);

apiResult.innerHTML = `

  <p style="
      color:#dc2626;
      font-weight:600;
  ">
    Failed to load admin data
  </p>

`;

}
}

/* LOGOUT */

function logout() {

localStorage.removeItem("token");

localStorage.removeItem("username");

localStorage.removeItem("role");

window.location.href = "/index.html";
}

/* PAGE LOAD */

document.addEventListener(

"DOMContentLoaded",

() => {


ensureAdmin();


}
);

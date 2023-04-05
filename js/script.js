const jwt = localStorage.getItem('jwt');

async function getUser() {
    const config = {
        method: 'GET',
        headers: {
            'authorization': jwt,
        }
    };
    try {
        const response = await fetch(`${baseUrl}/users/getMe`, config);
        const data = await response.json();
        const profileButton = document.querySelector('#user-button-text');
        const userName = document.querySelector('#user-name');
        const userEmail = document.querySelector('#user-email');
        userName.innerText = `${data.firstName} ${data.lastName}`;
        userEmail.innerText = data.email;
        profileButton.innerText = `${data.firstName.slice(0, 1)}${data.lastName.slice(0, 1)}`
    } catch (error) {
        if (error === 'invalid token') {
            console.log('redireciona');
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
   if (jwt === null || jwt === undefined || jwt === '') {
    window.location.href = './index.html';
   } else {
     getUser();
   }
});

const timelineDate = document.querySelector('#date');
const date = new Date();
const options = { month: 'short', day: 'numeric', weekday: 'short'};
timelineDate.innerText =  date.toLocaleDateString('pt-Br', options).toUpperCase().replaceAll('.', '');

const baseUrl = 'https://todo-api.ctd.academy/v1';

async function getTasks() {
    const config = {
        method: 'GET',
        headers: {
            'authorization': jwt,
        }
    };
    try {
        const response = await fetch(`${baseUrl}/tasks`, config);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

getTasks();


const search = document.querySelector('#search');

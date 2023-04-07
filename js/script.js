const jwt = localStorage.getItem('jwt');
import {getUser, getTasks, deleteTask} from './helpers.js';

function showContent() {
    const header = document.querySelector('header');
    const skelleton = document.querySelector('#skelleton');
    const content = document.querySelector('#content');
    skelleton.classList.add('hidden');
    header.classList.remove('hidden');
    content.classList.remove('hidden');
}

async function userInfoShow() {
  const userResponse = await getUser(jwt);
  if (userResponse === 'invalid token') {
    const warningAlert = document.querySelector('#warning-alert');
    warningAlert.classList.remove('hidden');
    const reloadLogin = document.querySelector('#reload-login');
    reloadLogin.addEventListener('click', () => window.location.href = './index.html');
  } else {
    const profileButton = document.querySelector('#user-button-text');
    const userName = document.querySelector('#user-name');
    const userEmail = document.querySelector('#user-email');
    userName.innerText = `${userResponse.firstName} ${userResponse.lastName}`;
    userEmail.innerText = userResponse.email;
    profileButton.innerText = `${userResponse.firstName.slice(0, 1)}${userResponse.lastName.slice(0, 1)}`;
    showContent();
  }
}

function logout() {
  localStorage.removeItem('jwt');
  window.location.href = './index.html';  
}

const buttonLogout = document.querySelector('#logout-btn');
buttonLogout.addEventListener('click', logout)

const timelineDate = document.querySelector('#date');
const date = new Date();
const options = { month: 'short', day: 'numeric', weekday: 'short' };
timelineDate.innerText = date
  .toLocaleDateString('pt-Br', options)
  .toUpperCase()
  .replaceAll('.', '');

const pendentTasksContainer = document.querySelector('#pendent-container');

const completedTasksContainer = document.querySelector('#completed-container');

async function removeTask(id, e) {
    const deletedTask = await deleteTask(id, jwt)
    if (deletedTask === 200) {
        e.target.closest(`#div-${id}`).remove();
    }
}

function newElement(tag, listClass = [], text = '') {
    const element = document.createElement(tag);
    if (listClass.length > 0) {
       listClass.forEach(item => {
        element.classList.add(item);
       });
    }
    if (text.length > 0) {
        element.innerText = text;
    }
    return element;
}

function createTaskCard(description, createdAt, completed, id) {
  const taskCard = newElement('div', ['bg-base-200', 'sm:w-1/2', 'px-4', 'flex', 'rounded-md', 'justify-between'])
  taskCard.id = `div-${id}`;

  const taskText = newElement('div');

  const checkboxTask = newElement('input', ['checkbox', 'checkbox-secondary', 'rounded-full'])
  checkboxTask.type = 'checkbox';
  checkboxTask.checked = completed;
  taskText.appendChild(checkboxTask);

  const labelTask = newElement('label', [], description) 
  taskText.appendChild(labelTask);

  const taskInfo = newElement('div', ['flex', 'flex-col', 'h-ful', 'justify-between', 'items-end', 'w-1/4', 'pt-1'])

  const taskTrash = newElement('i', ['fi', 'fi-rr-trash', 'text-white', 'text-lg', 'cursor-pointer'])
  taskTrash.addEventListener('click', (e) => removeTask(id, e));
  taskInfo.appendChild(taskTrash);

  const dateAtTask = new Date(createdAt.slice(0, createdAt.indexOf('T')));
  const taskDate = newElement('span', ['text-sm'], dateAtTask.toLocaleDateString('pt-BR'));
  taskInfo.appendChild(taskDate);
  
  taskCard.appendChild(taskText);
  taskCard.appendChild(taskInfo);

  if (!completed) {
    taskText.classList.add('flex', 'items-center', 'gap-4', 'text-white', 'w-full');
  } else {
    taskText.classList.add('flex', 'items-center', 'gap-4', 'line-through', 'w-full');
  }

  return taskCard;
}

async function showPendentTasks() {
  const tasks = await getTasks(jwt);
  if (tasks !== 'invalid token') {
    const pendentSkelleton = document.querySelector('#task-loading-pendent');
    pendentSkelleton.classList.add('hidden');
    const emptyMsg = newElement('span', ['ml-4'], 'Sem tarefas por aqui!');

    if (tasks.length > 0) {
        tasks.forEach(({ description, createdAt, completed, id }) => {
            if (!completed) {
            const task = createTaskCard(description, createdAt, completed, id);
            pendentTasksContainer.appendChild(task);
            emptyMsg.classList.add('hidden')
            } else {
            pendentTasksContainer.appendChild(emptyMsg);
            }
        });
    } else {
        pendentTasksContainer.appendChild(emptyMsg);
    }
  }
}

async function showCompletedTasks() {
  const tasks = await getTasks(jwt);

  if (tasks !== 'invalid token') {
    const completedSkelleton = document.querySelector('#task-loading-completed');
    completedSkelleton.classList.add('hidden');
    const completedEmptyMsg = newElement('span', ['ml-4'], 'Sem tarefas por aqui!');
    
    if (tasks.length > 0) {
        tasks.forEach(({ description, createdAt, completed, id }) => {
            if (completed) {
            const task = createTaskCard(description, createdAt, completed, id);
            completedTasksContainer.appendChild(task);
            completedEmptyMsg.classList.add('hidden');
            } else {
            completedTasksContainer.appendChild(completedEmptyMsg);
            }
        });
    } else {
        completedTasksContainer.appendChild(completedEmptyMsg);
    }
  }  
}

document.addEventListener('DOMContentLoaded', () => {
  if (jwt === null || jwt === undefined || jwt === '') {
    window.location.href = './index.html';
  } else {
    userInfoShow();
  }
});

window.onload = () => {
    showPendentTasks();
    showCompletedTasks();
}

const search = document.querySelector('#search');

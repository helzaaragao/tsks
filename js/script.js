const jwt = localStorage.getItem('jwt');
import {getUser, getTasks, deleteTask, postTask, updateTask} from './helpers.js';
let tasksList = [];

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

async function changeStatus(taskId, e) {
    const status = e.target.checked;
    const { id, description, completed, createdAt } = await updateTask(jwt, {completed: status}, taskId);
    if (status) {
        e.target.closest(`#div-${id}`).remove();
        const completedTask = createTaskCard(description, createdAt, completed, id);
        completedTasksContainer.appendChild(completedTask);
    } else {
        e.target.closest(`#div-${id}`).remove();
        const pendentTask = createTaskCard(description, createdAt, completed, id);
        pendentTasksContainer.appendChild(pendentTask);
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
  const taskCard = newElement('div', ['bg-base-200', 'md:w-1/2', 'px-4', 'flex', 'rounded-md', 'justify-between']);
  taskCard.id = `div-${id}`;

  const taskText = newElement('div');

  const checkboxTask = newElement('input', ['checkbox', 'checkbox-secondary', 'rounded-full']);
  checkboxTask.type = 'checkbox';
  checkboxTask.checked = completed;
  checkboxTask.addEventListener('change', (e) => changeStatus(id, e));
  taskText.appendChild(checkboxTask);

  const labelTask = newElement('label', [], description); 
  taskText.appendChild(labelTask);

  const taskInfo = newElement('div', ['flex', 'flex-col', 'h-16', 'justify-between', 'items-end', 'w-1/4', 'pt-1']);

  const taskIcons = newElement('div', ['flex', 'gap-2', 'justify-end', 'w-full']);

  const taskEdit = newElement('i', ['fi', 'fi-rr-edit', 'text-lg', 'hover:text-white', 'cursor-pointer']);
  taskEdit.addEventListener('click', (e) => console.log(e.target));
  taskIcons.appendChild(taskEdit);
  

  const taskTrash = newElement('i', ['fi', 'fi-rr-trash', 'text-lg', 'hover:text-white', 'cursor-pointer']);
  taskTrash.addEventListener('click', (e) => removeTask(id, e));
  taskIcons.appendChild(taskTrash);
  taskInfo.appendChild(taskIcons);

  const dateAtTask = new Date(createdAt);
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
  if (tasksList !== 'invalid token') {
    const pendentSkelleton = document.querySelector('#task-loading-pendent');
    pendentSkelleton.classList.add('hidden');

    if (tasksList.length > 0) {
        tasksList.forEach(({ description, createdAt, completed, id }) => {
            if (!completed) {
            const task = createTaskCard(description, createdAt, completed, id);
            pendentTasksContainer.appendChild(task);
            }
        });
    }
  }
}

async function showCompletedTasks() {
  if (tasksList !== 'invalid token') {
    const completedSkelleton = document.querySelector('#task-loading-completed');
    completedSkelleton.classList.add('hidden');
    
    if (tasksList.length > 0) {
        tasksList.forEach(({ description, createdAt, completed, id }) => {
            if (completed) {
            const task = createTaskCard(description, createdAt, completed, id);
            completedTasksContainer.appendChild(task);
            }
        });
    }
  }  
}

async function createtask() {
    const inputNewTask = document.querySelector('#new-task');
    if (inputNewTask.value.length > 0) {
      const { id, description, completed, createdAt } = await postTask(jwt, inputNewTask.value);
      const createdTask = createTaskCard(description, createdAt, completed, id);
      pendentTasksContainer.appendChild(createdTask);
      inputNewTask.value = '';
    } else {

    }
    
}

function tasksFilter(filteredList) {
  if (filteredList.length > 0) {
    pendentTasksContainer.innerHTML= '';
    pendentTasksContainer.appendChild(newElement('h2', ['w-full', 'text-white', 'text-2xl'], 'Tarefas Pendentes'));
    completedTasksContainer.innerHTML= '';
    completedTasksContainer.appendChild(newElement('h2', ['w-full', 'text-white', 'text-2xl'], 'Tarefas Completas'));
    filteredList.forEach(({ description, createdAt, completed, id }) => {
      if (!completed) {
        const task = createTaskCard(description, createdAt, completed, id);
        pendentTasksContainer.appendChild(task);
      } else {
        const task = createTaskCard(description, createdAt, completed, id);
        completedTasksContainer.appendChild(task);
      }
    });
  }
}

function todayFilter() {
  const today = new Date();
  const filteredList = tasksList.filter(({ createdAt }) => Date.parse((new Date(createdAt)).toLocaleDateString('pt-BR')) === Date.parse(today.toLocaleDateString('pt-BR')));
  tasksFilter(filteredList);
}

function yesterdayFilter() {
  const today = new Date();
  const yesterday = new Date(today.setHours(-1));
  const filteredList = tasksList.filter(({ createdAt }) => Date.parse((new Date(createdAt)).toLocaleDateString('pt-BR')) === Date.parse(yesterday.toLocaleDateString('pt-BR')));
  tasksFilter(filteredList);
}

const todayMenuItem = document.querySelector('#today');
todayMenuItem.addEventListener('click', todayFilter);

const yesterdayMenuItem = document.querySelector('#yesterday');
yesterdayMenuItem.addEventListener('click', yesterdayFilter);

const buttonAddTask = document.querySelector('#add-task');
buttonAddTask.addEventListener('click', createtask);

document.addEventListener('DOMContentLoaded', async () => {
  if (jwt === null || jwt === undefined || jwt === '') {
    window.location.href = './index.html';
  } else {
    userInfoShow();
    tasksList = await getTasks(jwt);
  }
});

window.onload = () => {
    showPendentTasks();
    showCompletedTasks();
}

const search = document.querySelector('#search');

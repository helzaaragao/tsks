import { getUser, getTasks, deleteTask, postTask, updateTask } from './helpers.js';

function getToken() {
  const localJwt = localStorage.getItem('chaveJwt');
  const sessionJwt = sessionStorage.getItem('chaveJwt');
  if(sessionJwt) {
    return sessionJwt
  } else if (localJwt) {
    return localJwt;
  }
}

const jwt = getToken();

document.addEventListener('DOMContentLoaded', async () => {
  if (jwt === null || jwt === undefined || jwt === '') {
    window.location.href = './index.html';
  } else {
    userInfoShow();
  }
});

const pendentTasksContainer = document.querySelector('#pendent-container');
const completedTasksContainer = document.querySelector('#completed-container');
const buttonLogout = document.querySelector('#logout-btn');
const timelineDate = document.querySelector('#date');
const todayMenuItem = document.querySelector('#today');
const yesterdayMenuItem = document.querySelector('#yesterday');
const MonthMenuItem = document.querySelector('#month');
const AllMenuItem = document.querySelector('#all-tasks');
const buttonAddTask = document.querySelector('#add-task');
const buttonEditTask = document.querySelector('#edit-task');
const inputEditTask = document.querySelector('#update-task');
const spanAddTask = document.querySelector('#span-add-task');
const inputNewTask = document.querySelector('#new-task');
const modalMask = document.querySelector('#add-modal-mask');
const searchForm = document.querySelector('#search');
const mobileSearchForm = document.querySelector('#mobile-search');
const searchInput = document.querySelector('#input-search');
const mobileSearchInput = document.querySelector('#mobile-input-search');
const spanSearch = document.querySelector('#search-span');

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
  localStorage.removeItem('chaveJwt');
  sessionStorage.removeItem('chaveJwt');
  window.location.href = './index.html';  
}

buttonLogout.addEventListener('click', logout)

const date = new Date();
const options = { month: 'short', day: 'numeric', weekday: 'short' };
timelineDate.innerText = date
  .toLocaleDateString('pt-Br', options)
  .toUpperCase()
  .replaceAll('.', '');

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
  labelTask.id = `label-${id}`;
  taskText.appendChild(labelTask);

  const taskInfo = newElement('div', ['flex', 'flex-col', 'h-16', 'justify-between', 'items-end', 'w-1/4', 'pt-1']);

  const taskIcons = newElement('div', ['flex', 'gap-2', 'justify-end', 'w-full']);

  const taskEdit = newElement('label');
  taskEdit.setAttribute('for', 'edit-task-modal');
  taskEdit.addEventListener('click', () => {
    inputEditTask.value = labelTask.textContent;
    editTask(id);
  });
  const taskEditIcon = newElement('i', ['fi', 'fi-rr-edit', 'text-lg', 'hover:text-white', 'cursor-pointer']);
  taskEdit.appendChild(taskEditIcon);

  const taskTrash = newElement('i', ['fi', 'fi-rr-trash', 'text-lg', 'hover:text-white', 'cursor-pointer']);
  taskTrash.addEventListener('click', (e) => removeTask(id, e));
  taskInfo.appendChild(taskIcons);

  const dateAtTask = new Date(createdAt);
  const taskDate = newElement('span', ['text-sm'], dateAtTask.toLocaleDateString('pt-BR'));
  taskInfo.appendChild(taskDate);
  
  taskCard.appendChild(taskText);
  taskCard.appendChild(taskInfo);

  if (!completed) {
    taskText.classList.add('flex', 'items-center', 'gap-4', 'text-white', 'w-full');
    taskIcons.appendChild(taskEdit);
    taskIcons.appendChild(taskTrash);
  } else {
    taskText.classList.add('flex', 'items-center', 'gap-4', 'line-through', 'w-full');
    taskIcons.appendChild(taskTrash);
  }

  return taskCard;
}

async function showAllTasks() {
  const tasksList = await getTasks(jwt);
  if (tasksList.length > 0) {
    tasksList.forEach(({ description, createdAt, completed, id }) => {
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

async function createTask() {
  if (inputNewTask.value.length > 0) {
    const data = await postTask(jwt, inputNewTask.value);
    if (typeof data === 'object') {
      const createdTask = createTaskCard(data.description, data.createdAt, data.completed, data.id);
      pendentTasksContainer.appendChild(createdTask);
      inputNewTask.value = '';
    } else {
      console.log(data);
    }      
  } else {
    inputNewTask.classList.replace('border-[#d9d9d9]', 'border-red-500')
    spanAddTask.classList.remove('hidden');
  }
}

modalMask.addEventListener('focusout', () => {
  spanAddTask.classList.add('hidden');
  inputNewTask.classList.replace('border-red-500', 'border-[#d9d9d9]');
})

function editTask(id) {
  buttonEditTask.addEventListener('click', async () => {
    const taskDescription = document.querySelector(`#label-${id}`)
    if (inputEditTask.value.length > 0) {
      const data = await updateTask(jwt, {description: inputEditTask.value}, id);
      if (typeof data === 'object') {
        taskDescription.innerText = inputEditTask.value;
        inputEditTask.value = '';
      } else {
        console.log(data);
      }      
    }
  });    
}

buttonEditTask.addEventListener('click', editTask);

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

async function todayFilter() {
  const tasksList = await getTasks(jwt);
  const today = new Date();
  const filteredList = tasksList.filter(({ createdAt }) => (new Date(createdAt)).toLocaleDateString('pt-BR') === today.toLocaleDateString('pt-BR'));
  tasksFilter(filteredList);
}

async function yesterdayFilter() {
  const tasksList = await getTasks(jwt);
  const today = new Date();
  const yesterday = new Date(today.setHours(-1));
  const filteredList = tasksList.filter(({ createdAt }) => (new Date(createdAt)).toLocaleDateString('pt-BR') === yesterday.toLocaleDateString('pt-BR'));
  tasksFilter(filteredList);
}

async function monthFilter() {
  const tasksList = await getTasks(jwt);
  const today = new Date();
  const filteredList = tasksList.filter(({ createdAt }) => (new Date(createdAt)).getMonth() === today.getMonth());
  tasksFilter(filteredList);
}

async function allTasksFilter() {
  const tasksList = await getTasks(jwt);
  tasksFilter(tasksList);
}

async function searchTasks(input, spanErro) {
  const tasksList = await getTasks(jwt);
  const foundTasks = tasksList.filter(({ description }) => description.toLowerCase().includes(input));
  if (foundTasks.length > 0) {
    tasksFilter(foundTasks);
  } else {
    spanErro.classList.remove('hidden');
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = searchInput.value
  searchTasks(inputValue, spanSearch);
});

mobileSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = mobileSearchInput.value
  searchTasks(inputValue, spanSearch);
});

searchInput.addEventListener('input', (e) => {
  if (e.target.value.length === 0) {
    spanSearch.classList.add('hidden');
    searchTasks(e.target.value);
  }
});

mobileSearchInput.addEventListener('input', (e) => {
  if (e.target.value.length === 0) {
    spanSearch.classList.add('hidden');
    searchTasks(e.target.value);
  }
});

todayMenuItem.addEventListener('click', todayFilter);

yesterdayMenuItem.addEventListener('click', yesterdayFilter);

MonthMenuItem.addEventListener('click', monthFilter);

AllMenuItem.addEventListener('click', allTasksFilter);

buttonAddTask.addEventListener('click', createTask);

window.onload = () => {
    showAllTasks();
}


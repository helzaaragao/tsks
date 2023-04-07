const jwt = localStorage.getItem('jwt');
import getUser from './helpers.js';

async function userInfoShow() {
  const userResponse = await getUser(jwt);
  if (userResponse === 'invalid token') {
    window.location.href = './index.html';
  } else {
    const profileButton = document.querySelector('#user-button-text');
    const userName = document.querySelector('#user-name');
    const userEmail = document.querySelector('#user-email');
    const header = document.querySelector('header');
    const skelleton = document.querySelector('#skelleton');
    const content = document.querySelector('#content');
    userName.innerText = `${userResponse.firstName} ${userResponse.lastName}`;
    userEmail.innerText = userResponse.email;
    profileButton.innerText = `${userResponse.firstName.slice(0, 1)}${userResponse.lastName.slice(0, 1)}`;
    skelleton.classList.add('hidden');
    header.classList.remove('hidden');
    content.classList.remove('hidden');
  }
}

window.addEventListener('load', () => {
  if (jwt === null || jwt === undefined || jwt === '') {
    window.location.href = './index.html';
  } else {
    // userInfoShow();
  }
});

const timelineDate = document.querySelector('#date');
const date = new Date();
const options = { month: 'short', day: 'numeric', weekday: 'short' };
timelineDate.innerText = date
  .toLocaleDateString('pt-Br', options)
  .toUpperCase()
  .replaceAll('.', '');

const baseUrl = 'https://todo-api.ctd.academy/v1';

async function getTasks() {
  const config = {
    method: 'GET',
    headers: {
      authorization: jwt,
    },
  };
  try {
    const response = await fetch(`${baseUrl}/tasks`, config);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function deleteTask(id) {
  const config = {
    method: 'DELETE',
    headers: {
      authorization: jwt,
    },
  };
  try {
    const response = await fetch(`${baseUrl}/tasks/${id}`, config);
    const data = await response.json();
    console.log(data);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
}

const pendentTasksContainer = document.querySelector('#pendent-container');

const completedTasksContainer = document.querySelector('#completed-container');

function createTask(description, createdAt, completed, id) {
  const taskCard = document.createElement('div');
  taskCard.classList.add(
    'bg-base-200',
    'sm:w-1/2',
    'px-4',
    'flex',
    'rounded-md',
    'justify-between'
  );

  const taskText = document.createElement('div');

  const checkboxTask = document.createElement('input');
  checkboxTask.type = 'checkbox';
  checkboxTask.classList.add('checkbox', 'checkbox-secondary', 'rounded-full');
  checkboxTask.checked = completed;

  const labelTask = document.createElement('label');
  labelTask.innerText = description;

  taskText.appendChild(checkboxTask);
  taskText.appendChild(labelTask);

  const taskInfo = document.createElement('div');
  taskInfo.classList.add(
    'flex',
    'flex-col',
    'h-ful',
    'justify-between',
    'items-end',
    'w-1/4',
    'pt-1'
  );

  const taskDate = document.createElement('span');
  const dateAtTask = new Date(createdAt.slice(0, createdAt.indexOf('T')));
  taskDate.innerText = dateAtTask.toLocaleDateString('pt-BR');
  taskDate.classList.add('text-sm');

  const taskTrash = document.createElement('i');
  taskTrash.classList.add(
    'fi',
    'fi-rr-trash',
    'text-white',
    'text-lg',
    'cursor-pointer'
  );
  taskTrash.addEventListener('click', () => deleteTask(id));

  taskInfo.appendChild(taskTrash);
  taskInfo.appendChild(taskDate);

  taskCard.appendChild(taskText);
  taskCard.appendChild(taskInfo);

  if (!completed) {
    taskText.classList.add(
      'flex',
      'items-center',
      'gap-4',
      'text-white',
      'w-full'
    );
  } else {
    taskText.classList.add(
      'flex',
      'items-center',
      'gap-4',
      'line-through',
      'w-full'
    );
  }

  return taskCard;
}

async function showPendentTasks() {
  const tasks = await getTasks();

  tasks.forEach(({ description, createdAt, completed, id }) => {
    if (!completed) {
      const task = createTask(description, createdAt, completed, id);
      pendentTasksContainer.appendChild(task);
    } else {
      const emptyMsg = document.createElement('span');
      emptyMsg.innerText = 'Ainda não há nenhuma tarefa!';
      pendentTasksContainer.appendChild(emptyMsg);
    }
  });
}

showPendentTasks();

async function showCompletedTasks() {
  const tasks = await getTasks();

  tasks.forEach(({ description, createdAt, completed, id }) => {
    if (completed) {
      const task = createTask(description, createdAt, completed, id);
      completedTasksContainer.appendChild(task);
    } else {
      const emptyMsg = document.createElement('span');
      emptyMsg.innerText = 'Sem tarefas por aqui!';
      completedTasksContainer.appendChild(emptyMsg);
    }
  });
}

showCompletedTasks();

const search = document.querySelector('#search');

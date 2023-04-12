const baseUrl = 'https://todo-api.ctd.academy/v1';

export async function getUser(jwt) {
    const config = {
        method: 'GET',
        headers: {
            authorization: jwt,
        }
    };
    try {
        const response = await fetch(`${baseUrl}/users/getMe`, config);
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}


export async function getTasks(jwt) {
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

  export async function deleteTask(id, jwt) {
    const config = {
      method: 'DELETE',
      headers: {
        authorization: jwt,
      },
    };
    try {
      const response = await fetch(`${baseUrl}/tasks/${id}`, config);
      return response.status;
    } catch (error) {
      console.log(error);
    }
  }

  export async function postTask(jwt, value) {
    const config = {
      method: 'POST',
      body: JSON.stringify({description: value,}),
      headers: {
        authorization: jwt,
        'Content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(`${baseUrl}/tasks`, config);
      const data = await response.json();
      return data;
    } catch (error) {
      return error
    }
  }

  export async function updateTask(jwt, body, id) {
    const config = {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        authorization: jwt,
        'Content-type': 'application/json',
      },
    };
    try {
      const response = await fetch(`${baseUrl}/tasks/${id}`, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
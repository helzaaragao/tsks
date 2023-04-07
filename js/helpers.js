const baseUrl = 'https://todo-api.ctd.academy/v1';

export default async function getUser(jwt) {
    const config = {
        method: 'GET',
        headers: {
            'authorization': jwt,
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


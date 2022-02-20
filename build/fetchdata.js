
const base_url = "https://reminder-extension.herokuapp.com/v1/reminders/";

//Authorization: `token ${token}`
const getoptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_code')}`
    }
}

export async function apicall() {
    let response = null;
    response = await fetch(base_url, getoptions);
    return response.json();
}


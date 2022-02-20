

chrome.contextMenus.create({ id: "Reminder", title: "View Reminder", contexts: ["all"] });

chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true },
        tabs => { chrome.tabs.sendMessage(tabs[0].id, { type: "viewReminder" }); });
});


const base_url = "https://reminder-extension.herokuapp.com/v1/reminders/";

//Authorization: `token ${token}`
const getoptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNjQ1MzkyOTM5LCJleHAiOjE2NDUzOTY1Mzl9.GFcr0CXP0A_vIAekcBHoDIi9cRkRMixAUjsCt70pbM0`
    }
}

async function apicall() {
    let response = null;
    response = await fetch(base_url, getoptions);
    return await response.json();
}

//run a refresh every minute to check if a reminder has expired
setInterval(async function () {
    const response = await apicall();
    const reminderArray = response?.data?.reminders;
    let expiredArray = [];
    const auth_code =  chrome.storage.local.get('reminder_authentication');

    console.log(auth_code);
    for (var i = 0; i < reminderArray.length; i++) {

        reminderArray.forEach(element => {
            const tDiff = (Date.parse(element.event_date) - Date.parse(new Date()));

            // To calculate the no. of days between two dates
            var Difference_In_Days = (tDiff / (1000 * 3600 * 24)).toFixed(0);
            if (Difference_In_Days >= 5) {
                expiredArray.push({
                    title: element.title,
                    date: Date.parse(element.event_date)
                })
            }
        });
    }

    //send all of the reminders to the popup
    chrome.runtime.sendMessage({ expiredReminders: expiredArray, cmd: "sendAll" }, function () {
        console.log('message sent')
    });
}, 60000);
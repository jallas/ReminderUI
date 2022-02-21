

chrome.contextMenus.create({ id: "Reminder", title: "View Reminder", contexts: ["all"] });

chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true },
        tabs => { chrome.tabs.sendMessage(tabs[0].id, { type: "viewReminder" }); });
});

const base_url = "https://reminder-extension.herokuapp.com/v1/reminders/";

async function apicall(auth) {
    let response = null;
    response = await fetch(base_url, { method: 'GET', headers: { 'Authorization': `Bearer ${auth}` } });
    return await response.json();
}

//run a refresh every minute to check if a reminder has expired
setInterval(async function () {
    chrome.storage.local.get(['reminder_authentication'], async function (code) {
        const response = await apicall(code.reminder_authentication);
        const reminderArray = response?.data?.reminders;
        let expiredArray = [];

        if (reminderArray !== null && reminderArray !== undefined) {
            if (reminderArray?.length > 0) {
                for (var i = 0; i < reminderArray.length; i++) {
                    reminderArray.forEach(element => {
                        const tDiff = (Date.parse(element.event_date) - Date.parse(new Date()));
                        // To calculate the no. of days between two dates
                        var Difference_In_Days = (tDiff / (1000 * 3600 * 24)).toFixed(0);
                        if (Difference_In_Days >= 2) {
                            expiredArray.push({
                                title: element.title,
                                date: Date.parse(element.event_date)
                            })
                        }
                    });
                }

                //send all of the reminders to the popup
                if (expiredArray.length > 0) {
                    chrome.storage.local.set({ 'expiredReminder': expiredArray }, function () {
                        console.log('expiredReminder dispatched')
                    });
                    chrome.windows.create({
                        focused: true,
                        width: 400,
                        height: 400,
                        type: 'popup',
                        url: 'popup.html',
                        top: 0,
                        left: 0
                    },
                        () => { })
                }
            }
        }
    });
}, 60000);
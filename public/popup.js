window.onload = function() {
    chrome.storage.local.get(['expiredReminder'], function(items) {
        console.log(items.expiredReminder,'expiredReminder');
      });
}

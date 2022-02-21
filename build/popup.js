window.onload = function() {
    //var loadedTime = Date();

    chrome.storage.local.get(['expiredReminder'], function(items) {
        console.log(items.expiredReminder,'expiredReminder');
      });


    // //onloading send a handshake to the background script
    // chrome.runtime.sendMessage({msg: "handshake",cmd:"handshake", date: loadedTime},
    //     function (response) {
    //     });

    // //now listen for the handshake to be received, should return all data stored
    // chrome.runtime.onMessage.addListener(
    //     function(request, sender, sendResponse) {
    //         if (request.cmd === "sendAll"){
               
    //             console.log(request);
    //         }
    //     }
    // );
}

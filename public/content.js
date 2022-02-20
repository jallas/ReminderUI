chrome.runtime.onMessage.addListener(request => {
    if (request.type === "viewReminder") {

        const modal = document.createElement("dialog");
        modal.setAttribute("style", "height:100%;width:100vw;overflow:hidden");
        modal.innerHTML =
            `<iframe id="reminderfetcher" style="width:100%; height:100%;overflow:auto;border: 0" frameBorder="0"></iframe>
        <div style="position:absolute; top:0px; justify-content: flex-end;padding: 10px 0;display: flex">  
            <button>x</button>
        </div>`;
        document.body.appendChild(modal);
        const dialog = document.querySelector("dialog");
        dialog.showModal();

        const iframe = document.getElementById("reminderfetcher");
        iframe.src = chrome.extension.getURL("index.html");
        iframe.frameBorder = 0;

        dialog.querySelector("button").addEventListener("click", () => {
            dialog.close();
        });
    }
})

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request,"hello");
});
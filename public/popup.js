window.onload = function () {
  chrome.storage.local.get(['expiredReminder'], function (items) {
    console.log(items.expiredReminder, 'expiredReminder');

    if (items.expiredReminder !== null && items.expiredReminder !== undefined) {
      items?.expiredReminder.forEach(element => {
        let records  = `<div class="card">
          <div class="card-header" id="headingOne${element.id}">
            <h5 class="mb-0">
              <button class="btn btn-link" data-toggle="collapse" data-target="#collapseOne${element.id}" aria-expanded="true" aria-controls="collapseOne${element.id}">
                ${element.title}
              </button>
            </h5>
          </div>
          <div id="collapseOne${element.id}" class="collapse" aria-labelledby="headingOne${element.id}" data-parent="#accordion">
            <div class="card-body">
             ${element.details}
            </div>
          </div>
        </div>`;
        var d = document.getElementById("accordion");
        d.insertAdjacentHTML('afterend',records);
      });
    }
  });
}

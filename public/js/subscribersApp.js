$(document).ready(() => {
  $("#modal-btn").click(() => {
    $(".subscribers-body").html("");
    $.get("/api/subscribers", (results = {}) => {
      let data = results.data;
      if (!data || !data.subscribers) return;
      data.subscribers.forEach((subscriber) => {
        $(".subscribers-body").append(`
          <div class="media text-left ">
            <div class="align-self-start mr-3">
              <i class="fal fa-users h5 text-secondary"></i>
            </div>
            <div class="media-body">
              <h5 class="course-title mt-0">${subscriber.name}</h5>
              <p class="course-description"> ${subscriber.email}</p>
              <p class="course-description"> ${subscriber.zipCode}</p>
            </div>
          </div>
        `);
      });
    });
  });
});

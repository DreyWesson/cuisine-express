$(document).ready(() => {
  $("#modal-buttn").click(() => {
    $(".users-body").html("");
    $.get("/api/users", (results = {}) => {
      let data = results.data;
      if (!data || !data.users) return;
      data.users.forEach((user) => {
        $(".users-body").append(`
          <div class="media text-left ">
            <div class="align-self-start mr-3">
              <i class="far fa-user h5 text-secondary"></i>
            </div>
            <div class="media-body">
              <h5 class="mt-0">${user.name.first} ${user.name.last}</h5>
              <p>${user.email}</p>
            </div>
          </div>
        `);
      });
    });
  });
});

$(document).ready(() => {
  $("#modal-buttons").click(() => {
    $(".body-content").html("");
    $.get(`/courses?format=json`, (course) => {
      $(".body-content").append(
        `<div>
          <span class="course-title"> ${course.title}
          </span>
          <div class="course-description"> ${course.description}
          </div>
        </div>`
      );
    });
  });
});

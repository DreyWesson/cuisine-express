$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach((course) => {
        $(".modal-body").append(`
        <div class="media text-left ">
        <div class="align-self-start mr-3">
        <i class="far fa-book h5 text-secondary"></i>
        </div>
        <div class="media-body">
        <h5 class="course-title mt-0">${course.title}</h5>
        <p class="course-description"> ${course.description}
        </p>
        </div>
        <button 
        class='btn btn-outline-secondary mr-2 ${
          course.joined ? "btn-outline-success" : "btn-outline-primary"
        }' data-id="${course._id}">
        ${course.joined ? "Joined" : "Join"}
        </button>
        <button class="join-button btn btn-outline-primary align-self-start" data-id="${
          course._id
        }"> Join</button>
        </div>
        `);
      });
    }).then(() => {
      addJoinButtonListener();
    });
  });
});
let addJoinButtonListener = () => {
  $(".join-button").click((event) => {
    let $button = $(event.target),
      courseId = $button.data("id");
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      if (data && data.success) {
        $button
          .text("Joined!")
          .addClass("btn-outline-success")
          .removeClass("btn-outline-primary");
      } else {
        $button.text("Try again");
      }
    });
  });
};

const socket = io();
$("#chatForm").submit(() => {
  let text = $("#chat-input").val(),
    userId = $("#chat-user-id").val();
  socket.emit("message", {
    content: text,
    userId: userId,
  });
  $("#chat-input").val("");
  return false;
});
socket.on("message", (message) => {
  displayMessage(message);
});

let displayMessage = (message) => {
  $("#chat").prepend(
    $("<li>").html(`
  <div class="message ${getCurrentUserClass(message.user)}"> ${message.content}
  </div>`)
  );
};
let getCurrentUserClass = (id) => {
  let userId = $("#chat-user-id").val();
  return userId === id ? "current-user" : "";
};

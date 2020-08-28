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
    userName = $("#chat-user-name").val(),
    userId = $("#chat-user-id").val();
  socket.emit("message", {
    content: text,
    userName: userName,
    userId: userId,
  });
  $("#chat-input").val("");
  return false;
});
socket.on("message", (message) => {
  displayMessage(message);
  for (let i = 0; i < 3; i++) {
    $(".chat-icon").fadeOut(200).fadeIn(200);
  }
});

let displayMessage = (message) => {
  $("#chat").append(
    $("<li>").html(`
    <div class="d-flex">
      <small class="m-2">${message.userName}:</small>
      <div class="message ${getCurrentUserClass(message.user)} m-2"> 
        ${message.content}
      </div>
    </div>
  `)
  );
};
let getCurrentUserClass = (id) => {
  let userId = $("#chat-user-id").val();
  return userId === id ? "current-user" : "";
};
socket.on("load all messages", (data) => {
  data.forEach((message) => {
    displayMessage(message);
  });
});
socket.on("user disconnected", () => {
  console.log("User disconnected");
  displayMessage({
    userName: "Notice",
    content: "User left the chat",
  });
});
socket.on("user connected", () => {
  console.log("User connected");
  displayMessage({
    userName: "Notice",
    content: "User joined the chat",
  });
});

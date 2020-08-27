const Message = require("../models/message");
const User = require("../models/user");

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("new connection");

    Message.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .then((messages) => {
        client.emit("load all messages", messages.reverse());
      });

    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnected");
    });

    client.on("message", (data) => {
      let messageAttributes = {
          content: data.content,
          userName: data.userName,
          user: data.userId,
        },
        m = new Message(messageAttributes);
      if (User.findById(data.userId)) {
        m.save()
          .then(() => io.emit("message", messageAttributes))
          .catch((error) => console.log(`error: ${error.message}`));
      } else {
        console.log("User not found");
      }
    });
  });
};

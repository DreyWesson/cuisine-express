// var courses = [
//   { title: "Event Driven Cakes", cost: 50 },
//   { title: "Asynchronous Artichoke", cost: 25 },
//   { title: "Object Oriented Orange Juice", cost: 10 },
// ];

module.exports = {
  showHome: (req, res) => {
    res.render("../views/index");
  },
  chat: (req, res) => {
    res.render("chat");
  },
};

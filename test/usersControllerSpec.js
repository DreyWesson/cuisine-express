const chai = require("chai"),
  { expect } = chai,
  usersController = require("../controllers/usersController");

describe("usersController", () => {
  describe("getUserParams", () => {
    it("should convert request body to contain", () => {
      var body = {
        first: "Jon",
        last: "Wexler",
        email: "jon@jonwexler.com",
        password: 12345,
        zipCode: 10016,
      };

      expect(usersController.getUserParams(body)).to.deep.include({
        name: {
          first: "Jon",
          last: "Wexler",
        },
      });
    });
    it("should return an empty object with empty request ➥ body input", () => {
      var emptyBody = {};
      expect(usersController.getUserParams(emptyBody)).to.deep.include({});
    });
  });
});

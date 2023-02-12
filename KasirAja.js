const { faker } = require("@faker-js/faker");
const request = require("supertest");
const { expect } = require("chai");
const { describe } = require("mocha");

const baseUrl = "https://kasir-api.belajarqa.com";
const cashierName = faker.internet.userName();
const cashierEmail = faker.internet.exampleEmail();
const password = "12345678";
const newCashierName = faker.internet.userName();
const newCashierEmail = faker.internet.exampleEmail();
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTc1OWQ5LTNmYjMtNDIzZS04MzY4LWUyNjU3YTg1ZTQ1ZiIsImNvbXBhbnlJZCI6IjRjZDMyNDA3LTI3NmQtNGJhOS05ZThiLWU2NzY2N2M1M2Q4NyIsImlhdCI6MTY3NTU5ODEyNn0.AwCEr-XDlBmV6TKtsX94twtioF86vm9TxQcE2VXkJ2I";

var response, userId;

describe("kasirAja API testing", () => {

  describe("Success create a cashier for toko", () => {
    before(async () => {
      response = request(baseUrl)
        .post("/users")
        .set("Authorization", "Bearer " + accessToken)
        .send({
          name: cashierName,
          email: cashierEmail,
          password: password,
        });
    });

    it("Response status equal 201", async () => {
      expect((await response).status).to.equal(201);
    });

    it("Should have success status in body.status", async () => {
      expect((await response).body.status).to.equal("success");
    });

    it(`Should have "User berhasil ditambahkan" message in body.message`, async () => {
      expect((await response).body.message).to.equal(
        "User berhasil ditambahkan"
      );
    });

    it(`Should return correct cashier name`, async () => {
      expect((await response).body.data.name).to.equal(cashierName);
    });

    it(`Success save userId`, async () => {
      userId = (await response).body.data.userId;
    });
  });

  describe(`Success get detail data from: "${cashierName}"`, () => {
    before(async () => {
      response = request(baseUrl)
        .get(`/users/${userId}`)
        .auth(accessToken, { type: "bearer" });
    });

    it("Response status equal 200", async () => {
      expect((await response).status).to.equal(200);
    });

    it("Should have success status in body.status", async () => {
      expect((await response).body.status).to.equal("success");
    });

    it(`Should return correct user id`, async () => {
      expect((await response).body.data.user.id).to.equal(userId);
    });

    it(`Should return correct cashier name`, async () => {
      expect((await response).body.data.user.name).to.equal(cashierName);
    });

    it(`Should return correct cashier email`, async () => {
      expect((await response).body.data.user.email).to.equal(cashierEmail);
    });

    it(`Should return correct user role (kasir)`, async () => {
      expect((await response).body.data.user.role).to.equal("kasir");
    });
  });

  describe(`Success change name user: "${cashierName}" to "${newCashierName}"`, () => {
    before(async () => {
      response = request(baseUrl)
        .put(`/users/${userId}`)
        .auth(accessToken, { type: "bearer" })
        .send({
          name: newCashierName,
          email: newCashierEmail,
        });
    });

    it("Response status equal 200", async () => {
      expect((await response).status).to.equal(200);
    });

    it("Should have success status in body.status", async () => {
      expect((await response).body.status).to.equal("success");
    });

    it(`Should have "User berhasil diupdate" message in body.message`, async () => {
      expect((await response).body.message).to.equal("User berhasil diupdate");
    });

    it(`Should return correct new cashier name`, async () => {
      expect((await response).body.data.name).to.equal(newCashierName);
    });
  });

  describe(`Success delete user: "${newCashierName}"`, () => {
    before(async () => {
      response = request(baseUrl)
        .delete(`/users/${userId}`)
        .auth(accessToken, { type: "bearer" });
    });

    it("Response status equal 200", async () => {
      expect((await response).status).to.equal(200);
    });

    it("Should have success status in body.status", async () => {
      expect((await response).body.status).to.equal("success");
    });

    it(`Should have "User berhasil dihapus" message in body.message`, async () => {
      expect((await response).body.message).to.equal("User berhasil dihapus");
    });
  });
});

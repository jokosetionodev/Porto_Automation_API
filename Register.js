const request_url = require("supertest")("http://barru.pythonanywhere.com");
const assert = require("chai").expect;

describe("feature register", function () {
  //Test Scenario
  it("Verify succes register with valid email, password and username", async function () {
    //descripsi
    const response = await request_url.post("/register").send({
      email: "Jaaksulur@gmail.com",
      password: "jeck",
      name: "jaka",
    });

    const isi_data = response.body;

    assert(response.body.data).to.equal("berhasil");
    assert(response.body.status).to.equal("SUCCESS_REGISTER");
    assert(response.body.message).to.equal("created user!");
    assert(isi_data).to.include.keys("data", "message", "status");
  });

  it("verify failed register with email already register", async function () {
    const response = await request_url.post("/register").send({
      email: "jeck@gmail.co.id",
      password: "jeckOK",
      name: "Jeck",
    });

    const isi_data = response.body;

    assert(response.body.data).to.equal(
      "Email sudah terdaftar, gunakan Email lain"
    );
    assert(response.body.status).to.equal("FAILED_REGISTER");
    assert(response.body.message).to.equal("Gagal Registrasi");
    assert(isi_data).to.include.keys("data", "message", "status");
  });

  it("Verify failed register with email and password is invalid or empty", async function () {
    const response = await request_url
      .post("/register")
      .send({ email: "", password: "", name: "jaka" });

    const isi_data = response.body;

    assert(response.body.data).to.equal(
      "Email/Username/Password tidak boleh kosong"
    );
    assert(response.statusCode).to.equal(422);
    assert(isi_data).to.include.keys("data", "message", "status");
  });
  it("Verification failed to register with invalid or malformed email", async function () {
    const response = await request_url.post("/register").send({
      email: "joko  gmail.com",
      password: "jakiwe",
      name: "jaka",
    });

    const isi_data = response.body;

    assert(response.body.data).to.equal("Email tidak valid");
    assert(response.statusCode).to.equal(422);
    assert(response.body.message).to.equal("Cek kembali email anda");
    assert(isi_data).to.include.keys("data", "message", "status");
  });

  it("Verification failed to register with name and password include symbol", async function () {
    const response = await request_url.post("/register").send({
      email: "jok@gmail.com",
      password: "@jakiwe",
      name: "jaka&5!",
    });

    const isi_data = response.body;

    assert(response.body.data).to.equal("Nama atau password tidak valid");
    assert(response.statusCode).to.equal(422);
    assert(response.body.message).to.equal("Tidak boleh mengandung symbol");
    assert(isi_data).to.include.keys("data", "message", "status");
  });
});

describe("max Char", function () {
  it("verify failed register with max char in email field", async function () {
    let max_email = Array.from(Array(55), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
    const response = await request_url.post("/register").send({
      email: max_email + "@gmail.com",
      password: "joni",
      name: "janjan",
    });
    const isi_data = response.body;

    assert(response.body.data).to.equal(
      "Email/Username/Password melebihin maksimal karakter"
    );
    assert(response.statusCode).to.equal(422);
    assert(response.body.message).to.equal("Gagal Registrasi");
    assert(isi_data).to.include.keys("data", "message", "status");
  });
  it("succes register with field random", async function () {
    let random_email = Math.random().toString(36).substring(7);
    let random_password = Math.random().toString(36).substring(5);
    let random_name = Math.random().toString(36).substring(6);

    const response = await request_url.post("/register").send({
      email: random_email + "@gmail.com",
      password: random_password,
      name: random_password,
    });
    const isi_data = response.body;
    assert(response.body.data).to.equal("berhasil");
    assert(response.body.status).to.equal("SUCCESS_REGISTER");
    assert(response.body.message).to.equal("created user!");
    assert(isi_data).to.include.keys("data", "message", "status");
  });
});

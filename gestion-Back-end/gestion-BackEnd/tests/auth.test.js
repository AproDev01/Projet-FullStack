import request from "supertest";
import { clearDatabase, closeDatabase, connect } from "./setup";
import app from "..";

beforeAll(async () => {
  await connect();
});

// afterEach(async () => {

// });

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe("User Auth Test API", () => {
  it("POST /auth/register -> créer un utilisateur", async () => {
    const res = await request(app).post("/auth/register").send({
      nom: "Doe",
      prenom: "John",
      email: "john.doe@example.com",
      password: "password123",
      role: "USER",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "the user register");
  });

  it("POST /auth/login -> connecter un utilisateur", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "valid");
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/login -> échec de la connexion avec des informations invalides", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "invalid");
  });
});

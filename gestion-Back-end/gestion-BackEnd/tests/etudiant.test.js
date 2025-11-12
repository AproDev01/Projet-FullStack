import request from "supertest";
import { clearDatabase, closeDatabase, connect } from "./setup";
import app from "..";
import Etudiant from "../models/Etudiant";

beforeAll(async () => {
  await connect();
});

// afterEach(async () => {

// });
afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe("Etudiant Test API", () => {
  it("POST /etudiants -> créer un étudiant", async () => {
    const res = await request(app)
      .post("/etudiants")
      .send({
        id: 2,
        nom: "Doe",
        prenom: "John",
        email: "john.doe@example.com",
        matiere: ["Math", "Physics"],
      });
    expect(res.statusCode).toEqual(201);
    const etudiant = await Etudiant.findOne({ id: 2 });
    expect(etudiant).toBeDefined();
    expect(etudiant.nom).toBe("Doe");
    expect(etudiant.prenom).toBe("John");
    expect(etudiant.email).toBe("john.doe@example.com");
    expect(etudiant.matiere).toContain("Math");
  });

  it("GET /etudiants -> récupérer tous les étudiants", async () => {
    await Etudiant.create({
      id: 3,
      nom: "Smith",
      prenom: "Jane",
      email: "jane.smith@example.com",
      matiere: ["Biology", "Chemistry"],
    });
    const res = await request(app).get("/etudiants");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].nom).toBe("Doe");
    expect(res.body[1].nom).toBe("Smith");
  });

  it("GET /etudiants/:id -> récupérer un étudiant par ID", async () => {
    const res = await request(app).get("/etudiants/2");
    expect(res.statusCode).toEqual(200);
    expect(res.body.nom).toBe("Doe");
    expect(res.body.prenom).toBe("John");
  });

  it("PUT /etudiants/:id -> mettre à jour un étudiant", async () => {
    const res = await request(app)
      .put("/etudiants/2")
      .send({
        nom: "Doe",
        prenom: "Johnny",
        email: "johnny.doe@example.com",
        matiere: ["Math", "Physics", "Testing"],
      });
    expect(res.statusCode).toEqual(200);
    const etudiant = await Etudiant.findOne({ id: 2 });
    expect(etudiant).toBeDefined();
    expect(etudiant.nom).toBe("Doe");
    expect(etudiant.prenom).toBe("Johnny");
    expect(etudiant.email).toBe("johnny.doe@example.com");
    expect(etudiant.matiere).toContain("Testing");
  });

  it("DELETE /etudiants/:id -> supprimer un étudiant", async () => {
    const res = await request(app).delete("/etudiants/2");
    expect(res.statusCode).toEqual(204);
    const etudiant = await Etudiant.findOne({ id: 2 });
    expect(etudiant).toBeNull();
  });
});

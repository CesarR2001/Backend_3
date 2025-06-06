import supertest from "supertest";
import { expect } from "chai";

const requester = supertest("http://localhost:8080");

describe("Testing de la App Web Adoptame", () => {
  describe("Testing de Adopciones", () => {

    let createdAdoptionId;

    //Reemplazamos estos IDs por datos válidos en tu DB que no este usados
    const validUserId = "6841058ae80f60b4f3cbd54c"; 
    const validPetId = "6819308f835974a24d1dfd30"; 
    const nonExistentId = "aaaaaaaaaaaaaaaaaaaaaaaa"; // ID válido pero no existente

    // ✅ 1. Obtener todas las adopciones
    it("GET /api/adoptions debería devolver un array con todas las adopciones", async () => {
      const { statusCode, _body } = await requester.get("/api/adoptions");
      expect(statusCode).to.equal(200);
      expect(_body.payload).to.be.an("array");
    });

    // ✅ 2. Crear una adopción válida
    it("POST /api/adoptions/:uid/:pid debería crear una adopción", async () => {
      const { statusCode, _body } = await requester.post(`/api/adoptions/${validUserId}/${validPetId}`);
      expect(statusCode).to.equal(201);
      expect(_body.status).to.equal("success");
      expect(_body.payload).to.have.property("_id");
      createdAdoptionId = _body.payload._id;
    });

    // ✅ 3. Error al crear adopción con IDs mal formateados
    it("POST /api/adoptions/abc/xyz debería devolver 400 por IDs mal formateados", async () => {
      const { statusCode, _body } = await requester.post("/api/adoptions/abc/xyz");
      expect(statusCode).to.equal(400);
      expect(_body.error).to.equal("Invalid user or pet ID format");
    });

    // ✅ 4. Error al crear adopción con usuario inexistente
    it("POST /api/adoptions/:uid/:pid con usuario inexistente debería devolver 404", async () => {
      const res = await requester.post(`/api/adoptions/${nonExistentId}/${validPetId}`);
      expect(res.statusCode).to.equal(404);
    });

    // ✅ 5. Error al crear adopción con mascota inexistente
    it("POST /api/adoptions/:uid/:pid con mascota inexistente debería devolver 404", async () => {
      const res = await requester.post(`/api/adoptions/${validUserId}/${nonExistentId}`);
      expect(res.statusCode).to.equal(404);
    });

    // ✅ 6. Obtener adopción por ID
    it("GET /api/adoptions/:aid debería devolver una adopción específica", async () => {
      const { statusCode, _body } = await requester.get(`/api/adoptions/${createdAdoptionId}`);
      expect(statusCode).to.equal(200);
      expect(_body.payload).to.have.property("_id", createdAdoptionId);
    });

    // ✅ 7. Obtener adopción con ID inexistente
    it("GET /api/adoptions/:aid con ID inexistente debería devolver 404", async () => {
      const { statusCode } = await requester.get(`/api/adoptions/${nonExistentId}`);
      expect(statusCode).to.equal(404);
    });

    // ✅ 8. Obtener adopción con ID mal formado
    it("GET /api/adoptions/:aid con ID inválido debería devolver 400", async () => {
      const { statusCode, _body } = await requester.get("/api/adoptions/0");
      expect(statusCode).to.equal(400);
      expect(_body.error).to.equal("Invalid adoption ID format");
    });

  });
});

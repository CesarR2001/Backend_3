import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

router.get("/mockingpets", mocksController.createPets);
router.get("/mockingusers", mocksController.createUsers);
router.post("/generateData", mocksController.generateData);

export default router;
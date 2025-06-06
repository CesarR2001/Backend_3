import mongoose from "mongoose";
import { adoptionsService, petsService, usersService } from "../services/index.js";

const getAllAdoptions = async (req, res) => {
  try {
    const result = await adoptionsService.getAll();
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const getAdoption = async (req, res) => {
  try {
    const adoptionId = req.params.aid;

    if (!mongoose.Types.ObjectId.isValid(adoptionId)) {
      return res.status(400).send({ status: "error", error: "Invalid adoption ID format" });
    }

    const adoption = await adoptionsService.getBy({ _id: adoptionId });

    if (!adoption) {
      return res.status(404).send({ status: "error", error: "Adoption not found" });
    }

    res.send({ status: "success", payload: adoption });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

const createAdoption = async (req, res) => {
  try {
    const { uid, pid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid) || !mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).send({ status: "error", error: "Invalid user or pet ID format" });
    }

    const user = await usersService.getUserById(uid);
    if (!user) {
      return res.status(404).send({ status: "error", error: "User not found" });
    }

    const pet = await petsService.getBy({ _id: pid });
    if (!pet) {
      return res.status(404).send({ status: "error", error: "Pet not found" });
    }

    if (pet.adopted) {
      return res.status(400).send({ status: "error", error: "Pet is already adopted" });
    }

    // Asociar la mascota al usuario
    user.pets.push(pet._id);
    await usersService.update(user._id, { pets: user.pets });

    // Marcar mascota como adoptada
    await petsService.update(pet._id, { adopted: true, owner: user._id });

    // Registrar adopción
    const newAdoption = await adoptionsService.create({ owner: user._id, pet: pet._id });

    res.status(201).send({ status: "success", payload: newAdoption });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", error: "Internal server error" });
  }
};

export default {
  createAdoption,
  getAllAdoptions,
  getAdoption
};

import mockingService from "../services/mocking.js";

    const createPets = async (req, res) => {
        try {
            const pets = await mockingService.generatePetsMocking(50);
            res.send({ status: "Exitoso", payload: pets });
            } catch (error) {
            res.status(500).send({ status: "Error", message: error.message });
            }
    } 

    const createUsers = async (req, res) => {
        try {
        const users = await  mockingService.generateUsersMocking(50);
        res.send({ status: "Exitoso", payload: users });
        } catch (error) {
        res.status(500).send({ status: "Error", message: error.message });
        }
    };

    const generateData = async (req, res) => {
            try {
                const { users, pets } = req.body; // Recibimos los parámetros 'users' y 'pets'
        
                const { insertUsers, insertPets } = await mockingService.generateDataAndSave(users,pets)
                res.send({
                status: "Exitoso",
                message: `${insertUsers.length} usuarios y ${insertPets.length} mascotas generados e insertados en la base de datos.`,
                });
            } catch (error) {
                res.status(500).send({ status: "Error", message: error.message });
            }
            };

export default {createPets, createUsers, generateData}



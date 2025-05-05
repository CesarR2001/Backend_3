import { faker } from "@faker-js/faker";
import { createHash } from "../utils/index.js";
import { usersService,petsService } from "./index.js";

class mockingService {

        static async generatePetsMocking (number){
            const pets = [];
            for(let i =0; i < number; i++)
            {
                pets.push(
                    {
                        name: faker.animal.dog(),
                        specie: faker.animal.type(),
                        adopted: false,
                        birthDate: faker.date.past(),
                        image: "https://via.placeholder.com/150"
                    }
                )
            }
        return pets;
        }

        // Generar usuarios
        static async generateUsersMocking(number = 10) {
    
            const users = [];
            for (let i = 0; i < number; i++) {
            const passwordHash = await createHash("coder123"); // Usamos createHash para encriptar la contraseña

            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: passwordHash,
                role: Math.random() < 0.8 ? "user" : "admin", // 80% usuarios, 20% admins
                pets: [] // Array vacío para las mascotas
            });
            }
            return users;
        }

        static async generateDataAndSave(usersCount, petsCount) {
            const mockedUser = await this.generateUsersMocking(usersCount);
            const mockedPets = await this.generatePetsMocking(petsCount);
            // Guardar usuarios usando el UserRepository (ya configurado con el DAO)
            const insertUsers = await Promise.all(mockedUser.map(user => usersService.create(user)));
            // Guardar mascotas usando el PetRepository (ya configurado con el DAO)
            const insertPets = await Promise.all(mockedPets.map(pet =>petsService.create(pet)))
            return { insertUsers, insertPets };
        }


}

export default mockingService
//npm install -D mocha
import mongoose from "mongoose";
import assert  from "assert";
import { connectMongoDB } from '../src/config/mongoDB.config.js'
//Modulo nativo de Node JS que nos permite hacer las validaciones
import User from "../src/dao/Users.dao.js"; 


//Me conecto aca a la base de datos: 
connectMongoDB();
//describe: es una función que me permite agrupar un conjunto de pruebas relacionadas bajo un mismo bloque descriptivo. 

 describe("Testeamos el DAO de usuarios", function() {

    before(function() {
        this.userDao = new User()
    })

    //Limpiamos la base de datos cada vez que testeamos
    beforeEach(async function() {
        await mongoose.connection.collections.users.drop(); 
        this.timeout(5000); 
    })


    //Pruebas: 
    it("El get de usuarios me retorna un array", async function () {
        const resultado = await this.userDao.get(); 
         assert.strictEqual(Array.isArray(resultado), true); 
    })
    
    //test 1: 

    it("El Dao debe agregar correctamente un elemento a la base de datos.", async function (){
        let usuario = {
            first_name: "Goldie", 
            last_name: "Legrand", 
            email: "goldi@legrand.com", 
            password: "1234"
        }

        const resultado = await this.userDao.save(usuario)
        assert.ok(resultado._id); 

    })

    //test 2: 

    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto.", async function () {
         let usuario = {
            first_name: "Goldie", 
            last_name: "Legrand", 
            email: "goldi@legrand.com", 
            password: "1234"
        }

        const resutado = await this.userDao.save(usuario); 
        assert.deepStrictEqual(resutado.pets, []); 
    })

    //test 3: 

    it("El Dao puede obtener  a un usuario por email", async function () {
         let usuario = {
            first_name: "Goldie", 
            last_name: "Legrand", 
            email: "goldi@legrand.com", 
            password: "1234"
        }

       await this.userDao.save(usuario); 

       const user = await this.userDao.getBy({email: usuario.email}); 
       assert.strictEqual(typeof user, "object"); 
    })

    after(async function () {
        await mongoose.disconnect(); 
    })

    

 })
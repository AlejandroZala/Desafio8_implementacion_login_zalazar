import { Router } from "express";
import userModel from "../dao/mongo/models/users.js";

const router = Router();

router.post('/register', async(req, res) => {
    const result = await userModel.create(req.body); //suponiendo que envio todo bien
    res.send({status:"success", payload: result});
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    if(email==="adminCoder@coder.com"&&password==="adminCod3r123"){
        //Desde aquí ya puedo inicializar el Admin
        req.session.user = {
            name: `Admin`,
            role: "admin",
            email: "..."
        }
        return res.send({status:"success"});
    }
    //Busco al usuario, existe?
    const user = await userModel.findOne({email, password});
    if (!user) return res.status(400).send({status:"error", error:"Usuario o contraseña incorrecto"})
    
    //Si existe el usuario, creo una SESION
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }
    res.send({status:"success"});
});

router.post("/logout", (req, res) => {
    // Destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res
            .status(500)
            .send({ status: "error", error: "Error al cerrar sesión" });
        }
        res.send({ status: "success", message: "Sesión cerrada correctamente" });
    });
});

export default router;
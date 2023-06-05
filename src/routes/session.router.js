import { Router } from "express";
import userModel from "../dao/mongo/models/users.js";

const router = Router();

router.post('/register', async(req, res) => {
    const result = await userModel.create(req.body); //suponiendo que envio todo bien
    res.send({status:"success", payload: result});
})

router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    //Busco al usuario, existe?
    const user = await userModel.findOne({email, password});
    if (!user) return res.status(400).send({status:"error", error:"Usuario o contraseña incorrecto"})
    
    //Si existe el usuario, creo una SESION
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
    }
    res.sendStatus(200);
})

export default router;
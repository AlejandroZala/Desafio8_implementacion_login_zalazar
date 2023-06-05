import { Router } from "express";
// import ProductManager from "../dao/fileSystem/Managers/productManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";
import CartManager from "../dao/mongo/Managers/cartManager.js";
import productModel from "../dao/mongo/models/product.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req,res)=>{
    try {
        const { page = 1, sort = 1, limit = 3 } = req.query;
        const options = {
            page,
            limit: parseInt(limit),
            lean: true,
            sort: { price: sort }
        };
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
            await productModel.paginate({}, options);
        const products = docs;

        req.session.prueba={sesion:true};

        res.render('products',{
            user: req.session.user,
            products,
            page: rest.page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            css: 'products'
        });
    } catch (error) {
        res.status(500).send({status:"error", error: "Error al obtener productos"})
    }
});

router.get('/realTimeProducts', async(req,res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {products, css: 'realTimeProducts'});
});

router.get('/carts/:cid', async (req,res)=>{
    const cid = req.params.cid;
    const carts = await cartManager.getCarts();
    const cartSelected = carts.find((cart) => cart._id == cid);
    res.render('cart',{cartSelected})
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/profile', (req, res) => {
    res.render('profile',{
        user: req.session.user
    })
});

router.get('/chat', async (req,res)=>{
    res.render('Chat')
});

export default router;
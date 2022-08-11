import { Router } from "express";
import ProductManager from "../managers/product.manager.js";
import CartManager from "../managers/cart.manager.js";
import admin from "../server.js";

const router = Router();
const productService = new ProductManager();
const cartService = new CartManager();

router.get("/", async (req, res) => {
    let cart = await cartService.getAllCarts();
    res.send(cart);
});

router.post("/", async (req, res) => {
    await cartService.createCart();
    res.send({ status: "success", message: "successfully created" });
});

router.delete("/:cid", async (req, res) => {
    if (!admin) {
        return res.send({
            error: -1,
            descripction: "delete no authorized",
        });
    } else {
        let cart = await cartService.getCartById(Number(req.params.cid));
        if (cart === null) {
            return res
                .status(404)
                .send({ status: "error", error: "cart doesn't exist" });
        } else {
            try {
                await cartService.deleteCardById(Number(req.params.cid));
                res.send({
                    status: "success",
                    message: "successfully deleted",
                });
            } catch (error) {
                return res.status(500).send({
                    status: "error",
                    error: "cart couldn't been deleted",
                });
            }
        }
    }
});
router.get("/:cid/products", async (req, res) => {
    let cart = await cartService.getCartById(Number(req.params.cid));
    if (cart === null) {
        return res
            .status(404)
            .send({ status: "error", error: "cart doesn't exist" });
    } else {
        try {
            let products = await cartService.getCartProduct(
                Number(req.params.cid)
            );
            res.send(products);
        } catch (error) {
            return res.status(500).send({
                status: "error",
                error: "The products weren't listed",
            });
        }
    }
});

router.post("/:cid/products", async (req, res) => {
    const { id, quantity } = req.body;
    if (!id || !quantity) {
        return res
            .status(300)
            .send({ status: "error", error: "syntax not allowed" });
    } else {
        let cart = await cartService.getCartById(Number(req.params.cid));
        if (cart === null) {
            return res
                .status(404)
                .send({ status: "error", error: "cart doesn't exist" });
        } else {
            try {
                await cartService.saveCartProduct(
                    Number(req.params.cid),
                    Number(id),
                    Number(quantity)
                );
                res.send({
                    status: "success",
                    message: "successfully saved into the cart",
                });
            } catch (error) {
                return res.status(500).send({
                    status: "error",
                    error: "the product has not been updated",
                });
            }
        }
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    let cart = await cartService.getCartById(Number(req.params.cid));
    let product = await productService.getProductById(Number(req.params.pid));
    if (cart == null) {
        return res
            .status(404)
            .send({ status: "error", error: "cart doesn't exist" });
    } else if (product == null) {
        return res
            .status(404)
            .send({ status: "error", error: "product doesn't exist" });
    } else {
        try {
            await cartService.deleteCartProduct(
                Number(req.params.cid),
                Number(req.params.pid)
            );
            res.send({
                status: "success",
                message: "successfully deleted from cart",
            });
        } catch (error) {
            return res.status(500).send({
                status: "error",
                error: "the product was not eliminated",
            });
        }
    }
});

export default router;

import * as fs from "fs";
import __dirname from "../utils.js";
import ProductManager from "./product.manager.js";

const productService = new ProductManager();

class CartManager {
    constructor() {
        this.path = __dirname + "/files/carts.json";
    }

    getAllCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                let fileData = await fs.promises.readFile(this.path, "utf-8");
                let carts = JSON.parse(fileData);
                return carts;
            } else {
                return [];
            }
        } catch (error) {
            console.log("getAll");
            console.log(error);
        }
    };

    saveCartProduct = async (cid, pid, quantity) => {
        let product = await productService.getProductById(pid);
        if (product === null) {
            throw new Error(
                "Error: SaveProductCart - The product is not available"
            );
        } else {
            try {
                let cart = await this.getCartById(cid);
                if (cart.products.some((e) => e.id === pid)) {
                    cart.products.forEach((element) => {
                        if (element.id === pid) {
                            let condition = (element.quantity += quantity);
                            if (condition < 1) {
                                element.quantity = 1;
                            } else {
                                element.quantity = condition;
                            }
                        }
                    });
                } else {
                    if (quantity < 1) {
                        throw new Error(
                            "Error: SaveProductCart - invalid quantity"
                        );
                    } else {
                        cart.products.push({ id: pid, quantity });
                    }
                }
                await this.updateCarts(cart);
            } catch (error) {
                console.log(
                    "Error: SaveProductCart - could be cart doesn't exist yet"
                );
                console.log(error);
            }
        }
    };

    deleteCartProduct = async (cid, pid) => {
        let cart = await this.getCartById(cid);

        let newCart = [];

        if (cart.products.some((e) => e.id === pid)) {
            for (const element of cart.products) {
                if (element.id === pid) {
                    continue;
                }
                newCart.push(element);
            }
        }
        cart.products = newCart;
        await this.updateCarts(cart);
    };

    createCart = async () => {
        let listCarts = await this.getAllCarts();
        let product = {};
        if (listCarts.length === 0) {
            product.id = 1;
            product.timestamp = Date.now().toLocaleString();
        } else {
            product.id = listCarts[listCarts.length - 1].id + 1;
            product.timestamp = Date.now().toLocaleString();
        }
        product.products = [];
        listCarts.push(product);

        await fs.promises.writeFile(
            this.path,
            JSON.stringify(listCarts, null, "\t")
        );
        return cart.id;
    };

    getCartById = async (id) => {
        try {
            let carts = await this.getAllCarts();
            let cart = null;
            carts.forEach((element) => {
                if (element.id === id) {
                    return element;
                }
            });
            return cart;
        } catch (error) {
            console.log("getCardById");
            console.log(error);
        }
    };
    getCartProduct = async (cid) => {
        try {
            let cart = await this.getCartById(cid);
            let copyList = [];
            for (const element of cart.products) {
                copyList.push({
                    product: await productService.getProductById(element.id),
                    quantity: element.quantity,
                });
            }
            return copyList;
        } catch (error) {
            console.log("getProductCart");
            console.log(error);
        }
    };

    deleteCardById = async (id) => {
        try {
            let carts = await this.getAllCarts();
            let newCarts = [];
            for (const element of carts) {
                if (element.id === id) {
                    continue;
                }
                newCarts.push(element);
            }
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(newCarts, null, "\t")
            );
        } catch (error) {
            console.log("deleteCartById");
            console.log(error);
        }
    };

    deleteAll = async () => {
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify([], null, "\t")
            );
        } catch (error) {
            console.log("deleteAll");
            console.log(error);
        }
    };

    updateCarts = async (cart) => {
        try {
            let arrayCarts = await this.getAllCarts();
            let newCarts = [];
            for (const element of arrayCarts) {
                if (element.id === cart.id) {
                    newCarts.push(cart);
                    continue;
                }
                newCarts.push(element);
            }
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(newCarts, null, "\t")
            );
        } catch (error) {
            console.log("UpdateCarts");
            console.log(error);
        }
    };
}

export default CartManager;

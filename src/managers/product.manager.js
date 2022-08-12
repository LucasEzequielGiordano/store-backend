import * as fs from "fs";
import __dirname from "../utils.js";

class ProductManager {
    constructor() {
        this.path = __dirname + "/files/products.json";
    }

    getAllProducts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                let fileData = await fs.promises.readFile(this.path, "utf-8");
                let products = JSON.parse(fileData);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            console.log("getAllProducts");
            console.log(error);
        }
    };

    getProductById = async (id) => {
        try {
            let products = await this.getAllProducts();
            let product = null;
            products.forEach((element) => {
                if (element.id === id) {
                    product = element;
                    return product;
                }
            });
            return product;
        } catch (error) {
            console.log("getProductById");
            console.log(error);
        }
    };

    saveProduct = async (product) => {
        try {
            let products = await this.getAllProducts();
            if (products.length === 0) {
                product.id = 1;
                product.code = (Math.random() + 1).toString(15).substring(5);
                product.enable = true;
                product.timestamp = Date.now().toLocaleString();
                products.push(product);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(products, null, "\t")
                );
                return product.id;
            } else {
                product.id = products[products.length - 1].id + 1;
                product.code = this.createCode(products);
                product.timestamp = Date.now().toLocaleString();
                product.enable = true;
                products.push(product);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(products, null, "\t")
                );
                return product.id;
            }
        } catch (error) {
            console.log("saveProduct");
            console.log(error);
        }
    };

    createCode = (products) => {
        let code = "";
        do {
            code = (Math.random() + 1).toString(15).substring(5);
        } while (products.some((e) => e.code === code));
        return code;
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
    deleteProductById = async (id) => {
        try {
            let products = await this.getAllProducts();
            let newProduct = [];
            for (const element of products) {
                if (element.id === id) {
                    continue;
                }
                newProduct.push(element);
            }
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(newProduct, null, "\t")
            );
        } catch (error) {
            console.log("deleteProductById");
            console.log(error);
        }
    };

    updateProduct = async (id, newData) => {
        try {
            let product = await this.getProductById(id);
            let propertiesOfProducts = Object.keys(product);
            propertiesOfProducts.forEach((element) => {
                if (product[element] != newData[element]) {
                    product[element] = newData[element];
                }
            });
            let listProducts = await this.getAllProducts();
            let newProduct = [];
            for (const element of listProducts) {
                if (element.id === id) {
                    newProduct.push(product);
                    continue;
                }
                newProduct.push(element);
            }
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(newProduct, null, "\t")
            );
        } catch (error) {
            console.log("updateProduct");
            console.log(error);
        }
    };
}

export default ProductManager;

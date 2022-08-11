import express from "express";
import __dirname from "./utils.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";

const app = express();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

let admin = false;

app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.get("/", (req, res) => {
    res.send("welcome to the store");
});

export default admin;

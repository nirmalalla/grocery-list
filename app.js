require("./db/mongoose");
const path = require("path");
const hbs = require("hbs");
const express = require("express");
const bodyParser = require("body-parser");
const Grocery = require("./models/grocery");

const app = express();
const viewsPath = path.join(__dirname, "./templates/views");
const partialsPath = path.join(__dirname, "./templates/partials");

app.use(express.json());
app.use(bodyParser.urlencoded());

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));

app.get("", async (req, res) => {
    const groceries = await Grocery.find({});

    if (groceries.length === 0){
        res.render("index.hbs", {noGroceries: "No Groceries Available"});
    }else {
        res.render("index.hbs", {groceries});
    }
})

app.get("/new", async (req, res) => {
    res.render("newGrocery.hbs", {});
})

app.post("/new", async (req, res) => {
    const grocery = new Grocery({
        title: req.body.title,
        quantity: req.body.quantity,
        type: req.body.type
    })

    try {
        await grocery.save();
        const groceries = await Grocery.find({});
        
        if (groceries.length === 0){
            res.render("index.hbs", {noGroceries: "No Groceries Available"});
        }else {
            res.render("index.hbs", {groceries});
        }
    } catch (e){
        res.send("Error! " + e);
    }
})

app.get("/delete", async (req, res) => {
    console.log(req.query.button);

    try {
        const grocery = await Grocery.findByIdAndDelete(req.query.button);
        const groceries = await Grocery.find({});
        
        if (groceries.length === 0){
            res.render("index.hbs", {noGroceries: "No Groceries Available"});
        }else {
            res.render("index.hbs", {groceries});
        }
    }catch (e){
        res.send("Error! " + e);
    }
})

app.delete("/delete", async (req, res) => {
    const id = req.query.button;
    console.log(id);
    try {
        const grocery = await Grocery.findByIdAndDelete(id);

        if (!grocery){
            res.send("Error");
        }

        const groceries = await Grocery.find({});

    if (groceries.length === 0){
        res.render("index.hbs", {noGroceries: "No Groceries Available"});
    }else {
        res.render("index.hbs", {groceries});
    }
    }catch (e){
        res.send("Error! " + e);
    }
})

app.get("/update", async (req, res) => {
    const id = req.query.button;
    const grocery = await Grocery.findById(id);
 
    res.render("update.hbs", {
        title: grocery.title,
        type: grocery.type,
        quantity: grocery.quantity,
        _id: grocery._id
    });
})

app.post("/update", async (req, res) => {
    const id = req.body.updateButton;
    const grocery = new Grocery({
        title: req.body.title,
        type: req.body.type,
        quantity: req.body.quantity
    })
    const deleteItem = await Grocery.findByIdAndDelete(id);
    

    try {
        await grocery.save();
        const groceries = await Grocery.find()
        
        if (groceries.length === 0){
            res.render("index.hbs", {noGroceries: "No Groceries Available"});
        }else {
            res.render("index.hbs", {groceries});
        }
    }catch (e){
        res.send("Error! " + e);
    }
})

app.listen(3000, () => {
    console.log("Server is running on localhost 3000");
});

const express = require("express");
const router = require("./routes/index");
const mongoose = require("mongoose");
const helmet = require("helmet");

const sequelize = require("./utils/sql_database");

const {Item,Inventory} = require("./models/sql_models")

require("dotenv").config();

mongoose.connect("mongodb://localhost/pacepos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");


    Item.hasOne(Inventory,{constraints: true, onDelete: "CASCADE"})
    Inventory.belongsTo(Item)


    sequelize.sync()
        .then(() =>{
            console.log("Sequelize connected")

            const app = express();
            app.use(helmet());
            app.use(express.json());
            app.use(express.urlencoded({extended: false}));


            let PORT = process.env.PORT
            let HOST = process.env.HOST


            app.use(router);

            app.listen(PORT, () => {
                console.log(`Server running  : http://${HOST}:${PORT}`)
            })

        })
        .catch((error) =>{
            console.log("Cannot connect to MongoDB");
            throw error;

        })


}).catch(err => {
    console.log("Cannot connect to MongoDB");
    throw err;
});

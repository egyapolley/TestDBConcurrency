const Sequelize = require("sequelize");

const sequelize = require("../utils/sql_database");


const Item = sequelize.define("items", {
    id: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    itemId: {
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,
    },
    itemDescription: {
        type:Sequelize.STRING,
        unique:true,
        allowNull: false,
    },
    status: {
        type:Sequelize.STRING,
        defaultValue:'CREATED',
        allowNull:false ,
    },

    price: {
        type:Sequelize.DECIMAL,
        allowNull:false,
    },
    cost:{
        type:Sequelize.DECIMAL,
        allowNull:false,
    },

    category:{
        type:Sequelize.STRING,
        allowNull: false,
    }
});

const Inventory = sequelize.define("inventory", {
    id: {
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },

    availableQty: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },

});


module.exports = {Item, Inventory}

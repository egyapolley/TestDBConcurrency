const Sequelize = require("sequelize");

const sequelize = new Sequelize("pacepos","", "",{
    dialect:"mysql",
    host:"localhost",

    define: {
        freezeTableName:true
    }
});

module.exports = sequelize;


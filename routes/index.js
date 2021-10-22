const express = require("express");
const router = express.Router();
const User = require("../models/user");
const validator = require("../utils/validators");
const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

const {Item, Inventory} = require("../models/sql_models")


const moment = require("moment");
const {Op} = require("sequelize");
const sequelize = require("../utils/sql_database");


passport.use(new BasicStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            user.comparePassword(password, function (error, isMatch) {
                if (err) return done(error);
                else if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false);
                }

            })

        });
    }
));


router.post("/sale", passport.authenticate('basic', {session: false}), async (req, res) => {

    try {
        const {error} = validator.saleReq(req.body);
        if (error) {
            return res.json({
                status: 2,
                reason: error.message
            })
        }

        const {itemId, qty, channel, payment} = req.body

        if (channel.toLowerCase() !== req.user.channel) {
            return res.json({
                status: 2,
                reason: `Invalid Request channel ${channel}`
            })

        }

        const item = await Item.findOne({where: {itemId},include:Inventory})
        if (item) {
            if (item.status !=='ACTIVE') return res.json({status: 1, reason: "Item not active"})
            const {id:inventoryId}=item.inventory
            const transaction = await sequelize.transaction()
            try {
                const inventory  =await Inventory.findOne({where:{id:inventoryId},lock:true,transaction:transaction})
                if (inventory.availableQty < qty) {
                    await transaction.rollback()
                    res.json({status:1, reason:"Insufficent Mi-fi available"})
                }else {
                    inventory.availableQty -= qty
                    await inventory.save({transaction})
                    await transaction.commit()
                    res.json({status:0, reason:"success"})
                }


            }catch (ex){
                await transaction.rollback()
                console.log(ex)
                let errorMessage = "System Failure";
                res.json({
                    status: 1,
                    reason: errorMessage
                })

            }

        }else {
            res.json({status: 1, reason: `Item ${itemId} not found`})

        }



    } catch (error) {

        console.log(error)
        let errorMessage = "System Failure";
        res.json({
            status: 1,
            reason: errorMessage
        })

    }


});

router.post("/items", passport.authenticate('basic', {session: false}), async (req, res) => {

    try {
        const {error} = validator.createItemReq(req.body);
        if (error) {
            return res.json({
                status: 2,
                reason: error.message
            })
        }

        const {itemId, itemDescription, price, cost, category, channel} = req.body


        if (channel.toLowerCase() !== req.user.channel) {
            return res.json({
                status: 2,
                reason: `Invalid Request channel ${channel}`
            })

        }

        const item = await Item.create({itemId, itemDescription, price, cost, category})
        const inv = await item.createInventory({availableQty: 12})
        console.log(item, inv)
        res.json({
            status: 0,
            reason: "success"
        })


    } catch (error) {
        console.log(error)
        let errorMessage = "System Failure";
        res.json({
            status: 1,
            reason: errorMessage
        })

    }


});


router.post("/user", async (req, res) => {
    try {
        let {username, password, channel} = req.body;
        let user = new User({
            username,
            password,
            channel,
        });
        user = await user.save();
        res.json(user);

    } catch (error) {
        res.json({error: error.toString()})
    }


});


module.exports = router;


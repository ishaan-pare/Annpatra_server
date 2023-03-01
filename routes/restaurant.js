//restaurant related necessary imports
const restaurantRouter = require("express").Router();
const Restaurant = require("../models/Clients/Restaurant");
const passport = require("passport");
const config = require("../security/passport");

//@router restaurant CRUD

//1
//@route form - detail filling
restaurantRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { rname, rcon, rpin, raddr, rcanfeed } = req.body;
    const { cemail, ctype } = req.user;

    if (ctype != "restaurant")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else
        Restaurant.findOne({ cemail }, (err, resturant) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: err
                    },
                    msgError: true
                });
            if (resturant)
                res.status(400).json({
                    message: {
                        msgBody: "Not Required to refill"
                    },
                    msgError: true
                });
            else {
                const newRestaurant = new Restaurant({ cemail, rname, rcon, rpin, raddr, rcanfeed });
                newRestaurant.save(err => {
                    if (err)
                        res.status(500).json({
                            message: {
                                msgBody: "Error occuered at server side"
                            },
                            msgError: true
                        });
                    else {
                        res.status(201).json({
                            message: {
                                msgBody: "Successfully added the details"
                            },
                            msgError: false
                        });
                    }
                })
            }
        })

});

//2
//@route check form filled or not
restaurantRouter.get("/checkfilled", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;

    if (ctype != "restaurant")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else
        if (cemail) {
            Restaurant.findOne({ cemail }, (err, restaurant) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error occured at server side"
                        },
                        msgError: true
                    });
                if (!restaurant)
                    res.status(200).json({
                        response: {
                            found: false
                        },
                        message: {
                            msgBody: "Not filled details"
                        },
                        msgError: false
                    });
                else {
                    res.status(200).json({
                        response: {
                            found: true
                        },
                        message: {
                            msgBody: "Already filled details"
                        },
                        msgError: false
                    });
                }
            })
        }
        else {
            res.status(401).json({
                message: {
                    msgBody: "Unauthorized user"
                },
                msgError: true
            })
        }
});


module.exports = restaurantRouter;
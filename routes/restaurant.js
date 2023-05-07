//restaurant related necessary imports
const restaurantRouter = require("express").Router();
const Restaurant = require("../models/Clients/Restaurant");
const passport = require("passport");
const config = require("../security/passport");
const cloudinary = require("../utils/cloudinary");

//@router restaurant CRUD

//1
//@route form - detail filling
restaurantRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { rname, rphoto, rcon, rpin, raddr, rmenu } = req.body;
    const { cemail, ctype } = req.user;
    let rmenu_default;
    if (!rmenu)
        rmenu_default = [{
            "Dal": {
                "name": "",
                "quantity": 0
            },
            "Rice": {
                "name": "",
                "quantity": 0
            },
            "Chapati": {
                "name": "",
                "quantity": 0
            },
            "Veggie": {
                "name": "",
                "quantity": 0
            },
            "Sweet": {
                "name": "",
                "quantity": 0
            },
            "uploaded": {
                "live": false,
                "time": 0
            }
        }]
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
                if (rmenu)
                    Restaurant.findOneAndUpdate({ cemail }, { rname: rname, rphoto: rphoto, rcon: rcon, rpin: rpin, raddr: raddr, rmenu: rmenu }, { new: true }).then(data => {
                    });
                else
                    Restaurant.findOneAndUpdate({ cemail }, { rname: rname, rphoto: rphoto, rcon: rcon, rpin: rpin, raddr: raddr, rmenu: rmenu_default }, { new: true }).then(data => {
                    });
            else {
                let newRestaurant;
                if (rmenu)
                    newRestaurant = new Restaurant({ cemail, rname, rphoto, rcon, rpin, raddr, rmenu });
                else
                    newRestaurant = new Restaurant({ cemail, rname, rphoto, rcon, rpin, raddr, rmenu: rmenu_default });

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

restaurantRouter.delete("/deletepic", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { url, public_id } = req.body;
    try {
        //retrieve current image ID
        const imgId = public_id;

        if (imgId) {
            const ans = await cloudinary.uploader.destroy(imgId);
            if (ans.result == "ok") {
                res.status(201).json({
                    success: true,
                    message: " Product deleted",
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: "Error occurred"
                });
            }
        }
        else {
            res.status(500).json({
                message: {
                    msgBody: "Error occured at Server side"
                },
                msgError: true
            })
        }
    } catch (error) {
        console.log(error);
        next(error);

    }
});

restaurantRouter.get("/details", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail } = req.user;
    Restaurant.findOne({ cemail }, (err, restaurant) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "Error occured at Server side"
                },
                msgError: true
            })
        }
        else if (!restaurant)
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
            res.status(200).json(restaurant);
        }
    })
});
restaurantRouter.put("/updatemenu", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { rmenu } = req.body;
    const { cemail } = req.user;
    if (rmenu) {
        Restaurant.findOneAndUpdate({ cemail }, { rmenu: rmenu }, { new: true }).then(data => {
            if (data) {
                res.status(201).json({
                    message: {
                        msgBody: data
                    },
                    msgError: false
                });
            }
            else {
                res.status(500).json({
                    message: {
                        msgBody: "Error occured at Server side"
                    },
                    msgError: true
                })
            }
        });
    }
    else
        console.log("length is zero");
});


module.exports = restaurantRouter;
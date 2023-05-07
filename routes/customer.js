//customer related necessary imports
const customerRouter = require("express").Router();
const Customer = require("../models/Clients/Customer");
const Restaurant = require("../models/Clients/Restaurant");
const passport = require("passport");
const config = require("../security/passport");
const cloudinary = require("../utils/cloudinary");
//@router customer CRUD

//1
//@route form - detail filling 
customerRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cname, isorg, ccon, cphoto } = req.body;
    const { cemail, ctype } = req.user;
    console.log(cphoto);
    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });

    else
        Customer.findOne({ cemail }, (err, client) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: err
                    },
                    msgError: true
                });
            if (client) {
                Customer.findOneAndUpdate({ cemail }, { cname: cname, isorg: isorg, cphoto: cphoto, ccon: ccon }, { new: true }).then(data => {
                    console.log(data);
                });
            }

            else {
                const newCustomer = new Customer({ cemail, cname, cphoto, isorg, ccon });
                newCustomer.save(err => {
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
        });
});


//2
//@route check form filled or not
customerRouter.get("/checkfilled", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;

    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else
        if (cemail) {
            Customer.findOne({ cemail }, (err, client) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error occured at server side"
                        },
                        msgError: true
                    });
                if (!client)
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

customerRouter.get("/authenticated", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { _id, cemail, ctype } = req.user;
    res.status(200).json({ isAuthenticated: true, client: { cemail, ctype } });
});

//3
//@route findrest finding the restaurant based on CharityAlgorithm
customerRouter.post("/findrest", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;
    const { rpin, weight } = req.body;



    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else {
        if (rpin.length !== 6) {
            res.status(500).json({
                message: {
                    msgBody: "Invalid pin"
                },
                msgError: true
            })
        }
        else
            Restaurant.find({ category: "Database" }, (err, data) => {
                if (err)
                    res.status(500).json({
                        message: {
                            msgBody: "Error occured at server side"
                        },
                        msgError: true
                    });
                //@CharityAlgorithm implementation
                //data filtering
                var rests = data.filter((rest) => {
                    let pre = rest.rpin.substring(0, weight), que = rpin.substring(0, weight);
                    return pre == que;
                }).sort((obj1, obj2) => obj1.rcanfeed > obj2.rcanfeed);

                res.status(200).json({
                    restaurants: rests
                })

            });

    }

});

customerRouter.get("/getallrestaurants", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { ctype } = req.user;

    if (ctype === "customer") {
        Restaurant.find({ category: "Database" }, (err, data) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "An error occured at server"
                    },
                    msgError: true
                });
            if (!data)
                res.status(404).json({
                    message: {
                        msgBody: "No data found"
                    },
                    msgError: true
                });
            else
                res.status(200).json({ restaurants: data });

        })
    }
    else {
        res.status(500).json({
            message: {
                msgBody: "Can't access this route"
            },
            msgError: true
        });
    }
})

//4
//@route to get the current customer details
customerRouter.get("/details", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail } = req.user;
    Customer.findOne({ cemail }, (err, client) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "Error occured at Server side"
                },
                msgError: true
            })
        }
        else if (!client)
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
            res.status(200).json(client);
        }
    })
});

customerRouter.delete("/deletepic", passport.authenticate("jwt", { session: false }), async (req, res) => {
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

module.exports = customerRouter;
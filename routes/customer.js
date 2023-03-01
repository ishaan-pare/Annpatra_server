//customer related necessary imports
const customerRouter = require("express").Router();
const Customer = require("../models/Clients/Customer");
const Restaurant = require("../models/Clients/Restaurant");
const Request = require("../models/Request");
const passport = require("passport");
const config = require("../security/passport");


//@router customer CRUD

//1
//@route form - detail filling 
customerRouter.post("/form", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cname, isorg, ccon } = req.body;
    const { cemail, ctype } = req.user;

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
            if (client)
                res.status(400).json({
                    message: {
                        msgBody: "Not Required to refill"
                    },
                    msgError: true
                });
            else {
                const newCustomer = new Customer({ cemail, cname, isorg, ccon });
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
        })
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

//3
//@route findrest finding the restaurant based on CharityAlgorithm
customerRouter.get("/findrest", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;
    const { pin, weight, quantity } = req.body;

    if (ctype != "customer")
        res.status(500).json({
            message: {
                msgBody: "Not allowed"
            },
            msgError: true
        });
    else {
        Restaurant.find({ category: "Database" }, (err, data) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error occured at server side"
                    },
                    msgBody: true
                });
            //@CharityAlgorithm implementation
            //data filtering
            var rests = data.filter((rest) => {
                let pre = rest.rpin.substring(0, weight), que = pin.substring(0, weight);
                return pre == que;
            }).sort((obj1, obj2) => obj1.rcanfeed > obj2.rcanfeed);

            res.status(200).json({
                restaurants: rests
            })

        });

    }

});

module.exports = customerRouter;
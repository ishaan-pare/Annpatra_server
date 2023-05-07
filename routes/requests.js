const passport = require("passport");
const config = require("../security/passport");
const Request = require("../models/Request");
const Restaurant = require("../models/Clients/Restaurant");
const requestRouter = require("express").Router();

//@router requestRouter CRUD

//1
//posting the request
requestRouter.post("/postrequest", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { destination, feed, note, postedAt, rmenu } = req.body;
    const { cemail, ctype } = req.user;

    if (ctype === "customer")
        Request.findOne({ source: cemail, destination: destination }, (err, request) => {
            if (err) {
                res.status(500).json({
                    message: {
                        msgBody: "Error occuered at server side"
                    },
                    msgError: true
                });
            }
            if (!request) {
                const newRequest = new Request({ source: cemail, destination: destination, feed: feed, note: note, postedAt: postedAt, rmenu });
                newRequest.save(err => {
                    if (err)
                        res.status(200).json({
                            message: {
                                msgBody: err
                            },
                            msgError: true
                        });
                    else {
                        res.status(201).json({
                            message: {
                                msgBody: "Successfully sent request"
                            },
                            msgError: false
                        });
                    }
                });
            }
            else {
                res.status(500).json({
                    message: {
                        msgBody: "single user can only send single request to a destination"
                    },
                    msgError: true
                });
            }
        });

    else
        res.status(500).json({
            message: {
                msgBody: "restaurant can't send request"
            },
            msgError: true
        })

});

requestRouter.delete("/deletemyrequests", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail } = req.user;

    Request.deleteMany({ cemail }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "Error occuered at server side"
                },
                msgError: true
            });
        }
        if (!data) {
            res.status(500).json({
                message: {
                    msgBody: "some error occured at server side"
                },
                msgError: true
            });
        }
        else {
            res.status(200).json({
                message: {
                    msgBody: "Successfully deleted the request"
                },
                msgError: true
            });
        }
    })
});

requestRouter.delete("/deleterequest", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { point } = req.body;
    const {cemail, ctype} = req.user;

    var source = cemail;
    var destination=point

    if (ctype === "restaurant") {
        source = point;
        destination = cemail;
    }

    Request.findOneAndDelete({ source: source, destination: destination }, (err, data) => {
        if (err) {
            res.status(500).json({
                message: {
                    msgBody: "A error occured while deleting the request"
                },
                msgError: true
            })
        }
        if (data) {
            res.status(200).json({
                message: {
                    msgBody: "Successfully deleted the request"
                },
                msgError: false
            })
        }
        else {
            res.status(500).json({
                message: {
                    msgBody: "A error occured while deleting the request"
                },
                msgError: true
            })
        }
    });
});

requestRouter.get("/getsourcerequests", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;


    if (ctype === "customer")
        Request.find({ source: cemail }, (err, data) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error occured in server side"
                    },
                    msgError: true
                });
            if (data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json({
                    message: {
                        msgBody: "Not found the source request"
                    },
                    msgError: true
                });
            }
        });
    else
        res.status(500).json({
            message: {
                msgBody: "you can't access destination requests"
            },
            msgError: true
        });

});

requestRouter.get("/getdestinationrequests", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;

    if (ctype === "restaurant")
        Request.find({ destination: cemail }, (err, data) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error occured in server side"
                    },
                    msgError: true
                });
            if (data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json({
                    message: {
                        msgBody: "Not found the destination request"
                    },
                    msgError: true
                });
            }
        });
    else
        res.status(500).json({
            message: {
                msgBody: "you can't access source requests"
            },
            msgError: true
        });

});

requestRouter.put("/updateresponse", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { cemail, ctype } = req.user;
    const { source, responseAt, isAccepted, rmenu } = req.body;

    if (ctype === "restaurant") {
        Request.updateMany({ source: source, destination: cemail }, { responseAt: responseAt, isAccepted: isAccepted, rmenu: rmenu }, { new: true }, (err, data) => {
            if (err) {
                res.status(500).json({
                    message: {
                        msgBody: "An error occured server side"
                    },
                    msgError: true
                });
            }
            if (data) {
                res.status(200).json({
                    message: {
                        msgBody: "Successfully accepted the request"
                    },
                    msgError: false
                });
            }
            else {
                res.status(500).json({
                    message: {
                        msgBody: "An error occured server side"
                    },
                    msgError: true
                });
            }
        })
    }
    else {
        res.status(500).json({
            message: {
                msgBody: "you don't have authority to accept the request"
            },
            msgError: true
        });
    }
})

module.exports = requestRouter;


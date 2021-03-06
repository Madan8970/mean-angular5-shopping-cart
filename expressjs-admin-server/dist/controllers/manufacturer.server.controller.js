"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ./expressjs-admin-server/controllers/manufacturer.server.controller.ts
var manufacturer_server_model_1 = require("../models/manufacturer.server.model");
var multer = require("multer");
//set multer storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/manufacturer');
    },
    filename: function (req, file, cb) {
        var date = Date.now();
        var newImageName = file.originalname.split('.')[file.originalname.split('.').length - 2];
        newImageName = newImageName.replace(/ /g, '_');
        newImageName = date + newImageName + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1];
        cb(null, newImageName);
    }
});
var Upload = multer({
    storage: storage
}).single('image');
var manufacturerController = /** @class */ (function () {
    function manufacturerController() {
        this.createManufacturer = function (req, res, next) {
            console.log('createManufacturer: ' + JSON.stringify(req.body));
            if (req.body) {
                var newManuftr = new manufacturer_server_model_1.default(req.body);
                if (req.file) {
                    newManuftr.image = req.file.path;
                }
                newManuftr.save(function (err, mftr) {
                    if (err) {
                        console.log(err);
                        return res.json({
                            success: false,
                            message: 'Some Error',
                            err: err
                        });
                    }
                    else {
                        return res.json({
                            success: true,
                            message: 'Manufacturer Added Successfully',
                            mftr: mftr
                        });
                    }
                });
            }
        };
        this.uploadMftrImage = function (req, res, next) {
            console.log('uploadMftrImage: ' + req.file);
            Upload(req, res, function (err) {
                if (err) {
                    console.log('ERROR:' + err);
                    return res.json({ success: false, message: 'Image Error', err: err });
                }
                else {
                    next();
                }
            });
        };
        this.fetchManufacturer = function (req, res) {
            console.log('fetchManufacturer: ' + req.params);
            var limit = parseInt(req.params.limit);
            var limit_value = limit < 30 ? limit : 30;
            var page = parseInt(req.params.page);
            var skip_value = (page * limit_value) - limit_value;
            manufacturer_server_model_1.default.find()
                .limit(limit_value)
                .skip(skip_value)
                .exec(function (err, mftrs) {
                if (err) {
                    console.log(err);
                    return res.json({
                        success: false,
                        message: 'Some Error',
                        err: err
                    });
                }
                else {
                    return res.json({
                        success: true,
                        message: 'Manufacturer Fetched Successfully',
                        mftrs: mftrs
                    });
                }
            });
        };
        this.searchManufacturer = function (req, res) {
            console.log('searchManufacturer: ' + JSON.stringify(req.params));
            var q = req.params.q;
            if (q) {
                var searchKey = '/.*' + q + '.*/i';
                var regex = { $regex: eval(searchKey) };
                manufacturer_server_model_1.default.find({ $or: [{ name: regex }] })
                    .exec(function (err, mftrs) {
                    if (err) {
                        return res.json({ success: false, message: 'Something going wrong', err: err });
                    }
                    else if (!mftrs) {
                        return res.json({ success: false, message: 'Manufacturer Not Found!' });
                    }
                    else if (mftrs) {
                        return res.json({ success: true, message: 'Manufacturer Fetched Successfully', mftrs: mftrs });
                    }
                });
            }
        };
        this.updateManufacturer = function (req, res) {
            console.log('updateManufacturer: ' + JSON.stringify(req.body));
            if (req.body) {
                if (req.file) {
                    req.body.image = req.file.path;
                }
                manufacturer_server_model_1.default.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, function (err, mftr) {
                    if (err) {
                        return res.json({ success: false, message: 'Something going wrong', err: err });
                    }
                    else if (mftr) {
                        return res.json({
                            success: true,
                            message: 'Manufacturer Updated Successfully',
                            mftr: mftr
                        });
                    }
                });
            }
        };
    }
    return manufacturerController;
}());
exports.default = manufacturerController;
//# sourceMappingURL=manufacturer.server.controller.js.map
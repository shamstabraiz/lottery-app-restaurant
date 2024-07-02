import express from 'express';
import multer from 'multer';
import catchAsync from '../../utils/cacheAsync.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = `uploads/`;

        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage }).single('file');

const filesRouter = express.Router();

filesRouter.post('/upload', catchAsync(async (req, res) => {
    
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ error: err.message })
        } else if (err) {
            return res.status(400).send({ error: err.message })
        }
        const urlFile = req.file.path;
        res.send({ status: 'success', path: urlFile, message: 'File uploaded successfully' });
    });
}));


export default filesRouter;
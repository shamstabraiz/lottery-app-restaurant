import express from 'express';
import userRouter from './users.js';
import path from "path";
import trophyRouter from './trophy.js';
import contactRouter from './contacts.js';

const __dirname = path.resolve();
const router = express.Router();
const buildPath = path.normalize(path.join(__dirname, '/public'));

const defaultRoutes = [
    {
        path: '/users',
        route: userRouter,
    },
    {
        path:"/trophies",
        route: trophyRouter,
    },
    {
        path:"/contacts",
        route: contactRouter,
    }
];

defaultRoutes.forEach((route) => {
    console.log({ path: route.path });
    router.use(route.path, route.route);
});

router.use('/uploads', express.static(path.join(__dirname, '/uploads')));
router.use(express.static("public", { dotfiles: "allow" }));
router.get('(/*)?', async (req, res, next) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

export default router;
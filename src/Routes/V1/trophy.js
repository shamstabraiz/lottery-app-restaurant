import express from 'express';
import Trophy from '../../Models/trophy.js';
import checkAuth from '../../Middlewares/AuthUser.js';
import { errorResponse, successResponse } from '../../utils/ApiResponse.js';
import validate from '../../Middlewares/Validate.js';
import { trophySchema } from '../../Validation/trophy.js';
import Contact from '../../Models/contact.js';
import contactTransformer from '../../Transformers/contactTransformer.js';
import Winner from '../../Models/winners.js';
import { genrateRandomString } from '../../utils/useFullFunctions.js';
import trophyTransformer from '../../Transformers/trophyTransformer.js';


const trophyRouter = express.Router();

trophyRouter.get("/selectWinners/:trophyId", checkAuth("admin"), async (req, res) => {
    const trophyID = req.params.trophyId;
    const trophies = await Trophy.findOne({ _id: trophyID });
    if (!trophies) {
        return errorResponse(res, "Trophy not found", 404);
    }
    const contacts = await Contact.find({ trophyId: trophyID });
    const existingWinners = await Winner.find({ trophyId: trophyID }).sort({ createdAt: 1 });;

    if (existingWinners.length >= trophies.numberOfWinners) {
        return errorResponse(res, "Winners already selected", 400);
    }
    const selectRandomContact = (contacts) => {
        const randomIndex = Math.floor(Math.random() * contacts.length);
        const winner = contacts[randomIndex];
        const existingWinner = existingWinners.find(w => w.contactId == winner.id);
        if (existingWinner) {
            return selectRandomContact(contacts);
        }
        return contacts[randomIndex];
    }
    const winner = selectRandomContact(contacts);
    const postion = trophies.numberOfWinners - existingWinners.length;
    const contact  = await Contact.findById(winner._id);
    const winnerData = {
        ...winner._doc,
        ...contactTransformer(contact),
        position: postion,
    }

    await Winner.create({
        contactId: winner._id,
        trophyId: trophyID,
        rollId: genrateRandomString(10),
        position: postion
    })

    successResponse(res, winnerData, "Winners selected successfully");

})

trophyRouter.get('/:id', checkAuth("admin"), async (req, res) => {
    const trophy = await Trophy.findById(req.params.id);
    if (!trophy) {
        return errorResponse(res, "Trophy not found", 404);
    }
    let contacts = await Contact.find({ trophyId: trophy._id });
    contacts = contacts.map(contact => {
        return contactTransformer(contact);
    })
    let winners = await Winner.find({ trophyId: trophy._id }).sort({ createdAt: 1 });
    winners = await Promise.all(winners.map(async (winner) => {
        const contact = await Contact.findById(winner._doc.contactId);
        return {
            ...winner._doc,
            ...contactTransformer(contact)
        };
    }));
    successResponse(res, trophyTransformer({ ...trophy._doc, contacts, winners }), "Trophy retrieved successfully");
})

trophyRouter.get('/', checkAuth("admin"), async (req, res) => {
    const trophies = await Trophy.find({});
    const trophiesWithContacts = await Promise.all(trophies.map(async (trophy) => {
        const count = await Contact.find({ trophyId: trophy._id })
        let winners = await Winner.find({ trophyId: trophy._id }).sort({ createdAt: 1 });;
        winners = await Promise.all(winners.map(async (winner) => {
            const contact = await Contact.findById(winner.contactId);
            return {
                ...winner._doc,
                ...contactTransformer(contact)
            };
        }));
        return trophyTransformer({
            ...trophy._doc,
            winners: winners,
            contacts: count
        });
    }));
    successResponse(res, trophiesWithContacts, "Trophies retrieved successfully");
});


trophyRouter.post('/', validate(trophySchema), checkAuth("admin"), async (req, res) => {
    const trophy = new Trophy({
        name: req.body.name,
        numberOfWinners: req.body.numberOfWinners,
    });
    await trophy.save();
    const winners = await Winner.find({ trophyId: trophy._id }).sort({ createdAt: 1 });;
    const contacts = await Contact.find({ trophyId: trophy._id });
    successResponse(res, trophyTransformer({ ...trophy._doc, totalContacts: 0, winners, contacts }), "Trophy created successfully");
});

trophyRouter.put('/:id', validate(trophySchema), checkAuth("admin"), async (req, res) => {
    const trophy = await Trophy.findById(req.params.id);
    if (!trophy) {
        return errorResponse(res, "Trophy not found", 404);
    }
    trophy.name = req.body.name;
    trophy.numberOfWinners = req.body.numberOfWinners;
    await trophy.save();
    const contacts = await Contact.find({ trophyId: trophy._id });
    const winners = await Winner.find({ trophyId: trophy._id }).sort({ createdAt: 1 });;

    successResponse(res, trophyTransformer({ ...trophy._doc, contacts, winners }), "Trophy updated successfully");
});





trophyRouter.delete('/:id', checkAuth("admin"), async (req, res) => {
    const trophy = await Trophy.findById(req.params.id);
    if (!trophy) {
        return errorResponse(res, "Trophy not found", 404);
    }
    await Trophy.deleteOne({ _id: req.params.id });
    await Winner.deleteMany({ trophyId: req.params.id });
    successResponse(res, null, "Trophy deleted successfully");
});


export default trophyRouter;
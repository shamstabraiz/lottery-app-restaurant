import express from 'express';
import Contact from '../../Models/contact.js';
import checkAuth from '../../Middlewares/AuthUser.js';
import { errorResponse, successResponse } from '../../utils/ApiResponse.js';
import validate from '../../Middlewares/Validate.js';
import { contactSchema } from '../../Validation/contact.js';
import contactTransformer from '../../Transformers/contactTransformer.js';


const contactRouter = express.Router();


contactRouter.get('/:id', checkAuth("admin"), async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return errorResponse(res, "Contact not found", 404);
    }
    successResponse(res, contactTransformer(contact), "Contact retrieved successfully");
})

contactRouter.get('/', checkAuth("admin"), async (req, res) => {
    let  contacts = await Contact.find({});
    contacts = contacts.map(contact => {
        return contactTransformer(contact);
    });
    successResponse(res, contacts, "Contacts retrieved successfully");
})


contactRouter.post('/', validate(contactSchema), checkAuth("admin"), async (req, res) => {
    const isExist = await Contact.findOne({
        trophyId: req.body.trophyId,
        $or: [
            { email: req.body.email },
            { phone: req.body.phone }
        ]
    });
    if (isExist) {
        return errorResponse(res, "Contact already exists", 409);
    }
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        trophyId: req.body.trophyId,
    });
    await contact.save();
    successResponse(res, contactTransformer(contact), "Contact created successfully");
})


contactRouter.put('/:id', validate(contactSchema), checkAuth("admin"), async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return errorResponse(res, "Contact not found", 404);
    }
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.trophyId = req.body.trophyId;
    await contact.save();
    successResponse(res, contactTransformer(contact), "Contact updated successfully");
})


contactRouter.delete('/:id', checkAuth("admin"), async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        return errorResponse(res, "Contact not found", 404);
    }
    await contact.remove();
    successResponse(res, null, "Contact deleted successfully");
});

export default contactRouter;
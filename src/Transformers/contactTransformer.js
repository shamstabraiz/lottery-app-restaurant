
const contactTransformer = (contact) => {
    return {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        trophyId: contact.trophyId,
        postion:contact.position
    }
}

export default contactTransformer;
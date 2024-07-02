const trophyTransformer = (trophy) => {
    console.log(trophy)
    return {
        id: trophy._id,
        name: trophy.name,
        numberOfWinners: trophy.numberOfWinners,
        winners: trophy.winners,
        contacts: trophy.contacts,
        created_at: trophy.createdAt,
        updated_at: trophy.updatedAt,
    }
}

export default trophyTransformer;
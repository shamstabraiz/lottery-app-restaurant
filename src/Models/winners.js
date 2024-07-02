import mongoose from "mongoose";

const winnerSchema = new mongoose.Schema({
    contactId: {
        type: String,
        required: true
    },
    trophyId: {
        type: String,
        required: true
    },
    rollId:{
        type: String,
        required: true
    },
    position:{
        type: Number,
        required: true
    }
},
    {
        timestamps: true
    }
)

const Winner = mongoose.model("Winner", winnerSchema);

export default Winner;
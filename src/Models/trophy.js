import mongoose from "mongoose";

const trophySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    numberOfWinners: {
        type: Number,
        required: true,
        default: 1
    },
},
    {
        timestamps: true
    }
);

const Trophy = mongoose.model("Trophy", trophySchema);

export default Trophy;

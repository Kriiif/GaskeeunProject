import mongoose from 'mongoose';

const fieldTimesSchema = new mongoose.Schema({
    start_time: {
        type: Date
    },  

    end_time: {
        type: Date
    },

    field_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

const Field_Times = mongoose.model('Field_Times', fieldTimesSchema);
export default Field_Times;

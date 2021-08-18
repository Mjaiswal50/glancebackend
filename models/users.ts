import * as mongoose from "mongoose";
import {model} from "mongoose";
import * as moment from "moment";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    verified: {type: Boolean, required: true, default: false},
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	username: { type: String, required: true },
	last_active: { type: String, required: true, default: moment().format('LLLL') },
	code: {type: String,required: true}
});

export default model('user', userSchema);

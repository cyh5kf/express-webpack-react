import mongoose from 'mongoose';
import db from './db';
const LoginSchema = new mongoose.Schema({
    email : { type: String },
    passwd: { type: Number}
}, { versionKey: false });

const LoginModel = db.model("logins", LoginSchema );

export default LoginModel;
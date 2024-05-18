import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
)

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);
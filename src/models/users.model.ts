
import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import email from "../utils/mail";
import { MAIL_USER } from '../utils/env';

export interface User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  profilePicture: string;
  createdAt?: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    roles: {
      type: [Schema.Types.String],
      enum: ["admin", "user"],
      default: ["user"],
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  next();
});

UserSchema.pre("updateOne", async function (next) {
  const user = (this as unknown as { _update: any })._update as User;
  user.password = encrypt(user.password);
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// After saving the order, update the product quantities
UserSchema.post('save', async function (doc: User, next) {
  try {
    const data = {
      username: doc.username,
      contactEmail: MAIL_USER,
      companyName: "Dea's Lapak",
      year: 2024,
    };

    // Send registration success email
    await email.sendRegisterMail(doc.email, "Pendaftaran Berhasil", data);
    next();
  } catch (error) {
    const err = error as Error
    console.error("Error sending registration email:", err);
    next(err);
  }
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

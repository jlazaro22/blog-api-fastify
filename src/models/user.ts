import { hash } from 'bcryptjs';
import { model, Schema } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
    youtube?: string;
    linkedin?: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      maxLength: [20, 'Username must be less than 20 characters.'],
      unique: [true, 'Username must be unique.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      maxlength: [50, 'Email must be less than 50 characters.'],
      unique: [true, 'Email must be unique.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: [8, 'Password must be at least 8 characters.'],
      select: false,
    },
    role: {
      type: String,
      required: [true, 'Role is required.'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role.',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [20, 'First name must be less than 20 characters.'],
    },
    lastName: {
      type: String,
      maxLength: [20, 'Last name must be less than 20 characters.'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Website URL must be less than 100 characters.'],
      },
      facebook: {
        type: String,
        maxLength: [100, 'Facebook URL must be less than 100 characters.'],
      },
      instagram: {
        type: String,
        maxLength: [100, 'Instagram URL must be less than 100 characters.'],
      },
      x: {
        type: String,
        maxLength: [100, 'X URL must be less than 100 characters.'],
      },
      youtube: {
        type: String,
        maxLength: [100, 'Youtube URL must be less than 100 characters.'],
      },
      linkedin: {
        type: String,
        maxLength: [100, 'LinkedIn URL must be less than 100 characters.'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await hash(this.password, 10);

  next();
});

const User = model<IUser>('User', userSchema);

export default User;

import { model, Schema, Types } from 'mongoose';

export interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const Token = model<IToken>('Token', tokenSchema);

export default Token;

import mongoose from 'mongoose';

interface paymentAttrs {
  orderId: string;
  stripeId: string;
}

interface paymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface paymentModel extends mongoose.Model<paymentDoc> {
  build(atts: paymentAttrs): paymentDoc;
}

export const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: paymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<paymentDoc, paymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };

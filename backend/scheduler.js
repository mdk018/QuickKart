const cron = require('node-cron');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Price = require('./models/Price');
const scrapePrice = require('./scraper/scraper');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully.');
  startCronJob();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

function startCronJob() {
  cron.schedule('*/3 * * * *', async () => {
    try {
      const products = await Product.find();
      for (const product of products) {
        let platform = product.url.includes('amazon') ? 'amazon' : '';
        const price = await scrapePrice(product.url, platform);
        if (price === null) continue;

        await new Price({ productId: product._id, price }).save();

        const previousPriceEntry = await Price.findOne({ productId: product._id })
          .sort({ _id: -1 })
          .skip(1);

        const previousPrice = previousPriceEntry ? previousPriceEntry.price : null;

        if (price < product.targetPrice && (previousPrice === null || price < previousPrice)) {
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: product.userEmail,
            subject: 'Price Drop Alert!',
            html: `<b>${product.title}</b> is now ₹${price}. <a href="${product.url}">Check it out!</a>`,
          });
          console.log(`Email alert sent for ${product.title} to ${product.userEmail}`);
        }
      }
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
}

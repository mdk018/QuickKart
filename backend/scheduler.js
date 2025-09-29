const cron = require('node-cron');
const Product = require('./models/Product');
const Price = require('./models/Price');
const scrapePrice = require('./scraper/scraper');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function startCronJob() {
  cron.schedule('*/4 * * * *', async () => {
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
        console.log(`Checking product ${product.title}: current price = ${price}, target price = ${product.targetPrice}, previous price = ${previousPrice}`);

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
      console.error('Error running cron job:', error);
    }
  });
}

module.exports = { startCronJob };

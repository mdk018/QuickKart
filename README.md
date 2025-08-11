# QuickKart – E-Commerce Price Tracker

QuickKart is a full-stack web application that allows users to track prices of products across popular e-commerce platforms. It automates price monitoring, sends email alerts on price drops, and provides historical price trends through an interactive React dashboard.

---

## Features

- **Product Tracking:** Add products to track by providing title, URL, target price, and email.
- **Automated Price Scraping:** Uses Puppeteer to regularly scrape product prices and update price history.
- **Email Alerts:** Sends notifications when prices drop below user-defined thresholds and below the previous tracked price.
- **Price History Visualization:** React-based dashboard with interactive charts to view historical price trends.
- **Product Removal:** Users can remove tracked products, cleaning up associated price history.
- **Robust Backend:** Node.js and Express.js REST API with MongoDB for data storage.
- **Validation and Error Handling:** Form validations and graceful error messaging across frontend and backend.

---

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB Atlas, Puppeteer, Nodemailer, node-cron
- **Frontend:** React.js, Axios, Chart.js (or similar library for charts)
- **Other:** CSS Modules for styling, REST API architecture

---

## Getting Started

### Prerequisites
```
- Node.js and npm installed
- MongoDB Atlas account or local MongoDB instance
- Internet connection to access product pages for scraping
```
### Installation

1. **Clone the repository**
```
git clone https://github.com/yourusername/quickkart.git
cd quickkart
```

2. **Setup backend**
```
cd backend
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `backend` folder with your MongoDB URI and email credentials, example:
```
MONGO_URI=your_mongo_connection_string
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. **Run the backend server**
```
npm start
```


The backend API will run by default on `http://localhost:5000`.

5. **Setup frontend**

Open a new terminal window/tab, then:
```
cd frontend
npm install
npm start
```


This starts the React development server at `http://localhost:3000`.

---

## Production Build

To create an optimized production build of the frontend, run:
```
cd frontend
npm run build
```


The build output will be in the `frontend/build` folder, ready for deployment.

---

## Usage

- Open the QuickKart app in your browser.
- Add a product with title, product page URL, your target price, and your email.
- The backend scheduler will scrape the product price periodically.
- Receive email alerts when the current price drops below your target and previous price.
- Track price history visually via interactive charts.
- Remove unwanted products from tracking anytime.

---

## Project Structure
```
quickkart/
│
├── backend/ # Node.js, Express backend API & scheduler
│ ├── models/ # Mongoose models (Product, Price)
│ ├── routes/ # API routes (products, delete product)
│ ├── scheduler.js # Price scraping scheduler with Puppeteer
│ ├── scraper.js # Scraper logic for getting product prices
│ ├── server.js # Express server setup
│ └── .env # Environment variables (not committed)
│
├── frontend/ # React frontend app
│ ├── src/
│ │ ├── components/ # ProductForm, ProductList, PriceChart
│ │ ├── App.js # Main React component
│ │ └── ...
│ ├── public/ # Static files
│ ├── package.json
│ ├── ...
│
└── README.md # This file

---
```

## Future Improvements

- Enhance scraper reliability with proxy rotation and captcha bypass.
- Add user authentication and personalized dashboards.
- Implement advanced filtering, pagination, and search.
- Deploy backend and frontend to scalable cloud platforms.
- Integrate push notifications and mobile support.

---

## Contributing

Contributions are welcome! Feel free to open issues or pull requests for bug fixes, features, or suggestions.

---

##Contact

For questions or feedback, reach out at kaif78618@gmail.com

---

*QuickKart* is a MERN stack project combining automation, monitoring, and user notifications for smart ecommerce price tracking.

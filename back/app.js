const express = require("express");
const helmet = require("helmet");
const app = express();
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  delayMs: 100, // disable delaying — full speed until the max limit is reached
});

const mailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const address = "hosahn13@gmail.com";

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(limiter);
app.post("/contact", (req, res) => {
  console.log(req.body);
  try {
    mailer.sendMail(
      {
        from: req.body.email,
        to: [address],
        subject: req.body.name || "[No subject]",
        html: req.body.message || "[No message]",
      },
      function (err, info) {
        if (err) {
          console.log(err);
          return res.send(false);
        }
        res.send(true);
      }
    );
  } catch (e) {
    res.send(false);
  }
});

app.listen(3000, () => {
  console.log("App Started in Port 3000");
});

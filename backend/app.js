const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Razorpay = require('razorpay')
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const port = 3000

const sendEmail = async (name, email, message) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'r.m.kavinbharathi@gmail.com',
            pass: 'txbdqstcptqymkdm',
        },
    });

    const mailOptions = {
        from: 'r.m.kavinbharathi@gmail.com',
        to: 'barathkumar.b2411@gmail.com',
        subject: `You received an email from ${name} from IT Arena`,
        text: `Name     : ${name}
               Email    : ${email}
               Message  : ${message}`
    }

    let send = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Text sent successfully.');
        }
    })

    console.log("All operations successful")
    return mailOptions.text
}

const app = express();
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/data', (req, res) => {
    const fullName = req.body.fullName;
    const emailAddress = req.body.emailAddress;
    const msg = req.body.msg;

    console.log(fullName);
    console.log(emailAddress);
    console.log(msg);
    sendEmail(fullName, emailAddress, msg)
    res.send('Data received');
});

let razorpay = new Razorpay({ key_id: 'rzp_test_HBni4PPnBF3Swj', key_secret: 'CTuKUGEBUL3FtJBauO4TLTrJ' })

app.post('/create-payment', async (req, res) => {

    // let { amount } = req.body

    let options = {
        amount: 1 * 100,
        currency: "INR",
        receipt: "rcptid_" + Math.random().toString(36).substring(7),
    };

    try {
        const response = await razorpay.orders.create(options);
        const orderId = response.id;
        res.status(200).json({ orderId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create order" });
    }    

});


app.post("/verify-payment", (req, res) => {

        let { razorpayPaymentId , razorpayOrderId , razorpaySignature } = req.body
        console.log('hi')
        let body = razorpayOrderId + "|" + razorpayPaymentId;
       
        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', 'CTuKUGEBUL3FtJBauO4TLTrJ')
                                        .update(body.toString())
                                        .digest('hex');
                                        console.log("sig received " , razorpaySignature);
                                        console.log("sig generated " ,expectedSignature);

        var response = {"signatureIsValid":"false"}
        if(expectedSignature === razorpaySignature) {

            response={"signatureIsValid":"true"}
            console.log(response)
            res.status(200).json({ response });
        }else {
            res.status(200).json({ response });
        }
});
          
app.listen(3000, () => {
    console.log(`Server started on port ${port}`);
});

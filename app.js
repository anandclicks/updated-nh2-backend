const express = require('express')
const app = express()
const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require('nodemailer')
app.use(express.urlencoded({extended : true}))
app.use(express.json())
const core = require('cors')
app.use(core())

const transporter = nodemailer.createTransport({
  service : 'Gmail',
  auth : {
    user : process.env.EMAIL_ID,
    pass : process.env.PASSWORD
  }
})

transporter.verify((error,response)=> {
  if(error) {
    console.log(error)
  }
  else {
    console.log("Transporter is ready to send mails")
    app.listen(3001,()=> {
      console.log("server is runnig at 3001")
    })
  }
})


app.post('/',async(req,res)=> {
  const {name,mobileNumber,propertyName,roomSharing} = req.body
  console.log(req.body)
  let mailOption = {
    from : process.env.EMAIL_ID,
    to : process.env.TO_EMAIL,
    subject  : "New query",
    html : `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        .p-2 {
            padding: 10px !important;
        }
        a {
            color: #000 !important;
        }
        body {
            background-color: #f3f4f6;
            padding: 10px;
        }

        .container {
            max-width: 520px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 0px 16px 0px #00000069 !important;
        }

        .navbar {
            background: linear-gradient(90deg, #15803d, #22c55e);
            padding: 12px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
        }

        .logo {
            width: 38px;
            height: 38px;
            margin-right: 10px;
            border-radius: 50%;
            background-image: url('https://nh2.vercel.app/images/logo.jpg') !important;
            background-size: cover !important;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 20px;
            color: #15803d;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s ease;
        }

        .logo:hover {
            transform: scale(1.05);
        }

        .company-name {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: 0.3px;
        }

        .content {
            padding: 25px 0px 25px 0px !important;
            text-align: center;
        }

        .heading {
            font-size: 18px;
            font-weight: 600;
            color: #14532d;
            margin-bottom: 18px;
            line-height: 1.3;
        }

        .info-card {
            background: #fefefe;
            padding: 12px;
            border-radius: 8px;
            margin: 0 auto;
            max-width: 400px;
            border: 1px solid #dcfce7;
        }

        .content p {
            margin-bottom: 8px;
            font-size: 14px;
            color: #1f2937;
            line-height: 1.5;
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
        }

        .content strong {
            color: #14532d; 
            font-weight: 600;
            min-width: 92px;
            text-align: left;
        }

        .cta-button {
            display: inline-block;
            margin-top: 15px;
            padding: 8px 22px;
            background: linear-gradient(90deg, #15803d, #22c55e);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            border-radius: 20px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            transition: background 0.2s ease, transform 0.2s ease;
        }

        .cta-button:hover {
            background: #166534;
            transform: translateY(-1px);
        }

        .footer {
            background: #f8fafc;
            padding: 10px;
            text-align: center;
            font-size: 11px;
            color: #6b7280;
            border-top: 1px solid #dcfce7;
        }

        .footer a {
            color: #15803d !important;
            text-decoration: none;
            font-weight: 500;
        }

        .footer a:hover {
            color: #166534 !important;
        }
        span {
            color: #000 !important;
            padding: 0px 0px 0px 10px !important;
        }
    </style>
</head>
<body>
   <div class="p-2">
    <div class="container">
        <div class="navbar">
            <div class="logo"></div>
            <div class="company-name">NH2 Stays</div>
        </div>
        <div class="content">
            <div class="heading">A Client is Interested in Contacting You!</div>
            <div class="info-card">
                <p><strong>Name:</strong> <span>${name}</span></p>
                <p><strong>Number:</strong> <span>+91${mobileNumber}</span></p>
                <p><strong>PG:</strong> <span>${propertyName}</span></p>
                <p><strong>Sharing Type:</strong> <span>${roomSharing}</span></p>
            </div>
            <a href="tel:{{ $number }}" class="cta-button">Call Now</a>
        </div>
        <div class="footer">
            © 2025 <a href="https://tanusadigital.in/">Tanusa Digital</a>. All rights reserved. | <a href="https://tanusadigital.in/">Contact Us</a>
        </div>
    </div>
   </div>
</body>
</html>

    `
  }
  try {
    let response = await transporter.sendMail(mailOption)
    res.status(200).send({message : "Email has sended succesfully", info : response})
  } catch (error) {
    res.send({message : "Something went wrong", error : error})
  }
})


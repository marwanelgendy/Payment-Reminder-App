const nodemailr = require("nodemailer");
const Handlebars = require('handlebars')
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const transporter = nodemailr.createTransport({
  service: "gmail",
  auth: {
    type: "oAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

Handlebars.registerHelper('link' , function(baseUrl , id , text) {
  let url = Handlebars.escapeExpression(baseUrl)
  let userId = Handlebars.escapeExpression(id)
  let buttonName = Handlebars.escapeExpression(text)

  return new Handlebars.SafeString("<a href='" + url + userId + "' style='padding: 8px 16px; font-weight: 700; background-color: #00bbb4; color: white; border: 0; border-radius: 4px; cursor: pointer; text-decoration: none;'>" + buttonName + "</a>")
})

const sendActivationMail = async (email , userId) => {

    let html = await readFile('F:\Electrical\Node-js\payment-reminder\back-end\Email Templates/Activation_Template.html' , 'utf-8')

    let template = Handlebars.compile(html)

    let htmlToSend = template({id : userId})

    let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: "Payment Reminder App - Activation Mail",
        html: htmlToSend
    };

    transporter.sendMail(mailOptions , (error , info)=> {
        if(error){
            console.log({error})
        }
        else{
            console.log("Activation Email sent successfully")
        }
    })
}


const sendInvoiceEmail = async (invoice) => {

  // let html = await readFile("F:/Electrical/Node-js/payment-reminder/back-end/Email Templates/Invoice_Template" , 'utf-8')

  // let template = handlebars.compile(html)

  let x = {
      userName : invoice.userName , 
      invoiceSubject : invoice.invoiceDetails.subject,
      invoiceAmount : invoice.invoiceDetails.amount,
      invoiceDuedate : invoice.invoiceDetails.dueDate,
      id : invoice.invoiceDetails._id
  }

  console.log(x)


  // let htmlToSend = template({
  //     userName : invoice.userName , 
  //     invoiceSubject : invoice.invoiceDetails.subject,
  //     invoiceAmount : invoice.invoiceDetails.amount,
  //     invoiceDuedate : invoice.invoiceDetails.dueDate,
  //     id : invoice.invoiceDetails._id
  // })

  // let mailOption = {
  //     from : process.env.MAIL_USERNAME,
  //     to: invoice.clientEmail,
  //     subject: "Payment reminder - A new invoice has been added",
  //     html: htmlToSend
  // }

  // transporter.sendMail(mailOption , (err , info) => {
  //     if (err){
  //         console.log(err)
  //     }else{
  //         console.log("New invoice sent successfully")
  //     }
  // })

}

module.exports = {
    sendActivationMail,
    sendInvoiceEmail
}
const Invoice = require('../Models/invoice')
const {sendInvoiceEmail} = require('../Email Sender/emailController')

module.exports = (req , res , next) =>{
    
    const userName = req.user.firstName + " " + req.user.lastName
    
    Invoice.findByIdAndUpdate(req.body.invoiceId , {$set: req.body.invoiceInfo} , {new: true})
    .then((invoice) => {

        const invoiceEmailObj = {
            clientEmail : invoice.clientEmail,
            userName : userName,
            operation : "edit a ",
            invoiceDetails : invoice
        }

        res.statusCode = 200
        res.end()

        sendInvoiceEmail(invoiceEmailObj)

    })

}
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name)=>{
    sgMail.send({                         //send returns promise
        to: email,
        from: 'abc@example.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}
const sendCancellationEmail = (email, name)=>{
    sgMail.send({                         
        to: email,
        from: 'abc@example.com',//from copied
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}, Is there anything that we could have done to have kept you on board?.`
    })
}

module.exports = {
    sendWelcomeEmail, //module.exports is obj since we wish to export more than one func, using shorthand syntax, sendWelcomeEmail:sendWelcomeEmail ke jagah pe sendWelcomeEmail only 
    sendCancellationEmail
}
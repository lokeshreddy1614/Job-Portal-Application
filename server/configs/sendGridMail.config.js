const sendGridMail = require('@sendgrid/mail')
const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL } = require('./config')

sendGridMail.setApiKey(SENDGRID_API_KEY)

const sendEmail = async (to, subject, html) => {
    try {
        const msg = {
            to,
            from: SENDGRID_FROM_EMAIL,
            subject,
            html
        }
        await sendGridMail.send(msg)
        console.log(`Email sent to ${to}`)
    } catch (error) {
        console.error("SendGrid Error:", error)
    }
}

module.exports = sendEmail
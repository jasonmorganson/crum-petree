const SMTPServer = require('smtp-server').SMTPServer
const MailParser = require("mailparser").MailParser
const mailparser = new MailParser()
const nodemailer = require('nodemailer')
const mandrillTransport = require('nodemailer-mandrill-transport')

const server = new SMTPServer({
  authOptional: true,
  onData: onData
})

const mandrillOptions = {
  auth: {
    apiKey: process.env.MANDRILL_API_KEY
  }
}

const transporter = nodemailer.createTransport(mandrillTransport(mandrillOptions))

server.listen(25)

function getRandomEmail () {

  const emails = require('./emails.json')
  const index = Math.floor(Math.random() * emails.length)

  return emails[index]
}

function onData (stream, session, callback) {

  mailparser.on('end', (data) => sendMail(data, callback))

  stream.pipe(mailparser)
}

function sendMail (data, callback) {

  data.from = 'info@gamechanger.io'
  data.to = getRandomEmail()

  transporter.sendMail(data, callback)
}

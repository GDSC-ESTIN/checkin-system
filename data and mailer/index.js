const { readCSV } = require("./generate");
const fs = require("fs");
const { send_emails_accepted } = require("./mailer");
const mail_template = fs.readFileSync("./template.html", 'utf8');



async function Main() {
    const mail_subject = "Keep Innovating! Your Application for the Bejaia Hackathon"
    const rows = await readCSV("data/_test.csv");
    send_emails_accepted(rows, mail_subject, mail_template, [])
}

Main()
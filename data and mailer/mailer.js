const fs = require("fs");
const Bottleneck = require("bottleneck");
const nodemailer = require("nodemailer");
const { AppendRowInCSV } = require("./generate");
require("dotenv").config();


const sender_address = process.env.ADMIN_EMAIL;
const sender_password = process.env.ADMIN_PASSWORD;

const limiter = new Bottleneck({
	maxConcurrent: 1,
	minTime: 1000,
});


let transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: sender_address,
		pass: sender_password,
	},
});

const send_simple_mail = limiter.wrap(function (reveicer_address, mail_content, mail_subject) {
	transporter.sendMail({
		from: sender_address,
		to: reveicer_address,
		subject: mail_subject,
		text: mail_subject,
		html: mail_content,
	}).then((info) => {
		console.log("Message is being sent to:", email);
	}).catch((err) => {
		console.log(err);
	});
})

const send_mail_to_list = limiter.wrap(function (reveicer_list, mail_content, mail_subject) {
	reveicer_list.forEach((email) => {
		send_simple_mail(email, mail_content, mail_subject);
	});
})

const send_mail_with_attachement = limiter.wrap(function (reveicer_address, mail_content, mail_subject, attachement) {
	transporter.sendMail({
		from: sender_address,
		to: reveicer_address,
		subject: mail_subject,
		text: mail_subject,
		html: mail_content,
		attachments: [
			{
				filename: attachement.name,
				path: attachement.path,
			},
		],
	}).then((info) => {
		console.log("Message is being sent to:", email);
	}).catch((err) => {
		console.log(err);
	});
})


const send_mail_to_list_with_attachement = limiter.wrap(function (receiver_list, mail_content, mail_subject, attachement) {
	receiver_list.forEach((email) => {
		send_mail_with_attachement(email, mail_content, mail_subject, attachement);
	});
});



const send_email_accepted = limiter.wrap(function (accepted_participant, mail_subject, mail_content, attachements) {
	// const file = fs.readFileSync(`images/${accepted_participant.email}.png`);
	const content = mail_content.replace("{{username}}", accepted_participant.username)
	transporter.sendMail({
		from: sender_address,
		to: accepted_participant.email,
		subject: mail_subject,
		text: mail_subject,
		html: content,
		attachments: [...attachements.map((attachement, index) => ({
			filename: attachement.name,
			path: attachement.path,
		}))
			// , {
			// 	filename: `${accepted_participant.email}.png`,
			// 	content: file,
			// }
		],
	}).then(async (info) => {
		await AppendRowInCSV("data/success.csv", accepted_participant)
		console.log("✅ Message sent to: ", accepted_participant.email);
	}).catch(async (err) => {
		await AppendRowInCSV("data/error.csv", accepted_participant)
		console.log("❌ Error sending messenge to: ", accepted_participant.email);
	});
})


const send_emails_accepted = limiter.wrap(function (accepted_participants, mail_subject, mail_content, attachements) {
	accepted_participants.forEach((participant) => {
		send_email_accepted(participant, mail_subject, mail_content, attachements);
	});
})


module.exports = {
	send_simple_mail,
	send_mail_to_list,
	send_mail_with_attachement,
	send_mail_to_list_with_attachement,
	send_email_accepted,
	send_emails_accepted,
}
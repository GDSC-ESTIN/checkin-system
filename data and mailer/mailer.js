const fs = require("fs");
const Bottleneck = require("bottleneck");
const nodemailer = require("nodemailer");
require("dotenv").config();

const mail_template = fs.readFileSync("./template.html", 'utf8');

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
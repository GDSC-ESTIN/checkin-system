const fs = require("fs");
const csv = require("csv-parser");
const qrcode = require("qrcode");
const uuid = require("uuid").v4;

async function readCSV(filePath) {
	const rows = [];
	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv())
			.on("data", (data) => rows.push(data))
			.on("end", () => resolve(rows))
			.on("error", (error) => reject(error));
	});
}

// Function to generate an ID for each row
async function generateIDs(rows) {
	return rows.map((row) => ({ ...row, id: uuid() }));
}

// Function to generate QR codes for each ID
async function generateQRCodes(rows, imagesFolder) {
	for (const row of rows) {
		const qrCode = await qrcode.toFile(`${imagesFolder}/${row.email}.png`, row.id);
	}
}

// Function to write rows to a CSV file
async function writeCSV(filePath, rows) {
	let csvContent = "email,firstname,lastname,checked,id\n";
	rows.forEach((row) => {
		csvContent += `${row.email},${row.firstname},${row.lastname},${false},${row.id}\n`;
	});
	fs.writeFileSync(filePath, csvContent);
}




// ------------------ main ------------------ //

// read csv data
// generate IDs
// generate QR codes
// write csv data with IDs


const initChecking = async (inputFile, outputFile, imagesFolder) => {
	const rows = await readCSV(inputFile);
	const rowsWithIDs = await generateIDs(rows);
	await generateQRCodes(rowsWithIDs, imagesFolder);
	await writeCSV(outputFile, rowsWithIDs);
};



const inputFile = "data.csv"; //this file has to exist, has to contain 'email', and other fields
const outputFile = "data-with-id.csv"; // here we will save the data with the generated IDs and checked status (will be used to sending emails and checking in)
const imagesFolder = "images"; //make sure this folder exists

initChecking(inputFile, outputFile, imagesFolder);
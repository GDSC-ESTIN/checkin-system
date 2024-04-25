const fs = require("fs");
const csv = require("csv-parser");
const qrcode = require("qrcode");
const uuid = require("uuid").v4;

const Jimp = require('jimp');
const jsQR = require('jsqr');

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
	let csvContent = Object.keys(rows[0]).join(",") + "\n";
	rows.forEach((row) => {
		csvContent += Object.values(row).join(",") + "\n";
	});
	fs.writeFileSync(filePath, csvContent);
}

async function AppendRowInCSV(filePath, row) {
	const csvContent = Object.values(row).join(",") + "\n";
	fs.appendFileSync(filePath, csvContent);
}

module.exports = {
	readCSV,
	generateIDs,
	generateQRCodes,
	writeCSV,
	AppendRowInCSV
};



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



// const inputFile = "data/_test.csv"; //this file has to exist, has to contain 'email', and other fields
// const outputFile = "data/_test-with-id.csv"; // here we will save the data with the generated IDs and checked status (will be used to sending emails and checking in)
// const imagesFolder = "images"; //make sure this folder exists

// initChecking(inputFile, outputFile, imagesFolder);


async function Test() {
	const rows = await readCSV("data/_accept.csv");

	for (let i = 0; i < rows.length; i++) {
		const id = await decodeQR(`new-images/${rows[i].email}.png`);
		rows[i].id = id;
		rows[i].checked = "false"
	}

	await writeCSV("data/DATA.csv", rows);
}

Test()

const decodeQR = async (image_path) => {
	try {
		// Load the image with Jimp
		const image = await Jimp.read(image_path);

		// Get the image data
		const imageData = {
			data: new Uint8ClampedArray(image.bitmap.data),
			width: image.bitmap.width,
			height: image.bitmap.height,
		};

		// Use jsQR to decode the QR code
		const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

		if (!decodedQR) {
			throw new Error('QR code not found in the image.');
		}

		return decodedQR.data;
	} catch (error) {
		console.error('Error decoding QR code:', error);
	}
}
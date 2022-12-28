
Check-in System
===============

This project is a check-in system for managing check-ins at an event or location. It includes the following features:

*   Generation of IDs and QR codes using data from a CSV file
*   Sending emails to a single recipient, a list of recipients, and with attachments using the `nodemailer` module and the `bottleneck` library
*   A backend server built with Express that handles check-in operations when a QR code is posted to it
*   A front-end interface built with React that allows users to scan QR codes and communicate with the backend server

The project is organized into the following folders:

*   `backend`: An express server that handles check-in operations when a QR code is posted to it
*   `scanner`: Contains a React app that scans QR codes and communicates with the backend server
*   `data and mailer`: Code that does mainly two things:
    *   functions for reading a CSV file, generating IDs, and creating QR codes
    *   functions for sending emails using the `nodemailer` module and the `bottleneck` library, as well as an HTML template (`template.html`) for formatting the emails

Overall, this project provides a convenient and efficient way to manage check-ins at an event or location using QR codes and emails.


<!------------------------------------->
<br/><br/>
Backend
=======================

This backend code is part of a check-in system for managing check-ins at an event or location. It is built using the `express` framework and handles check-in operations by reading and updating a CSV file with the `csvtojson` and `json-2-csv` modules. It also uses the `cors` module to enable cross-origin resource sharing (CORS).

The code defines two routes:

*   `GET /api/v1/getData`: Returns the contents of the CSV file as a string.
*   `POST /api/v1/postData`: Accepts a request with an `id` in the request body, searches the CSV file for a matching ID, and marks the corresponding record as "checked" if it is found. If the ID is not found, it returns a 404 status code. If the ID is found but the record is already marked as "checked", it returns a 300 status code. Otherwise, it returns the record data and a 200 status code.

The code also includes a `start` function that loads the CSV file into memory and starts the server on a specified port.

Overall, this backend code provides a way to manage check-ins by reading and updating a CSV file and handling HTTP requests from the front-end interface.

<!------------------------------------->
<br/><br/>
Data and Mailer 
================================

## Setup
To use the `mailer` module in this check-in system, you will need to create a file called `.env` in the `data and mailer` of your project. This file should contain the following variables:

Copy code

```ini
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourpassword
```

Make sure to replace `your@email.com` and `yourpassword` with your actual email address and password.

The `mailer` module will use these variables to authenticate with the email service and send emails from your account. It is important to keep these credentials secure and not commit them to version control. The `.env` file should be added to your `.gitignore` file to prevent it from being accidentally committed to the repository.<br/><br/>
also make sure to create an images folder inside `data and mailer` folder


<br/><br/>


## CSV Processing (generate.js)
This code is part of a check-in system that processes data from a CSV file, generates IDs and QR codes, and writes the modified data back to a CSV file. It uses the following modules:

*   `fs`: The Node.js file system module for reading and writing files.
*   `csv-parser`: A module for parsing CSV data.
*   `qrcode`: A module for generating QR codes.
*   `uuid`: A module for generating universally unique identifiers (UUIDs).

The code defines several functions:

*   `readCSV`: Reads a CSV file and returns its rows as an array of objects.
*   `generateIDs`: Maps an array of rows and adds a UUID as an `id` field to each row.
*   `generateQRCodes`: Generates QR codes for each row in an array and saves them to a specified folder.
*   `writeCSV`: Writes an array of rows to a CSV file, adding an `id` and `checked` field to each row.

The `initChecking` function ties these functions together by reading a CSV file, generating IDs and QR codes, and writing the modified data back to a CSV file.


<br/>
##  Email Sending (mailer.js)
This code is part of a check-in system that sends emails using the `nodemailer` module and the `bottleneck` library. It uses the following modules:

*   `fs`: The Node.js file system module for reading files.
*   `bottleneck`: A module for rate limiting the number of concurrent requests made to a server.
*   `nodemailer`: A module for sending emails.
*   `dotenv`: A module for loading environment variables from a `.env` file.

The code defines several functions for sending emails:

*   `send_simple_mail`: Sends a simple email to a single recipient.
*   `send_mail_to_list`: Sends an email to a list of recipients.
*   `send_mail_with_attachment`: Sends an email with an attachment to a single recipient.
*   `send_mail_to_list_with_attachment`: Sends an email with an attachment to a list of recipients.

These functions are wrapped in rate limiter instances using the `wrap` method from the `bottleneck` library to limit the number of concurrent requests made to the email server.

The code also includes constants for the email sender's address and password (loaded from environment variables), an HTML template for formatting the emails, and a `transporter` object for sending emails using the `nodemailer` module.

Overall, this code provides a way to send emails using the `nodemailer` module and rate limit the number of concurrent requests using the `bottleneck` library.



<!------------------------------------->
<br/><br/>

Scanner - QR Code Scanner
=========================

This code is part of a check-in system that uses a QR code scanner to check in attendees. It is built using the `react` library and styled with the `@mui/material`  module. It uses the following dependencies:

*   `react`: A JavaScript library for building user interfaces.
*   `react-scan-qr`: A package for scanning QR codes with a webcam.
*   `@mui/material`: A Material Design library for React.
*   `@mui/icons-material`: A library of Material Design icons for React.



The code includes a React component that allows the user to open and close the webcam, scan a QR code, and display one of three messages depending on the result of the scan: "invalid token" (in red), "success" (in green), or "already scanned" (in orange). The component also sends a request to the backend with the scanned QR code data.

Overall, this code provides a QR code scanner for the check-in system using the `react-scan-qr` package and a Material Design interface built with `@mui/material`.
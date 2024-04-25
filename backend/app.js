const express = require('express')
const fs = require("fs")
const csv = require("csvtojson")
const converter = require('json-2-csv');
const cors = require("cors")
const app = express()
app.use(cors());

app.use(express.json())
let jsonDB;

const start = async () => {
    jsonDB = await csv().fromFile("./DB.csv")
    app.listen(port, console.log(`app is listening on port ${port}`))
}

app.get("/api/v1/getData", (req, res) => {
    try {
        const file = fs.readFileSync("./DB.csv", "utf8")
        res.status(200).send(file)
    } catch (error) {
        console.log(error);
    }
})

app.post("/api/v1/postData", async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({ message: "please provide an ID" })
        }
        let found = false
        let person;
        for (let i = 0; i < jsonDB.length; i++) {
            if (id === jsonDB[i].id) {
                found = true
                if (jsonDB[i].checked === "true") {
                    return res.status(300).json({ message: "Person allready checked" })
                }
                jsonDB[i].checked = "true"
                person = jsonDB[i]
            }
        }
        if (!found) {
            return res.status(404).json({ message: "Person not found!" })
        }
        converter.json2csv(jsonDB, (err, csv) => {
            fs.writeFileSync("./DB.csv", csv)
        })
        res.status(200).json({
            email: person.email,
            username: person.username,
            teamName: person.teamName,
            tShirt: person.tShirt,
            // firstname: person.firstname,
            // lastname: person.lastname,
            // workshop: person.domain,
            // message: `${person.email} : ${person.firstname} ${person.lastname} ${person.domain}`
        })
    } catch (error) {
        console.log(error);
    }
})

const port = 5001
start()

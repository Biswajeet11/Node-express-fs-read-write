const express = require('express');
const app = express();
const fs = require('fs');
const jsonFile = 'student.json';
const encode = 'utf-8';
const PORT = 3010;
app.use(express.json());

app.get('/students', function (req, res) {
    fs.readFile(jsonFile, encode, function (err, student) {
        const studentData = JSON.parse(student)
        res.json(studentData)
    })
})
app.post('/students', function (req, res) {
    const students = []
    fs.readFile(jsonFile, encode, function (err, data) {
        if (err) {
            res.json(err)
        }
        else {
            const student = req.body
            const _id = Date.now()
            Object.assign(student, { _id })
            students.push(student)
            fs.writeFile(jsonFile, JSON.stringify(students), function (err) {
                if (err) {
                    return console.log(err);
                }
                res.json({ notice: 'Post has been saved', students })
            });
        }
    })
})

app.put('/students/:id', function (req, res) {
    const id = req.params.id
    const student = req.body
    fs.readFile(jsonFile, encode, function (err, data) {
        if (err) {
            res.json(err)
        }
        else {
            const students = [JSON.parse(data)]
            console.log(students)
            const studentData = students.find((student) => {
                return student._id === Number(id)
            })
            if (studentData) {
                Object.assign(studentData, student)
                fs.writeFile(jsonFile, JSON.stringify(studentData), function (err) {
                    if (err) {
                        res.json({ err })
                    }
                    else {
                        res.json({ notice: 'Data has been updated', studentData })
                    }
                })
            }
        }
    })
})

app.listen(PORT, () => { console.log(`listening to ${PORT}`) })
const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
 
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const db = mysql.createPool({
    host: 'sql11.freesqldatabase.com', // the host name MYSQL_DATABASE: node_mysql
    user: 'sql11508435', // database user MYSQL_USER: MYSQL_USER
    password: 'tC9x8FIxXi', // database user password MYSQL_PASSWORD: MYSQL_PASSWORD
    database: 'sql11508435' // database name MYSQL_HOST_IP: mysql_db
  })
// const urlencodedParser = express.urlencoded({extended: false});
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(bodyParser.json())
app.use(cors());




app.post("/api",  function (request, response) {
    if(!request.body) return response.status(400);
    let userId = 0;
    // response.send(`${request.body.name} - ${request.body.email} - ${request.body.message}`);
    const SelectUserInfoId = `SELECT ID FROM UserInfo WHERE Email = ?`;
    db.query(SelectUserInfoId, request.body.email ,(err, result) => {
        userId = result[0].ID
        if(result.length == 0) {
            const InsertIntoUserInfo = `INSERT INTO UserInfo
            ( Email, Name ) VALUES(?, ?)`

            db.query(InsertIntoUserInfo, [request.body.email, request.body.name], (err, result) => {
                db.query(SelectUserInfoId, request.body.email ,(err, result) => {
                    userId = result[0].ID
                })
            })
        }
        const InsertIntoMessage =`INSERT INTO Message
        ( UserId, Content ) VALUES(?, ?)`

        db.query(InsertIntoMessage, [ userId, request.body.message], (err, result) => {const GetAllMessage = `SELECT Content FROM Message WHERE UserId = ?`
            db.query(GetAllMessage, userId, (err, result) => {
            console.log("my" + result)
            return response.status(200).json({ result });
        })

        })
    })
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})



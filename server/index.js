const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
 
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const pool = mysql.createPool({
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




app.post("/api", async function (request, response) {
    if(!request.body) return response.status(400);
    let userId = 0;
    // response.send(`${request.body.name} - ${request.body.email} - ${request.body.message}`);

    try{
        let allIdByEmail = await SelectUserInfoIdByEmail(request.body.email);
        if(allIdByEmail.length == 0) 
        {
            await InsertIntoUserInfo(request.body.email, request.body.name)
            let allIdByEmailafterInsert = await SelectUserInfoIdByEmail(request.body.email);
            userId = allIdByEmailafterInsert[0].ID
        }
        else{
            userId = allIdByEmail[0].ID
        }
        await InsertIntoMessage(userId, request.body.message)
        const allMessageByUserId = await GetAllMessageByUserId(userId)
        return response.status(200).json({ allMessageByUserId });
    } 
    catch(error){
        console.log(error)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})


SelectUserInfoIdByEmail = (email) =>{
    const SelectUserInfoId = `SELECT ID FROM UserInfo WHERE Email = ?`;
    return new Promise((resolve, reject)=>{
        pool.query(SelectUserInfoId, email, (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

InsertIntoMessage = (userId, message) =>{
    const InsertIntoMessage =`INSERT INTO Message ( UserId, Content ) VALUES(?, ?)`
    return new Promise((resolve, reject)=>{
        pool.query(InsertIntoMessage, [userId, message] ,(error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

GetAllMessageByUserId = (userId) =>{
    const GetAllMessage = `SELECT Content FROM Message WHERE UserId = ?`
    return new Promise((resolve, reject)=>{
        pool.query(GetAllMessage, userId,(error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

InsertIntoUserInfo = (email, name) =>{
    const InsertIntoUserInfo = `INSERT INTO UserInfo ( Email, Name ) VALUES(?, ?)`
    return new Promise((resolve, reject)=>{
        pool.query(InsertIntoUserInfo, [email, name],(error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

InsertIntoUserInfo
const crypto = require('crypto');

const secret = 'abcdefg';
const users = [
    {id:1, username: 'anjan', password:'6fabd6ea6f1518592b7348d84a51ce97b87e67902aa5a9f86beea34cd39a6b4a'},
    {id:2, username: 'khaled', password:'6fabd6ea6f1518592b7348d84a51ce97b87e67902aa5a9f86beea34cd39a6b4a'}
];

exports.authenticate = (username, password) =>{

const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex');
    return users.find( (user)=>{
        return user.username === username && user.password === hash;
    });
}


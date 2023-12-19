const config = require('../../config/config.js');

switch (config.persistence) {
    case "MONGO":
        const UsersMongo = require ('../classes/user.dao.js')
        Users = new UsersMongo ();
        break
    case "MEMORY":
        const UsersMemory= require('../memory/user.memory.js');
        Users = new UsersMemory;
        break;
}

module.exports = Users;
const { Sequelize } = require('sequelize');
const Store = require('electron-store');

const store = new Store();
const hostname = store.get('hostname');
const database = store.get('database');
const username = store.get('username');
const password = store.get('password');

const dbConnect = () => {
    return sequelize = new Sequelize(database, username, password, {
        host: hostname,
        dialect: 'mysql'
    });
}

module.exports = dbConnect;
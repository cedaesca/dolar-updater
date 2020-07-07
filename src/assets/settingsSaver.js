const { remote, ipcRenderer } = require('electron');
const Store = require('electron-store');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const hostname = document.getElementById('hostname').value;
        const database = document.getElementById('database').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        store.set('hostname', hostname);
        store.set('database', database);
        store.set('username', username);
        store.set('password', password);

        ipcRenderer.send('settings-saved');

        remote.getCurrentWindow().close();
    });
});
const Store = require('electron-store');

const store = new Store();

document.addEventListener('DOMContentLoaded', () => {
    if (
        store.get('hostname') === undefined ||
        store.get('database') === undefined ||
        store.get('username') === undefined ||
        store.get('password') === undefined
    ) {
        document.querySelector('input').setAttribute('disabled', 'disabled');
        document.querySelector('select').setAttribute('disabled', 'disabled');
        document.querySelector('button').setAttribute('disabled', 'disabled');

        Swal.fire({
            title: '¡Configuración requerida!',
            text: 'Debe configurar la base de datos para poder utilizar la aplicación',
            icon: 'warning'
        });
    }
});
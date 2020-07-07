document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('settings-saved', () => {
        Swal.fire({
            title: '¡Se han guardado los valores de la base de datos!',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

        document.querySelector('input').removeAttribute('disabled');
        document.querySelector('select').removeAttribute('disabled');
        document.querySelector('button').removeAttribute('disabled');
    });
});
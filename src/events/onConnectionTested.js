document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('connection-tested', (event, arg) => {
        console.log(arg);
        if (arg) {
            return Swal.fire({
                title: 'Conexión con la base de datos exitosa',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }

        Swal.fire({
            title: 'Ocurrió un error en la conexión con la base de datos',
            icon: 'error'
        });
    });
});
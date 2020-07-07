const { Sequelize, QueryTypes } = require('sequelize');

const hostname = store.get('hostname');
const database = store.get('database');
const username = store.get('username');
const password = store.get('password');

sequelize = new Sequelize(database, username, password, {
    host: hostname,
    dialect: 'mysql'
});

document.addEventListener('DOMContentLoaded', async () => {
    let currencies = await sequelize.query('SELECT `codigo`, `nombre`, `ultimacotizacion` FROM `monedas`', {
        type: QueryTypes.SELECT
    });

    currencies = currencies.map(currency => {
        currency.nombre.trim();
        
        return currency;
    });

    const $currency = document.querySelector('#currency');

    $currency.innerHTML = '';
    
    currencies.forEach(currency => {
        $currency.innerHTML += `
            <option value="${currency.codigo}">
                ${currency.nombre}
            </option>
        `;
    });

    const $newCurrencyValue = document.querySelector('#newCurrencyValue');

    $newCurrencyValue.value = currencies[0].ultimacotizacion;

    $currency.addEventListener('change', event => {
        const currency = currencies.find(element => element.codigo === event.target.value);

        $newCurrencyValue.value = currency.ultimacotizacion;
    });

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();

        const currency = currencies.find(element => element.codigo === $currency.value);

        Swal.fire({
            title: '¡Atención!',
            icon: 'warning',
            text: `
                En caso de continuar, el nuevo valor de ${currency.nombre} será de Bs. ${$newCurrencyValue.value} y en consecuencia se actualizará el valor de los productos que la utilicen.
            `,
            showCancelButton: true
        }).then(async result => {
            if (!result.value) {
                return event.preventDefault();
            }

            const newCurrencyValue = parseFloat($newCurrencyValue.value);

            let query = `
                UPDATE
                    articulo
                SET
                    costo = (costo / factor) * $newCurrencyValue,
                    factor = $newCurrencyValue
                WHERE
                    codigotipoprod = $codigo
            `;

            try {
                await sequelize.query(query, {
                    bind: { newCurrencyValue, codigo: currency.codigo},
                    type: QueryTypes.UPDATE
                });
            } catch (ex) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al actualizar el valor de los productos.',
                    text: ex
                });
            }

            query = `
                UPDATE
                    monedas
                SET
                    ultimacotizacion = $newCurrencyValue
                WHERE   
                    codigo = $codigo
            `;

            try {
                await sequelize.query(query, {
                    bind: { newCurrencyValue, codigo: currency.codigo},
                    type: QueryTypes.UPDATE
                });
            } catch (ex) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error al actualizar el valor de la moneda.',
                    text: ex
                });
            }
            
            Swal.fire({
                title: 'Se ha actualizado el valor correctamente',
                icon: 'success'
            });
        });
    });
});



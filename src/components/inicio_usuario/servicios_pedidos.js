import React, { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Servicio_pedido = () => {
    const { usuario, message } = useSelector(state => ({
        usuario: state.redux_reducer.usuario,
        message: state.redux_reducer.message,
    }));
    const dispatch = useDispatch();
    return (
        <Fragment>
            <h1>
                {JSON.stringify(usuario)}
            </h1>
        </Fragment>
    )
}
export default Servicio_pedido;
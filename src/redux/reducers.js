import {
    SUCCESS_LOGIN_EMPLEADO,
    ERROR_LOGIN_EMPLEADO,
}
    from './actions';

const initialState = {
    empleado: { cedula: '' },
    message: 'Hola redux',
    cargando: false,
};

function redux_reducer(state = initialState, action) {
    switch (action.type) {
        case SUCCESS_LOGIN_EMPLEADO:
            return { ...state, empleado: action.payload };
        case ERROR_LOGIN_EMPLEADO:
            return { ...state, empleado: action.payload };
        default:
            return state;
    }
}
export default redux_reducer;
import {
    SUCCESS_LOGIN_EMPLEADO,
    ERROR_LOGIN_EMPLEADO,
    SET_COORDINATES,
    SET_ADDRESS,
    SET_CEDULA,
    SET_NOMBRE,
    SET_APELLIDO,
    SET_CELULAR,
    SET_CORREO,
    SET_CONTRASENHA,
    SET_SERVICIOS,
    SUBIO_FOTO,
    SUBIO_CEDULA
}
    from './actions';

const initialState = {
    empleado: { cedula: '', nombre:'', apellido: '', celular:'', correo:'', contrasenha:'', servicios:''},
    message: 'Hola redux',
    cargando: false,
    coordenadas: {lat: 3.382225, lng: -76.531584},
    direccion : '',
    subio_fot: false,
    subio_doc: false
};

function redux_reducer(state = initialState, action) {
    switch (action.type) {
        case SUCCESS_LOGIN_EMPLEADO:
            return { ...state, empleado: action.payload };
        case ERROR_LOGIN_EMPLEADO:
            return { ...state, empleado: action.payload };
        case SET_COORDINATES:
            return { ...state, coordenadas: action.payload };
        case SET_ADDRESS:
            return { ...state, direccion: action.payload };
        case SET_CEDULA:
            return { ...state, empleado: {...state.empleado,cedula: action.payload}};
        case SET_NOMBRE:
            return { ...state, empleado: {...state.empleado,nombre: action.payload}};
        case SET_APELLIDO:
            return { ...state, empleado: {...state.empleado,apellido: action.payload}};
        case SET_CORREO:
            return { ...state, empleado: {...state.empleado,correo: action.payload}};
        case SET_CONTRASENHA:
            return { ...state, empleado: {...state.empleado,contrasenha: action.payload}};
        case SET_SERVICIOS:
            return { ...state, empleado: {...state.empleado,servicios: action.payload}};
        case SET_CELULAR:
            return { ...state, empleado: {...state.empleado,celular: action.payload}};
        case SUBIO_FOTO:
            return { ...state, subio_fot: action.payload}
        case SUBIO_CEDULA:
            return { ...state, subio_doc: action.payload}
        default:
            return state;
    }
}
export default redux_reducer;
import {
    SUCCESS_LOGIN,
    ERROR_LOGIN,
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
    SUBIO_CEDULA,
    SUBIO_RECIBO,
    SET_NAVBAR
}
    from './actions';

const initialState = {
    usuario: { id: '', cedula: '', nombre: '', apellido: '', celular: '', correo: '', contrasenha: '', servicios: '' },
    message: 'Hola redux',
    cargando: false,
    coordenadas: { lat: 3.382225, lng: -76.531584 },
    direccion: '',
    subio_fot: false,
    subio_doc: false,
    subio_recibo: false,
    nav_bar: 'principal',
};

function redux_reducer(state = initialState, action) {
    switch (action.type) {
        case SUCCESS_LOGIN:
            return { ...state, usuario: action.payload};
        case ERROR_LOGIN:
            return { ...state, usuario: action.payload };
        case SET_COORDINATES:
            return { ...state, coordenadas: action.payload };
        case SET_ADDRESS:
            return { ...state, direccion: action.payload };
        case SET_CEDULA:
            return { ...state, usuario: { ...state.usuario, cedula: action.payload } };
        case SET_NOMBRE:
            return { ...state, usuario: { ...state.usuario, nombre: action.payload } };
        case SET_APELLIDO:
            return { ...state, usuario: { ...state.usuario, apellido: action.payload } };
        case SET_CORREO:
            return { ...state, usuario: { ...state.usuario, correo: action.payload } };
        case SET_CONTRASENHA:
            return { ...state, usuario: { ...state.usuario, contrasenha: action.payload } };
        case SET_SERVICIOS:
            return { ...state, usuario: { ...state.usuario, servicios: action.payload } };
        case SET_CELULAR:
            return { ...state, usuario: { ...state.usuario, celular: action.payload } };
        case SUBIO_FOTO:
            return { ...state, subio_fot: action.payload }
        case SUBIO_CEDULA:
            return { ...state, subio_doc: action.payload }
        case SUBIO_RECIBO:
            return { ...state, subio_recibo: action.payload }
        case SET_NAVBAR:
            return { ...state, nav_bar: action.payload }
        default:
            return state;
    }
}
export default redux_reducer;
export const ERROR_LOGIN = 'ERROR_LOGIN';
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN';
export const SET_COORDINATES = 'SET_COORDINATES';
export const SET_ADDRESS = 'SET_ADDRESS';
export const SET_CEDULA = 'SET_CEDULA';
export const SET_NOMBRE = 'SET_NOMBRE';
export const SET_APELLIDO = 'SET_APELLIDO';
export const SET_CELULAR = 'SET_CELULAR';
export const SET_CORREO = 'SET_CORREO';
export const SET_CONTRASENHA = 'SET_CONTRASENHA';
export const SET_SERVICIOS = 'SET_SERVICIOS';
export const SUBIO_FOTO = 'SUBIO_FOTO';
export const SUBIO_CEDULA = 'SUBIO_CEDULA';
export const SUBIO_RECIBO = 'SUBIO_RECIBO';
export const SET_NAVBAR = 'SET_NAVBAR';

//******************LOGIN*******************
export const success_login = payload => {
    return {
        type: SUCCESS_LOGIN,
        payload
    }
}
export const error_login = payload => {
    return {
        type: ERROR_LOGIN,
        payload
    }
}
export const set_coordinates = payload => {
    return {
        type: SET_COORDINATES,
        payload
    }
}
export const set_Address = payload => {
    return {
        type: SET_ADDRESS,
        payload
    }
}
export const set_cedula = payload => {
    return {
        type: SET_CEDULA,
        payload
    }
}
export const set_nombre = payload => {
    return {
        type: SET_NOMBRE,
        payload
    }
}
export const set_apellido = payload => {
    return {
        type: SET_APELLIDO,
        payload
    }
}
export const set_correo = payload => {
    return {
        type: SET_CORREO,
        payload
    }
}
export const set_celular = payload => {
    return {
        type: SET_CELULAR,
        payload
    }
}
export const set_contrasenha = payload => {
    return {
        type: SET_CONTRASENHA,
        payload
    }
}
export const set_servicios = payload => {
    return {
        type: SET_SERVICIOS,
        payload
    }
}
export const subio_foto = payload => {
    return {
        type: SUBIO_FOTO,
        payload
    }
}
export const subio_cedula = payload => {
    return {
        type: SUBIO_CEDULA,
        payload
    }
}
export const subio_recibo = payload => {
    return {
        type: SUBIO_RECIBO,
        payload
    }
}
export const set_navbar = payload => {
    return {
        type: SET_NAVBAR,
        payload
    }
}

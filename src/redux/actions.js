export const ERROR_LOGIN_EMPLEADO = 'ERROR_LOGIN_EMPLEADO';
export const SUCCESS_LOGIN_EMPLEADO = 'SUCCESS_LOGIN_EMPLEADO';

//******************LOGIN*******************
export const success_login_empleado = payload => {
    return {
        type: SUCCESS_LOGIN_EMPLEADO,
        payload
    }
}
export const error_login_empleado = payload => {
    return {
        type: ERROR_LOGIN_EMPLEADO,
        payload
    }
}

import React, { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Table,Button, TableBody, TableCell, TableContainer,Switch, TableHead, TableRow, Paper, TablePagination} from '@material-ui/core';

const useStyles = makeStyles({
    table: {
        width: '100%',
    },
    container: {
        maxHeight: 400,
    },
});


const Servicio_pedido = () => {
    const { usuario, message } = useSelector(state => ({
        usuario: state.redux_reducer.usuario,
        message: state.redux_reducer.message,
    }));
    const dispatch = useDispatch();
    // INITIAL STATE
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [servicios_pedidos, set_servicios_pedidos] = React.useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        fetch('http://localhost:4000/get_ultimos_servicios_pedidos', {
                    method: 'POST',
                    body: JSON.stringify({
                        usuario_id: usuario.id,
                        estado_servicio_id: 'PENDIENTE',
                        limite: 2
                    }), // data can be `string` or {object}!
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(response => {
                        if (response.status === 200) {
                            set_servicios_pedidos(response.servicios);
                        }
                        else {
                            set_servicios_pedidos(response.servicios);
                        }
                    })
                    .catch(error => {
                        alert(error);
                    });
      },[]);


    return (
        <Fragment>
            <h1 style={{ textAlign: 'center' }}><u>Ultimos Servicios Solicitados</u></h1>
            <br></br>
            <Paper className={classes.root}>
                <TableContainer className={classes.container}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nro</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Empleado</TableCell>
                                <TableCell>Es por horas?</TableCell>
                                <TableCell>Precio x hora</TableCell>
                                <TableCell>Precio x unidad</TableCell>
                                <TableCell># de horas</TableCell>
                                <TableCell># de unidades</TableCell>
                                <TableCell>Valor a Pagar</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Finalizar/Cancelar</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {servicios_pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.servicio_pedido_id}>
                                        <TableCell>{row.servicio_pedido_id}</TableCell>
                                        <TableCell>{row.fecha}</TableCell>
                                        <TableCell>{row.trabajador_cedula}</TableCell>
                                        <TableCell>
                                        <Switch
                                            checked={row.servicio_pedido_es_por_hora}
                                            name="checked"
                                            color="primary"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                        </TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora?row.servicio_precio_hora:"No Aplica"}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora?"No Aplica":row.servicio_precio_unidad_labor}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora?row.servicio_pedido_horas:"No Aplica"}</TableCell>
                                        <TableCell>{row.servicio_pedido_es_por_hora?"No Aplica":row.servicio_pedido_unidad_labor}</TableCell>
                                        <TableCell>{row.valor_servicio}</TableCell>
                                        <TableCell>{row.estado_servicio_id}</TableCell>
                                        <TableCell>Cambiar</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={servicios_pedidos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </Fragment>
    )
}
export default Servicio_pedido;
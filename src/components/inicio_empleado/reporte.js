import React, { useState, Fragment, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
import { Doughnut } from 'react-chartjs-2';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';


function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});
const data = {
  labels: [
    'Red',
    'Green',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ],
    hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56'
    ]
  }]
};
export default function Reporte() {
  const { usuario, message } = useSelector(state => ({
    usuario: state.redux_reducer.usuario,
    message: state.redux_reducer.message,
  }));
  const [data, set_data] = useState({
    labels: [],
    datasets: [
        {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: []
        }
    ]
  });
  const dispatch = useDispatch();

  useEffect(() => {
    //OBTENEMOS EL SALDO DEL USUARIO
    fetch('http://localhost:4000/get_reporte_profesion_empleado', {
        method: 'POST',
        body: JSON.stringify({
          trabajador_cedula: usuario.cedula
        }), // data can be `string` or {object}!
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            if (response.status === 200) {
              set_data(response.char);
            }
            else {
              set_data(response.char);
            }
        })
        .catch(error => {
            console.log(error);
        });
}, []);

  const classes = useStyles();
  return (
    <Fragment>
      <h2 style={{textAlign:'center', color:'gray'}}>SERVICIOS MÁS SOLICITADOS</h2>
      <div
        style={{
          width: '100%',
          height: '100%',
          textAlign: 'center'
        }}
      >
        <Doughnut data={data} />
      </div>
    </Fragment>
  );
}
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2'


const similarCustomSA = {
  width: 600,
  padding: '3em',
  color: '#fff',
  background: '#343434',
  backdrop: `
    #00000066
    left top
    no-repeat
  `,
  confirmButtonColor: '#F96400',
  confirmButtonText: 'Continuar'
}


const FormEnviaFeedback = ({ handleClose, info }) => {

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nota: info.feedback ? info.feedback.nota : 0,
      feedback: info.feedback ? info.feedback.feedback : ''
    },
    validationSchema: Yup.object({
      nota: Yup
        .string()
        .max(10)
        .min(0)
        .required('Nota obrigatoria'),
      feedback: Yup
        .string()
        .max(255)
        .required('Feedback obrigatorio')
    }),
    onSubmit: async () => {
      await axios.post(`http://localhost:8080/usuario/desafio/feedback`,{
        nota: formik.values.nota,
        feedback: formik.values.feedback,
        id_usuario: info.id_usuario,
        id_desafio: info.id_usuario_desafio_conclusao,
        id_responsavel: 11
      }).then(res => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'success',
          title: 'Feedback enviado com sucesso',
          showConfirmButton: false,
          timer: 1700
        })
        router.reload();
      }).catch(error => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'error',
          title: 'Erro ao enviar o feedback!',
          showConfirmButton: false,
          timer: 1700
        })
      })
    }
  });

  return (
    <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
        }}

      >
        <Container
          maxWidth="sm"
          sx={{
            background: '#232323',
            alignItems: 'center',
            minWidth: 400,
            height: 380,
            overflowX: 'hidden',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 2,
            '&::-webkit-scrollbar': {
              height: '0.4em',
              width: 8
            },
            '&::-webkit-scrollbar-track': {
              '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(16,16,16,.9)',
              borderRadius: 25,
            },
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3}}>
              <Typography
                color='white'
                variant="h6"
              >
                Feedback
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                O feedback é muito importante para o acolhimento do colaborador.
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.nota && formik.errors.nota)}
              fullWidth
              helperText={formik.touched.nota && formik.errors.nota}
              label="Nota"
              margin="normal"
              name="nota"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.nota}
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(formik.touched.feedback && formik.errors.feedback)}
              fullWidth
              helperText={formik.touched.feedback && formik.errors.feedback}
              label="Feedback"
              margin="normal"
              name="feedback"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.feedback}
              type="text"
              variant="outlined"
            />

            <Box sx={{ py: 2, display: 'flex', justifyContent:'space-between'}}>
              <Button
                color="error"
                onClick={handleClose}
                fullWidth
                size="large"
                type="button"
                variant="contained"
                sx={{
                  width: '45%'
                }}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{
                  width: '45%'
                }}
              >
                Enviar
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
  );
};

export default FormEnviaFeedback;

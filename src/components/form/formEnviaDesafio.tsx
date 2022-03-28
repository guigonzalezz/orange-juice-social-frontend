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


const FormEnviaDesafio = ({ handleClose, desafio, idUsuario }) => {

  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      link: '',
      anotacao: ''
    },
    validationSchema: Yup.object({
      link: Yup
        .string()
        .required('Link obrigatorio'),
      anotacao: Yup
        .string()
        .max(255)
    }),
    onSubmit: async () => {
      await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/desafio`,{
        id_usuario: idUsuario,
        desafio_nome: desafio.titulo,
        categoria: desafio.cargo,
        anotacao: formik.values.anotacao,
        desafio_url: formik.values.link
      }).then(res => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'success',
          title: 'Desafio enviado com sucesso',
          showConfirmButton: false,
          timer: 1700
        })
        router.reload();
      }).catch(error => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'error',
          title: 'Erro ao enviar o desafio!',
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

            height: 460,
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
                Concluir desafio
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Parabéns por concluir o desafio, adicione seu link no campo abaixo e caso queira adicione uma anotação também.
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.link && formik.errors.link)}
              fullWidth
              helperText={formik.touched.link && formik.errors.link}
              label="Link"
              margin="normal"
              name="link"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.link}
              type="text"
              variant="outlined"
            />

            <TextField
              error={Boolean(formik.touched.anotacao && formik.errors.anotacao)}
              fullWidth
              helperText={formik.touched.anotacao && formik.errors.anotacao}
              label="Anotação"
              margin="normal"
              name="anotacao"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.anotacao}
              type="textarea"
              variant="outlined"
              multiline
              rows={3}
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

export default FormEnviaDesafio;

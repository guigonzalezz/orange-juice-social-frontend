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


const FormAlteraCargo = ({ handleClose, cargo }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      nome: cargo.nome,
    },
    validationSchema: Yup.object({
      nome: Yup
        .string()
        .max(255)
        .required('Nome obrigatorio'),
    }),
    onSubmit: async () => {
      await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/cargo/atualizar/${cargo.id_cargo}`,{
        nome: formik.values.nome,
      }).then(res => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'success',
          title: 'Alterado com sucesso',
          showConfirmButton: false,
          timer: 1700
        })
        router.reload();
      }).catch(error => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'error',
          title: 'Erro ao realizar alteracao!',
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
            height: 300,
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
                Alterar Cargo
              </Typography>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="body2"
              >
                Digite o novo nome para dar continuidade na alteracao do cargo.
              </Typography>
            </Box>
            <TextField
              error={Boolean(formik.touched.nome && formik.errors.nome)}
              fullWidth
              helperText={formik.touched.nome && formik.errors.nome}
              label="Nome completo"
              margin="normal"
              name="nome"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.nome}
              variant="outlined"
            />

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Alterar
              </Button>
            </Box>
          </form>
        </Container>
      </Box>
  );
};

export default FormAlteraCargo;

import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2'
import { Box, Button, Container, TextField, Typography, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { LoadingButton } from '@mui/lab';
import Router from 'next/router';


const Login = () => {
  const [carregando, setCarregando] = useState(false)
  const { signIn } = useContext(AuthContext)
  const [popupError, setPopupError] = useState(false)
  const [popupMensagem, setPopupMensagem] = useState("")
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
  const similarInputSA = {
    maxlength: '10',
    autocapitalize: 'off',
    autocorrect: 'off'
  }


  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email(
          'Email invalido')
        .max(255)
        .required(
          'Necessario digitar o email'),
      password: Yup
        .string()
        .max(255)
        .required(
          'Necessario digitar a senha')
    }),
    onSubmit: async (values) => {
      setCarregando(true)
      const possibleMessage = await signIn({
        email: values.email,
        senha: values.password
      }).then(res => {
      })
      if(possibleMessage != undefined) {
        handleOpenError(possibleMessage)
      } else {
        Router.push('/home');
      }
    }
  });

  const handleOpenError = (message) => {
    setPopupMensagem(message)
    setPopupError(true)
  }

  const handleCloseError = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopupError(false);
  };

  const handleForgotPassword = async () => {
    const email = formik.values.email
    if(email) {
      let code = ""
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/recuperacao_senha?email=${email}`)
        .then(res => {
          code = res.data
        })

      const { value } = await Swal.fire({
        ...similarCustomSA,
        title: 'Recupera????o de senha',
        input: 'text',
        inputLabel: 'Pegue o c??digo enviado em seu e-mail',
        inputPlaceholder: 'Digite o codigo.',
        inputAttributes: similarInputSA
      })

      if (code == value) {
        const { value: novaSenha } = await Swal.fire({
          ...similarCustomSA,
          title: 'Digite sua nova senha',
          input: 'password',
          inputAttributes: similarInputSA
        })

        await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/alterar_senha_nova`, {
          email,
          senha_nova: novaSenha
        }, {}).then(res=>{
          if(res.data == 'Senha atualizada') {
            Swal.fire({
              ...similarCustomSA,
              icon: 'success',
              title: 'Sua senha foi atualizada com sucesso!',
              showConfirmButton: false,
              timer: 3000
            })
          } else {
            Swal.fire({
              ...similarCustomSA,
              icon: 'error',
              title: 'Erro ao atualizar senha!',
              showConfirmButton: false,
              timer: 3000
            })
          }
        }).catch(({response})=>{
          Swal.fire({
            ...similarCustomSA,
            icon: 'error',
            title: 'Erro ao atualizar senha!',
            showConfirmButton: false,
            timer: 3000
          })
        })
      }
    } else {
      Swal.fire({
        ...similarCustomSA,
        icon: 'error',
        title: 'Digite seu e-mail!',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  return (
    <>
      <Head>
        <title>Login | Orange Juice</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container
          sx={{ width: 400, backgroundColor: '#282828' }}
          maxWidth="sm"
        >
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'space-between'}}>
              <Box>
                <Typography
                  color="textPrimary"
                  variant="h4"
                >
                  Login
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  Torne-se o protagonista da sua hist??ria.
                </Typography>
              </Box>
              <img
                width={80}
                height={80}
                src='./logo_cor3.png'
                alt="logo orange juice"
                aria-label='logo orange juice'
              />
            </Box>

            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Endere??o de email"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Senha"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <LoadingButton
                loading={carregando}
                loadingIndicator={<CircularProgress color="inherit" size={16} />}
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{background: 'linear-gradient(#FECE00, #F96400)'}}
              >
                Login
              </LoadingButton>
            </Box>
          </form>
          <Box sx={{ mb: 3, cursor: 'pointer'}}>
            <Typography
              onClick={()=>{handleForgotPassword()}}
              color="text.secondary"
            >
              Esqueceu sua senha?
            </Typography>
          </Box>
        </Container>
        <Container sx={{
          mt: 10,
          position: 'absolute',
          bottom: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <img
            src='/logo-fcamara.png'
            alt="logo fcamara"
            aria-label='logo fcamara'
          />
        </Container>
      </Box>
      <Snackbar
        open={popupError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical:'top', horizontal:'center'}}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseError}
          severity="error"
          sx={{ width: 300 }}
        >
          {popupMensagem}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  if (token) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      }
    }
  }
  return {
    props: {

    }
  }
}

export default Login;


import { CardMedia, Typography } from '@mui/material';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import { theme } from '../../styles/theme';


const videos = [
  {
    isAdmin: true,
    titulo: 'Orange Juice Social - Apresentação inicial',
    link: 'https://www.youtube.com/embed/VGPHE_CCFJA',
  },
  {
    isAdmin: true,
    titulo: 'Orange Juice Social -  Administração do Contentful',
    link: 'https://www.youtube.com/embed/5VmjQPPmYu0',
  },
  {
    isAdmin: true,
    titulo: 'Orange Juice Social - Usuários e Cargos',
    link: 'https://www.youtube.com/embed/A5ZCxlleb_A',
  },
  {
    isAdmin: true,
    titulo: 'Orange Juice Social - Desafios e Relatórios',
    link: 'https://www.youtube.com/embed/_s7aPTanGPI',
  },
  {
    isAdmin: false,
    titulo: 'Orange Juice Social - Visão do Colaborador',
    link: 'https://www.youtube.com/embed/j216P9guvCA',
  }
];


const Tutorial = (props) => {
  const { usuario } = props
  const isAdmin = usuario.cargo == 'admin'
  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={isAdmin}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          Tutorial | Orange Juice
        </title>
      </Head>

      <Box
          component="main"
          sx={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 2,
            mt: 2,
            ml: -10,
            [theme.breakpoints.down(1200)]: { ml: 0 }
          }}
        >
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Tutorial
          </Typography>
          {
            videos.map(video => {

              if(isAdmin == video.isAdmin) {
                return (
                  <Box sx={{
                    my: '30px'

                  }}>
                    <Typography fontSize={24}>{video.titulo}</Typography>
                    <CardMedia
                      component='iframe'
                      height="400"
                      title={video.titulo}
                      src={video.link}
                    />
                  </Box>
                )
              }
            })
          }

      </Box>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0
  }

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  else{
    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/auth/usuario`, {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        usuario = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuario.id_usuario}`)
      .then(res => {
        usuario = res.data
      })
  }

  return {
    props: {
      usuario
    }
  }
}

export default Tutorial

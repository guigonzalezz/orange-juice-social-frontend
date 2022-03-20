
import { Typography } from '@mui/material';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { Box, Container, Grid } from '@mui/material';
import { DashboardLayout } from '../../components/dashboard-layout';
import { Noticias } from '../../components/home/noticias';
import { Blog } from '../../components/home/blog';
import { Eventos } from '../../components/home/eventos';
import { Calendario } from '../../components/home/calendario';



const Home = (props) => {
  const {
    usuario,
    noticias,
    blogs,
    eventos
  } = props

  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={usuario.cargo == 'admin'}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          Home | Orange Juice
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={12}// number of columns,  estava 9, breakpoint lg
              md={12}// number of columns, breakpoint md
              xl={9}// number o columns, breakpoint xl
              xs={12}// number o columns, breakpoint xs
            >
              <Typography sx={{fontSize: 28}}>Noticias</Typography>
              <Noticias info={noticias}/>
            </Grid>



            <Grid
              item
              lg={12}
              md={12}
              xl={9}
              xs={12}
              sx={{mb:5}}
            >
              <Typography sx={{fontSize: 28}}>Blog</Typography>
              <Blog info={blogs}/>
            </Grid>

            <Grid
              item
              lg={6}
              md={6}
              xl={3}
              xs={12}
            >
              <Typography sx={{fontSize: 28}}>Calendario</Typography>
              <Calendario info={eventos} />
            </Grid>

            <Grid
              item
              lg={6}
              md={6}
              xl={3}
              xs={12}
            >
              <Typography sx={{fontSize: 28}}>Eventos e Reunioes</Typography>
              <Eventos info={eventos} />
            </Grid>

          </Grid>
        </Container>
      </Box>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0
  }
  let noticias = []
  let blogs = []
  let eventos = []

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

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/contentful/entries/home`)
      .then(res => {
        const {
          resultNoticias,
          resultEventos,
          resultBlogs
        } = res.data

        noticias = resultNoticias
        blogs = resultBlogs
        eventos = resultEventos
      })
  }

  return {
    props: {
      usuario,
      noticias,
      blogs,
      eventos
    }
  }
}

export default Home

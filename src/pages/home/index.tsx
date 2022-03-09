
import { Button, Typography } from '@mui/material';
import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../../components/dashboard/budget';
import { LatestOrders } from '../../components/dashboard/latest-orders';
import { LatestProducts } from '../../components/dashboard/latest-products';
import { Sales } from '../../components/dashboard/sales';
import { TasksProgress } from '../../components/dashboard/tasks-progress';
import { TotalCustomers } from '../../components/dashboard/total-customers';
import { TotalProfit } from '../../components/dashboard/total-profit';
import { TrafficByDevice } from '../../components/dashboard/traffic-by-device';
import { DashboardLayout } from '../../components/dashboard-layout';
import { UsuarioContext } from '../../contexts/UsuarioContext';
import { Noticias } from '../../components/home/noticias';



const Home = (props) => {
  const { setUser } = useContext(UsuarioContext)
  const {
    usuario,
    noticias,
    blogs,
    eventos
  } = props
  const isAdmin = usuario.cargo == 'admin'//exibe opcoes do menu diferente

  useEffect(()=>{
    setUser(usuario)
  },[])


  return (
    <DashboardLayout avatarLink={usuario.avatar_link} isAdmin={usuario.cargo == 'admin'}>
      <Head>
        <title>
          Home | Orange Juice
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <Noticias info={noticias}/>
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <TrafficByDevice sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts sx={{ height: '100%' }} />
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <LatestOrders />
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
    await axios.get('http://localhost:8080/auth/usuario', {headers:{
      "Authorization": `Bearer ${token}`
    }})
      .then(res => {
        usuario = res.data
      })

    await axios.get(`http://localhost:8080/usuario/buscar?id_usuario=${usuario.id_usuario}`)
      .then(res => {
        usuario = res.data
      })

    await axios.get('http://localhost:8080/contentful/entries/home')
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

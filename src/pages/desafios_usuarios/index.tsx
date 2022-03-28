import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Typography } from '@mui/material';

import React, { useState } from 'react';
import { Desafio } from '../../components/shared/Desafio';

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

const DesafiosUsuarios = ({ usuario, desafios }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={false}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Desafios | Orange Juice`}
        </title>
      </Head>

      {desafios.length > 0 ?
        <Box
          component="div"
          sx={{
            backgroundColor: 'transparent',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            padding: 2,
            mt: 2,
          }}
        >
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Desafios
          </Typography>

          {
            desafios.map((desafio, key) =>
              <Desafio
                key={key}
                idUsuario={usuario.id_usuario}
                desafio={desafio}
                setExpanded={setExpanded}
                expanded={expanded}
                similarCustomSA={similarCustomSA}
              />
            )
          }
        </Box>
        :
        <Box sx={{
          width: '100%',
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhum desafio disponivel no momento...</Typography>
        </Box>
      }
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {
    id_usuario: 0,
    cargo: ''
  }
  let desafios = []
  let desafios_enviados = []

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
    await Promise.all([
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          usuario = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/contentful/entries/desafios?cargo=${usuario.cargo}`)
        .then(res => {
          desafios = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/desafios_usuario?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          desafios_enviados = res.data
        }),
    ]).then(() => {
      desafios = desafios.map(desafio => {
        const acheiDesafio = desafios_enviados.find(elemDesafio => elemDesafio.desafio_nome == desafio.titulo)
        return {
          ...desafio,
          conclusao: acheiDesafio ? acheiDesafio : {}
        }
      })

    })

  }

  return {
    props: {
      usuario,
      desafios
    }
  }
}

export default DesafiosUsuarios

import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { DashboardLayout } from '../../components/dashboard-layout';
import { Box, Typography } from '@mui/material';

import React, { useState } from 'react';
import { Quiz } from '../../components/shared/Quiz';
import { theme } from '../../styles/theme';

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


const Quizzes = ({ usuario, quizzes }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  return (
    <DashboardLayout
      avatarLink={usuario.avatar_link}
      isAdmin={false}
      usuarioLogadoEmail={usuario.perfil.email_empresarial}
    >
      <Head>
        <title>
          {`Quiz | Orange Juice`}
        </title>
      </Head>

      {quizzes.length > 0 ?
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
            ml: -10,
            [theme.breakpoints.down(1200)]: { ml: 0 }
          }}
        >
          <Typography
            sx={{ m: 1 }}
            variant="h4"
          >
            Quiz
          </Typography>

          {
            quizzes.map((quiz, key) =>
              <Quiz
                key={key}
                idUsuario={usuario.id_usuario}
                quiz={quiz}
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
          justifyContent: 'center',
          ml: -10,
          [theme.breakpoints.down(1200)]: { ml: 0 }
        }}>
          <Typography sx={{ color: '#454B50', fontSize: 24}}>Nenhum quiz disponivel no momento...</Typography>
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
  let quizzes = []
  let quizzes_enviados = []

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
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/contentful/entries/quizzes?cargo=${usuario.cargo}`)
        .then(res => {
          quizzes = res.data
        }),
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/quizzes_usuario?id_usuario=${usuario.id_usuario}`)
        .then(res => {
          quizzes_enviados = res.data
        }),
    ]).then(()=> {
      quizzes = quizzes.map(quiz => {
        const acheiQuizzesEnviados = quizzes_enviados.filter(elemQuiz => elemQuiz.quiz_nome == quiz.titulo)
        return {
          ...quiz,
          conclusao: acheiQuizzesEnviados ? acheiQuizzesEnviados : []
        }
      })
    })

  }

  return {
    props: {
      usuario,
      quizzes
    }
  }
}

export default Quizzes

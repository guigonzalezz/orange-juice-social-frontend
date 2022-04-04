import Head from 'next/head';
import axios from 'axios';
import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { styled } from '@mui/material/styles';

import { DashboardLayout } from '../../components/dashboard-layout'
import { Box,Button,Card,CardActions,CardContent,CardMedia,Grid,Paper,SvgIcon,Typography } from '@mui/material'
import { theme } from '../../styles/theme';
import { Facebook, GitHub, Instagram, LinkedIn } from '@mui/icons-material';
import { useRouter } from 'next/router';
import ModalAlteraPerfil from '../../components/modal/modalAlteraPerfil';


const Perfil = ({ usuarioLogado, usuarioTerceiro, meuPerfil }) => {
  const router = useRouter()
  const [openAltera, setOpenAltera] = useState(false);

  const handleAlteraOpen = () => {
    setOpenAltera(true);
  }

  const handleAlteraClose = () => {
    setOpenAltera(false);
  }

  return (
    <DashboardLayout
      avatarLink={usuarioLogado.avatar_link}
      isAdmin={usuarioLogado.cargo == 'admin'}
    >
      <Head>
        <title>
          {`Perfil | ${usuarioLogado.perfil.nome}`}
        </title>
      </Head>
      <Card
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
          background:'#232323',color:'white',
          pt: 0,
        }}
      >
        {meuPerfil && <Button onClick={()=>{handleAlteraOpen()}} variant="contained" sx={{ position: 'absolute',right: 0,mt:3, mr:2}}>Editar</Button>}
        <CardMedia
          component="img"
          height="220"
          image={usuarioTerceiro.banner_link}
          alt="imagem do painel do usuario"
        />
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <CardMedia
            component="img"
            image={usuarioTerceiro.avatar_link}
            alt="imagem do painel do usuario"
            sx={{
              width: 160,
              height: 160,
              top:200,
              position: 'absolute',
              borderRadius: '50%',
            }}
          />
        </Box>
        <CardContent sx={{ pt: 6, pb: 1, display: 'flex', justifyContent:'space-between',background:'#232323',color:'white', [theme.breakpoints.down(500)]: { display:'initial', mt: 4 }}}>
          <Box>
            <Typography variant="h5">{usuarioTerceiro.perfil.nome}</Typography>
            <Typography color="text.secondary">{usuarioTerceiro.cargo}</Typography>
          </Box>

          <Box>
            {usuarioTerceiro.social.github_link && <GitHub onClick={()=>{router.push(usuarioTerceiro.social.github_link)}} sx={{m:0.4, '&:hover': { cursor:'pointer', color:'primary.main'}}} />}
            {usuarioTerceiro.social.linkedin_link && <LinkedIn onClick={()=>{router.push(usuarioTerceiro.social.linkedin_link)}} sx={{m:0.4, '&:hover': { cursor:'pointer', color:'primary.main'}}} />}
            {usuarioTerceiro.social.facebook_link && <Facebook onClick={()=>{router.push(usuarioTerceiro.social.facebook_link)}} sx={{m:0.4, '&:hover': { cursor:'pointer', color:'primary.main'}}} />}
            {usuarioTerceiro.social.instagram_link && <Instagram onClick={()=>{router.push(usuarioTerceiro.social.instagram_link)}} sx={{m:0.4, '&:hover': { cursor:'pointer', color:'primary.main'}}} />}
          </Box>
        </CardContent>

        <CardContent sx={{ textAlign:'center', py:0,background:'#232323',color:'white'}}>
          <Typography>&quot;{usuarioTerceiro.social.titulo}&quot;</Typography>
        </CardContent>


        {/* Sobre  */}
        <CardContent sx={{background:'#232323',color:'white'}}>
          <Typography variant="h5" sx={{mb:1}}>Sobre</Typography>
          <Box sx={{ backgroundColor:'#161616', height: 200, borderRadius: 1, p:2}}>
            {usuarioTerceiro.social.sobre}
          </Box>
        </CardContent>

        {/* Conquistas  */}
        <CardContent sx={{background:'#232323',color:'white'}}>
          <Typography variant="h5" sx={{mb:1, color:'white'}}>Conquistas</Typography>
          <Box sx={{backgroundColor:'#161616', borderRadius: 1, p:4,[theme.breakpoints.down(500)]: { p:2 }}}>
            <Box sx={{display:'flex', justifyContent:'space-between', mb: 2, height: 70}}>
              <Box sx={{backgroundColor:'#232323', width: '48%', borderRadius: 1, p:1, pr:3, display:'flex', alignItems:'center', justifyContent:'space-between',[theme.breakpoints.down(500)]: { p:1 }}}>
                <Typography sx={{opacity: 0.75}}>Desafios concluidos</Typography>
                <Typography fontSize={24}>{usuarioTerceiro.social.desafios_concluidos}</Typography>
              </Box>

              <Box sx={{backgroundColor:'#232323', width: '48%', borderRadius: 1, p:1, pr:3, display:'flex', alignItems:'center', justifyContent:'space-between',[theme.breakpoints.down(500)]: { p:1 }}}>
                <Typography sx={{opacity: 0.75}}>Quizzes concluidos</Typography>
                <Typography fontSize={24}>{usuarioTerceiro.social.quizzes_concluidos}</Typography>
              </Box>
            </Box>

            <Box sx={{display:'flex', justifyContent:'space-between', height: 70}} >
              <Box sx={{backgroundColor:'#232323', width: '48%', borderRadius: 1, p:1, pr:3, display:'flex', alignItems:'center', justifyContent:'space-between',[theme.breakpoints.down(500)]: { p:1 }}}>
                <Typography sx={{opacity: 0.75}}>Cursos concluidos</Typography>
                <Typography fontSize={24}>{usuarioTerceiro.social.cursos_concluidos}</Typography>
              </Box>

              <Box sx={{backgroundColor:'#232323', width: '48%', borderRadius: 1, p:1, pr:3, display:'flex', alignItems:'center', justifyContent:'space-between',[theme.breakpoints.down(500)]: { p:1 }}}>
                <Typography sx={{opacity: 0.75}}>Trihlas concluidas</Typography>
                <Typography fontSize={24}>{usuarioTerceiro.social.trilhas_concluidos}</Typography>
              </Box>
            </Box>

          </Box>
        </CardContent>

        <Box sx={{ p:4, display:'flex', justifyContent:'space-between', [theme.breakpoints.down(500)]: { display:'initial' }, background:'#232323',color:'white' }}>
          <Box sx={{width: '48%', [theme.breakpoints.down(500)]: { width:'100%' }}}>
            <Typography variant="h5" sx={{mb:1}}>Experiência</Typography>
            <Box sx={{ backgroundColor:'#161616', height: 120, borderRadius: 1, display:'flex',alignItems:'center', justifyContent:'center'}}>
              <Typography>Em breve...</Typography>
            </Box>
          </Box>

          <Box sx={{width: '48%', [theme.breakpoints.down(500)]: { width:'100%', mt: 4 }}}>
            <Typography variant="h5" sx={{mb:1}}>Formação</Typography>
            <Box sx={{ backgroundColor:'#161616', height: 120, borderRadius: 1, display:'flex',alignItems:'center', justifyContent:'center'}}>
              <Typography>Em breve...</Typography>
            </Box>
          </Box>

        </Box>
      </Card>
      <ModalAlteraPerfil
        open={openAltera}
        handleClose={handleAlteraClose}
        usuario={usuarioLogado}
      />
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx

  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuarioLogado = { id_usuario: 0 }
  let usuarioTerceiro = { id_usuario: 0 }
  let meuPerfil = false

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
        usuarioLogado = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar?id_usuario=${usuarioLogado.id_usuario}`)
      .then(res => {
        usuarioLogado = res.data
      })

    await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/buscar_por_email?email_empresarial=${params.usuario}`)
      .then(res => {
        usuarioTerceiro = res.data
      })
    meuPerfil = usuarioLogado.id_usuario == usuarioTerceiro.id_usuario ? true : false
  }

  return {
    props: {
      usuarioLogado,
      usuarioTerceiro,
      meuPerfil
    }
  }
}

export default Perfil


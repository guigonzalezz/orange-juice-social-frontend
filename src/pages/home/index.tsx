
import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';


export default function Home(props) {
  const { logout } = useContext(AuthContext)
  const { usuario } = props
  //if props.cargo == 'admin' entao o header é diferente

  const logoutUser = async  () => {
    await logout();
  }

  return (
    <>
      <Typography>Ola mundo</Typography>
      <Button onClick={()=> {logoutUser()}}>Logout</Button>
    </>
    // <Flex
    //   w="100vw"
    //   h="100vh"
    //   align='center'
    //   justify='center'
    //   flexDir="column"
    // >
    //   <Image mt="-30px" boxSize="350px" objectFit="contain" src="logo_slash_gradiente.png" alt="Orange Juice Social Logo"/>
    //   <Text color="myColors.fcamara" fontSize={36}>{usuario.email_empresarial}</Text>
    //   <Text color="myColors.fcamara" fontSize={36}>{usuario.cargo}</Text>
    //   <Button type="button" mt="6" colorScheme="orange" size="lg" bgGradient="linear(to-r, red.500, yellow.500)" onClick={logoutUser} >Sair</Button>
    // </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['nextauth.token']: token } = parseCookies(ctx)
  let usuario = {}
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

  console.log({
    usuario,
    noticias,
    blogs,
    eventos
  })
  //Aqui faria a requisição e buscaria os dados necessários,
  //como está e a pagina da home, preciso das noticias, eventos etc
  return {
    props: {
      usuario,
      noticias,
      blogs,
      eventos
    }
  }
}

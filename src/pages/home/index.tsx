import { Flex, Image, Text, Button } from '@chakra-ui/react'
import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { getAPIClient } from '../../services/axios';


export default function Home(props) {
  const { logout } = useContext(AuthContext)
  const { usuario } = props
  //if props.cargo == 'admin' entao o header é diferente

  const logoutUser = async  () => {
    await logout();
  }

  return (
    <Flex
      w="100vw"
      h="100vh"
      align='center'
      justify='center'
      flexDir="column"
    >
      <Image mt="-30px" boxSize="350px" objectFit="contain" src="logo_slash_gradiente.png" alt="Orange Juice Social Logo"/>
      <Text color="myColors.fcamara" fontSize={36}>{usuario.email_empresarial}</Text>
      <Text color="myColors.fcamara" fontSize={36}>{usuario.cargo}</Text>
      <Button type="button" mt="6" colorScheme="orange" size="lg" bgGradient="linear(to-r, red.500, yellow.500)" onClick={logoutUser} >Sair</Button>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //To usando o contexto aqui para pegar o header com o Bearer Token
  const apiClient = getAPIClient(ctx);
  const { ['nextauth.token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
  //else verifico informações do usuario ?


  //Aqui faria a requisição e buscaria os dados necessários, 
  //como está e a pagina da home, preciso das noticias, eventos etc
  let usuario = {};
  await apiClient.get('/auth/usuario')
    .then(res => {
      usuario = res.data.data
    })

  return {
    props: {
      usuario
    }
  }
}
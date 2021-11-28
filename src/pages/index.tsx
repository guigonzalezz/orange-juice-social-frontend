import { Flex, Stack, Button, Image, Text, Box } from '@chakra-ui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver  } from '@hookform/resolvers/yup/dist/yup'
import { Input } from '../components/Form/Input'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
  password: yup.string().required('Senha obrigatória'),
})


export default function SigniIn() {
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(signInFormSchema)
  })
  const { errors } = formState;
  const { signIn } = useContext(AuthContext)

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    const possiblMessage = await signIn({
      email: values.email,
      senha: values.password
    })
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

      <Flex
            as='form'
            w="100%"
            h={500}
            mt="-20px"
            maxWidth={360}
            minHeight={500}
            bg="myColors.700"
            borderRadius={4}
            flexDir="column"
            p="8"
            onSubmit={handleSubmit(handleSignIn)}
            _before={{
              content: `""`,
              position:"absolute",
              mt:"-30px",
              ml:"-30px",
              zIndex: "-1",
              width: "360px",
              height: "500px",
              bg: "myColors.gradient-login",
              filter: "blur(40px)"
            }}
          >
            <Text align="center" w="100%" fontSize="29"  mb="4" >Login</Text>
            <Stack spacing="4">
              <Input
                name="email"
                type="email"
                placeholder="E-mail"
                error={errors.email}
                {...register("email")}
              />
              <Input
                name="password"
                type="password"
                placeholder="Senha"
                error={errors.password}
                {...register("password")}
              />

            </Stack>
            <Button type="submit" mt="6"  colorScheme="orange" size="lg" bgGradient="linear(to-r, red.500, yellow.500)" isLoading={formState.isSubmitting}>Entrar</Button>
            
      </Flex>
      
      <Image mt="8" mb="8" src="logo-fcamara.png" alt="Grupo FCamara Logo"/>
    </Flex>
  )
}

// <Box  w='100%' ml="-8" h={50} bgColor="myColors.600" align="center" justify="center">
//               <Text>Esqueci minha senha</Text>
//             </Box>
// <Image mt="8" mb="8" src="logo-fcamara.png" alt="Grupo FCamara Logo"/>
//<Text fontSize="64px">Torne-se o <Text color="myColors.fcamara">protagonista</Text> da sua história<Text color="myColors.fcamara">.</Text></Text>
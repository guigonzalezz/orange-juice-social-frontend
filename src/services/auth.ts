import { api } from "./api"

type SignInRequestData = {
  email: string;
  senha: string;
}



//ajustar tudo
export async function signInRequest(data: SignInRequestData) {
  let token = undefined;
  let message = undefined;
  await api.post('/auth/login',data)
    .then(async res => {
      token = res.data.data;
    })
    .catch(error => {
      message = error.response.data.error
    })

  return {
    token,
    message
  }
}

export async function recoverUserInformation() {
  const user = await api.get('/auth/usuario')

  return {
    user
  }
}
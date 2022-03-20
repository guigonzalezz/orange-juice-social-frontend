import { Box, Button, Container, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import brasil from '../../utils/brasil.json'
import axios from 'axios';
import Swal from 'sweetalert2'


import { parse, isDate, format } from "date-fns";

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

function parseDateString(value, originalValue) {
  const parsedDate = isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-MM-dd", new Date());

  return parsedDate;
}

const FormAlteraUsuario = ({ handleClose, cargos, usuario }) => {
  const brasilObject = JSON.parse(JSON.stringify(brasil))
  const router = useRouter();
  const phoneRegex = /^1\d\d(\d\d)?$|^0800 ?\d{3} ?\d{4}$|^(\(0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d\) ?|0?([1-9a-zA-Z][0-9a-zA-Z])?[1-9]\d[ .-]?)?(9|9[ .-])?[2-9]\d{3}[ .-]?\d{4}$/gm
  const formik = useFormik({
    initialValues: {
      nome: usuario.nome,
      email_pessoal: usuario.email_pessoal,
      cargo: usuario.id_cargo,
      contato: usuario.contato,
      nascimento: format(new Date(usuario.data_nasc), 'yyyy-MM-dd'),
      estado: usuario.estado,
      cidade: usuario.cidade,
    },
    validationSchema: Yup.object({
      nome: Yup
        .string()
        .max(255)
        .required('Nome obrigatorio'),
      email_pessoal: Yup
        .string()
        .email('Formato do email invalido')
        .max(255)
        .required('Email obrigatorio'),
      cargo: Yup
        .string()
        .max(255)
        .required('Cargo obrigatorio'),
      contato: Yup
        .string()
        .max(255)
        .matches(phoneRegex, 'Formato do telefone invalido')
        .required('Numero de contato obrigatorio'),
      nascimento: Yup
        .date()
        .transform(parseDateString)
        .max(new Date(), 'Data de nascimento invalida')
        .required('Data de nascimento obrigatorio'),
      estado: Yup
        .string()
        .max(255)
        .required('Estado obrigatorio'),
      cidade: Yup
        .string()
        .max(255)
        .required('Cidade obrigatorio'),
    }),
    onSubmit: async () => {
      formik.values.nascimento = format(new Date(formik.values.nascimento), 'dd/MM/yyyy')
      await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/atualizarPerfil/${usuario.id_usuario}`,{
        nome: formik.values.nome,
        email: formik.values.email_pessoal,
        data_nasc: formik.values.nascimento,
        contato: formik.values.contato,
        cidade: formik.values.cidade,
        estado: formik.values.estado,
      }).then(async res => {
        handleClose();
        if(formik.values.cargo != usuario.id_cargo) {
          await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/atualizarCargo/${usuario.id_usuario}?id_cargo=${formik.values.cargo}`)
        }
        Swal.fire({
          ...similarCustomSA,
          icon: 'success',
          title: 'Alterado com sucesso',
          showConfirmButton: false,
          timer: 1700
        })
        router.reload();
      }).catch(error => {
        handleClose();
        Swal.fire({
          ...similarCustomSA,
          icon: 'error',
          title: 'Erro ao realizar alteracao!',
          showConfirmButton: false,
          timer: 1700
        })
      })
    }
  });
  const [estadoOptions, setEstadoOptions] = useState(null)
  const [cidadeOptions, setCidadeOptions] = useState(null)
  const [cargoOptions, setCargoOptions] = useState(null)



  useEffect(() =>{
    setEstadoOptions(
      brasilObject.estados.map((estado, key) => (
        <MenuItem
          value={estado.nome}
          key={key}
        >
          {estado.nome}
        </MenuItem >
      ))
    )

    setCargoOptions(
      cargos.map(cargo => (
        <MenuItem
          value={cargo.id_cargo}
          key={cargo.id_cargo}
        >
          {cargo.nome}
        </MenuItem >
      ))
    )
  },[])

  useEffect(() => {
    setCidadeOptions(null)
    const finded = brasilObject.estados.find(elem => elem.nome == formik.values.estado)
    if(finded) {
      setCidadeOptions(
        finded.cidades.map((cidade,key) => (
          <MenuItem
            value={cidade}
            key={key}
          >
            {cidade}
          </MenuItem>
        ))
      )
    }
  },[formik.values.estado])

  return (
    <Container
      maxWidth="sm"
      sx={{
        background: '#232323',
        alignItems: 'center',
        width: '100%',
        height: 700,
        overflowX: 'hidden',
        overflowY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 2,
        '&::-webkit-scrollbar': {
          height: '0.4em',
          width: 8
        },
        '&::-webkit-scrollbar-track': {
          '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(16,16,16,.9)',
          borderRadius: 25,
        },
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ my: 3}}>
          <Typography
            color='white'
            variant="h6"
          >
            Alterar Usuario
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          >
            Digite as seguintes informacoes para dar continuidade na alteracao do usuario.
          </Typography>
        </Box>
        <TextField
          error={Boolean(formik.touched.nome && formik.errors.nome)}
          fullWidth
          helperText={formik.touched.nome && formik.errors.nome}
          label="Nome completo"
          margin="normal"
          name="nome"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.nome}
          variant="outlined"
        />
        <TextField
          error={Boolean(formik.touched.email_pessoal && formik.errors.email_pessoal)}
          fullWidth
          helperText={formik.touched.email_pessoal && formik.errors.email_pessoal}
          label="Email pessoal"
          margin="normal"
          name="email_pessoal"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email_pessoal}
          variant="outlined"
        />
        <TextField
          select
          error={Boolean(formik.touched.cargo && formik.errors.cargo)}
          fullWidth
          helperText={formik.touched.cargo && formik.errors.cargo}
          label="Cargo"
          margin="normal"
          name="cargo"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.cargo}
          variant="outlined"
        >{cargoOptions}</TextField>

        <TextField
          error={Boolean(formik.touched.contato && formik.errors.contato)}
          fullWidth
          helperText={formik.touched.contato && formik.errors.contato}
          label="Contato"
          margin="normal"
          name="contato"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.contato}
          variant="outlined"
        />

        <TextField
          error={Boolean(formik.touched.nascimento && formik.errors.nascimento)}
          fullWidth
          helperText={formik.touched.nascimento && formik.errors.nascimento}
          label="Data de nascimento"
          margin="normal"
          name="nascimento"
          type="date"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.nascimento}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          select
          error={Boolean(formik.touched.estado && formik.errors.estado)}
          fullWidth
          helperText={formik.touched.estado && formik.errors.estado}
          label="Estado"
          margin="normal"
          name="estado"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.estado}
          variant="outlined"
        >{estadoOptions}</TextField>

        <TextField
          select
          error={Boolean(formik.touched.cidade && formik.errors.cidade)}
          fullWidth
          helperText={formik.touched.cidade && formik.errors.cidade}
          label="Cidade"
          margin="normal"
          name="cidade"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.cidade}
          variant="outlined"
        >{cidadeOptions}</TextField>


        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Alterar
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default FormAlteraUsuario;

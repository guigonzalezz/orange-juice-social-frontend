import { Box, Button, Container, MenuItem, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Swal from 'sweetalert2'


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


const FormAlteraPerfil = ({ handleClose, usuario }) => {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  const formik = useFormik({
    initialValues: {
      titulo: usuario.social.titulo ? usuario.social.titulo : '',
      sobre: usuario.social.sobre ? usuario.social.sobre : '',
      avatar: null,
      banner: null,
      github_link: usuario.social.github_link ? usuario.social.github_link : '',
      linkedin_link: usuario.social.linkedin_link ? usuario.social.linkedin_link : '',
      facebook_link: usuario.social.facebook_link ? usuario.social.facebook_link : '',
      instagram_link: usuario.social.instagram_link ? usuario.social.instagram_link : '',
    },
    validationSchema: Yup.object({
      titulo: Yup
        .string()
        .max(255),
      sobre: Yup
        .string()
        .max(255),
      avatar: Yup
        .mixed()
        .nullable()
        .notRequired(),
      banner: Yup
        .mixed()
        .nullable()
        .notRequired(),
      github_link: Yup
        .string()
        .max(255),
      linkedin_link: Yup
        .string()
        .max(255),
      facebook_link: Yup
        .string()
        .max(255),
      instagram_link: Yup
        .string()
        .max(255),
    }),
    onSubmit: async () => {
      if(avatarFile) {
        const dataAvatarFile = new FormData()
        dataAvatarFile.append('file', avatarFile, avatarFile.name)
        await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/avatar/adicionar/${usuario.id_usuario}`, dataAvatarFile, {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data`,
          }
        })
      }

      if(bannerFile) {
        const dataBannerFile = new FormData()
        dataBannerFile.append('file', bannerFile, bannerFile.name)
        await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/banner/adicionar/${usuario.id_usuario}`, dataBannerFile, {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data`,
          }
        })
      }


      await axios.patch(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/atualizar_social/${usuario.id_usuario}`, {
        titulo: formik.values.titulo,
        sobre: formik.values.sobre,
        github_link: formik.values.github_link,
        linkedin_link: formik.values.linkedin_link,
        facebook_link: formik.values.facebook_link,
        instagram_link: formik.values.instagram_link,
      }).then(res => {
        handleClose();
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

  const handleChangeFile = (event, tipo) => {
    if(tipo == 'avatar'){
      setAvatarFile(event.target.files[0])
    }
    else if(tipo == 'banner') {
      setBannerFile(event.target.files[0])
    }
  }


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
            Alterar Perfil
          </Typography>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="body2"
          >
            Digite as seguintes informacoes para dar continuidade na alteracao do perfil.
          </Typography>
        </Box>
        <TextField
          error={Boolean(formik.touched.titulo && formik.errors.titulo)}
          fullWidth
          helperText={formik.touched.titulo && formik.errors.titulo}
          label="Titulo"
          margin="normal"
          name="titulo"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.titulo}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.sobre && formik.errors.sobre)}
          fullWidth
          helperText={formik.touched.sobre && formik.errors.sobre}
          label="Sobre"
          margin="normal"
          name="sobre"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.sobre}
          type="textarea"
          variant="outlined"
          multiline
          rows={3}

        />


        <TextField
          error={Boolean(formik.touched.avatar && formik.errors.avatar)}
          fullWidth
          helperText={formik.touched.avatar && formik.errors.avatar}
          label="Avatar"
          margin="normal"
          name="avatar"
          onBlur={formik.handleBlur}
          onChange={()=>{handleChangeFile(event,'avatar')}}
          type="file"
          value={formik.values.avatar}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.banner && formik.errors.banner)}
          fullWidth
          helperText={formik.touched.banner && formik.errors.banner}
          label="Banner"
          margin="normal"
          name="banner"
          onBlur={formik.handleBlur}
          onChange={()=>{handleChangeFile(event,'banner')}}
          type="file"
          value={formik.values.banner}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.github_link && formik.errors.github_link)}
          fullWidth
          helperText={formik.touched.github_link && formik.errors.github_link}
          label="Github link"
          margin="normal"
          name="github_link"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.github_link}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.linkedin_link && formik.errors.linkedin_link)}
          fullWidth
          helperText={formik.touched.linkedin_link && formik.errors.linkedin_link}
          label="Linkedin link"
          margin="normal"
          name="linkedin_link"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.linkedin_link}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.facebook_link && formik.errors.facebook_link)}
          fullWidth
          helperText={formik.touched.facebook_link && formik.errors.facebook_link}
          label="Facebook link"
          margin="normal"
          name="facebook_link"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.facebook_link}
          variant="outlined"

        />

        <TextField
          error={Boolean(formik.touched.instagram_link && formik.errors.instagram_link)}
          fullWidth
          helperText={formik.touched.instagram_link && formik.errors.instagram_link}
          label="Instagram link"
          margin="normal"
          name="instagram_link"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.instagram_link}
          variant="outlined"

        />



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

export default FormAlteraPerfil;

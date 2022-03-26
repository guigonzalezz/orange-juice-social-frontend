import { styled, alpha } from '@mui/material/styles';
import { BoxProps, Box, Typography, Checkbox } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { ExpandMore, OpenInNew } from '@mui/icons-material';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { theme } from '../../styles/theme';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({

  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:'rgba(255, 255, 255, .05)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid #5c4b4b1f',
}));

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

export const Trilha = ({idUsuario ,trilha, setExpanded, expanded}) => {
  const [trilhaConcluida, setTrilhaConcluida] = useState(trilha.concluido_SN == 'S')
  const [cursos, setCursos] = useState(trilha.cursos)
  const router = useRouter();

  //E SE EU PASSE O CURSOS PARA SER UM COMPONENT COMPLETO, AI EU FARIA O RERENDER DELE


  const handleChange = (panel: string) => {setExpanded(panel == expanded ? false : panel)}
  const handleConcluirTrilha = () => {
    Swal.fire({
      ...similarCustomSA,
      title: 'Voce tem certeza que deseja concluir esta trilha ?',
      text: 'Nao sera possivel voltar a tras.',
      showDenyButton: true,
      confirmButtonText: 'Concluir',
      denyButtonText: `Cancelar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/trilha`, {
          id_usuario: idUsuario,
          nome: trilha.titulo,
          anotacao: ""
        }).then(res => {
          setTrilhaConcluida(true)
          cursos.map(async curso => {
            if(curso.concluido_SN == 'N') {
              await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/curso`, {
                id_usuario: idUsuario,
                nome: cursos.titulo,
                anotacao: ""
              })
            }
          })
          router.reload()
        })
      }
    })
  }
  const handleConcluirCurso = async (key) => {
    if(cursos[key].concluido_SN == 'N') {
      Swal.fire({
        ...similarCustomSA,
        title: 'Voce tem certeza que deseja concluir este curso ?',
        text: 'Nao sera possivel voltar a tras.',
        showDenyButton: true,
        confirmButtonText: 'Concluir',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/curso`, {
            id_usuario: idUsuario,
            nome: cursos[key].titulo,
            anotacao: ""
          }).then(async res=>{
            cursos[key].concluido_SN = cursos[key].concluido_SN == 'S' ? 'N' : 'S'
            const trilhaFoiConcluida = cursos.every(curso => curso.concluido_SN == 'S')
            if(trilhaFoiConcluida) {
              await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/trilha`, {
                id_usuario: idUsuario,
                nome: trilha.titulo,
                anotacao: ""
              }).then(res => {
                setTrilhaConcluida(true)
              })
            }
            router.reload()
          })
        }
      })
    }
  }

  console.log(theme.breakpoints.up(400) ? 'maior':'menor')
  return(
    <Accordion
      expanded={expanded === trilha.titulo}
      onChange={()=>{handleChange(trilha.titulo)}}
      sx={{
        minHeight:100,
        my: 1,
        mx: 3,
        borderRadius: 2,
        backgroundColor: '#1B1B1B'
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore  />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        sx={{
          borderLeftColor: `${trilhaConcluida ? 'success.main' : 'secondary.main'}`,
          borderLeftStyle: 'solid',
          borderLeftWidth: 2,
        }}
      >
        <Typography sx={{ width: '50%', [theme.breakpoints.down(500)]: { width: 200 }, display:'flex',alignItems:'center',textAlign:'center', justifyContent:'center',flexShrink: 0 }}>
          {trilha.titulo}
        </Typography>
        <Typography fontSize={12} sx={{ color: 'text.secondary', width: '40%', [theme.breakpoints.down(500)]: { display: 'none' } }}>{trilha.descricao}</Typography>
        <Checkbox
          checked={trilhaConcluida}
          disabled={trilhaConcluida}
          onClick={()=>{ handleConcluirTrilha()}}
          inputProps={{ 'aria-label': 'controlled' }}
          sx={{width: '10%', [theme.breakpoints.down(500)]: { width: '50%' }}}
        />

      </AccordionSummary>
      <AccordionDetails sx={{backgroundColor:'#232323'}}>
        {
          cursos.map((curso, key) => (
            <Box key={key} sx={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              '&:not(:last-child)': {
                borderBottom: 1,
                borderColor:'#1B1B1B'
              },
            }}>
              <Typography fontSize={12} color='primary.main' sx={{width:'95%'}}>
                {curso.titulo}
              </Typography>
              {/* <Typography fontSize={12} sx={{[theme.breakpoints.down(500)]: { display: 'none' }}}>
                {curso.descricao}
              </Typography> */}
              <Box sx={{ width: 100, display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
                <a target="_blank" href={curso.link} rel="noopener noreferrer" style={{ textDecoration: 'none', color:'white' }}>
                  <OpenInNew  sx={{
                      ":hover": {
                        color:'primary.main',
                        cursor: 'pointer'
                      }
                    }}
                  />
                </a>
                <Checkbox
                  checked={curso.concluido_SN == "S" ? true: false}
                  onClick={()=>{
                    handleConcluirCurso(key)
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Box>
            </Box>
          ))
        }

      </AccordionDetails>
    </Accordion>
  )
}

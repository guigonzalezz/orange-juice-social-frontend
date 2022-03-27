import { OpenInNew } from '@mui/icons-material'
import { Box, Checkbox, Tooltip, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import Swal from 'sweetalert2'



export const Curso = ({idUsuario ,curso, similarCustomSA, verificaSeTodosCursosForamConcluidos}) => {
  const [cursoConcluido, setCursoConcluido] = useState(curso.concluido_SN == 'S')

  const handleConcluirCurso = async () => {
    if(curso.concluido_SN == 'N') {
      Swal.fire({
        ...similarCustomSA,
        title: 'Voce tem certeza que deseja concluir este curso ?',
        text: 'Nao sera possivel voltar a tras.',
        showDenyButton: true,
        confirmButtonText: 'Concluir',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setCursoConcluido(true)
          await axios.post(`${process.env.HEROKU_OJ_API_DEV_URL}/usuario/concluir/curso`, {
            id_usuario: idUsuario,
            nome: curso.titulo,
            anotacao: ""
          }).then(async res=>{
            curso.concluido_SN = curso.concluido_SN == 'S' ? 'N' : 'S'
            verificaSeTodosCursosForamConcluidos()
          })
        }
      })
    }
  }

  return(
    <Box sx={{
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      '&:not(:last-child)': {
        borderBottom: 1,
        borderColor:'#1B1B1B'
      },
    }}>
      <Tooltip title={curso.descricao}>
        <Typography fontSize={12}  sx={{width:'95%'}}>
          {curso.titulo}
        </Typography>
      </Tooltip>
      <Box sx={{ width: 100, display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
        <a target="_blank" href={curso.link} rel="noopener noreferrer" style={{ textDecoration: 'none', color:'white', marginTop:4 }}>
          <OpenInNew  sx={{
              ":hover": {
                color:'primary.main',
                cursor: 'pointer'
              }
            }}
          />
        </a>
        <Checkbox
          checked={cursoConcluido}
          disabled={cursoConcluido}
          onClick={()=>{ handleConcluirCurso()  }}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </Box>
    </Box>
  )
}

import { styled, alpha } from '@mui/material/styles';
import { BoxProps, Box, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react'
import { ArrowDownward, TextSnippet } from '@mui/icons-material';
import { theme } from '../../styles/theme';
import { jsPDF } from "jspdf";

export const Report = ({nome, descricao, tipo}) => {


  const handleReport = async (tipo: string) => {
    const pageWidth = 8.5,
      lineHeight = 1.2,
      margin = 0.5,
      maxLineWidth = pageWidth - margin * 2,
      fontSize = 24,
      ptsPerInch = 72,
      oneLineHeight = (fontSize * lineHeight) / ptsPerInch,//@ts-ignore:
      doc = new jsPDF({ unit: "in", lineHeight: lineHeight }).setProperties({ title: tipo })

    if(tipo == "usuarios_ativos") {
      let usuarios = [];
      await axios.get(`${process.env.HEROKU_OJ_API_DEV_URL}/relatorio/${tipo}`)
      .then(res => {
        usuarios = res.data
      })

      doc.setFont("Helvetica", "bold").text(
        "Listagem de usuarios ativos",
        margin,
        margin + oneLineHeight
      );

      const text = usuarios.map(u => u.join(", ")).join("\n")
      const textLines = doc
      .setFont("helvetica")
      .setFontSize(8)
      .splitTextToSize(text, maxLineWidth);

      doc.text(textLines, margin, margin + 2 * oneLineHeight);
      doc.save("usuarios_ativos.pdf");

    }
  }

  return(
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 100,
        my: 2,
        mx: 3,
        borderRadius: 2,
        backgroundColor: '#1B1B1B'
    }}>
      <Box sx={{ height: '100%',
        width: '15%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: '#161616'
      }}>
        <TextSnippet
          sx={{
           [theme.breakpoints.down('sm')]: {
            fontSize:30
           }
          }}
          fontSize='large'
          color='primary'
        />
      </Box>

      <Box sx={{
        height: '100%',
        width: '75%',
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        px: 4,
      }}>
        <Typography>{nome}</Typography>
        <Typography color="#8E8E8E" fontSize={12} >{descricao}</Typography>
      </Box>

      <Box sx={{ height: '100%',
        width: '10%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#161616',
        cursor: 'pointer'

      }}
        onClick={()=>{
          handleReport(tipo)
        }}
      >
        <ArrowDownward />
      </Box>
    </Box>
  )
}

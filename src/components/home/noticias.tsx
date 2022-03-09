import React, {useState} from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider, Tab, Tabs, useTheme, Paper, Typography } from '@mui/material';


import {ShareLocation} from '@mui/icons-material';

function Item(props)
{
    return (
        <Box component="div" sx={{
          height: 300,
          width: 230,
          minWidth: 230,
          mx: 2,
          //boderColor: 'pink', borderStyle: 'solid', borderWidth: 2,
          // borderWidth: 3,
          // borderStyle: 'solid',
          // borderRadius: 1.5,
          // borderImage: 'linear-gradient(to top,red, rgba(0, 0, 0, 0)) 1 100%',

          //VERSAO QUE FUNCIONA SEM BORDA RADIUS
          borderStyle: 'solid',
          borderImageSlice: 1,
          borderWidth: 3,
          borderImageSource: 'linear-gradient(to top, #F96400, #FECE00)',
          //https://css-tricks.com/gradient-borders-in-css/
        }}>
            <img width={'100%'} height={'50%'} src={props.imagem}/>
            <Typography>{props.titulo}</Typography>
            <Box component="div" sx={{px: 1, display: 'flex', justifyContent: 'space-between'}}>
              <Button sx={{width: 90, boderColor: 'pink', borderStyle: 'solid', borderWidth: 2}}>DETALHES</Button>
              <Button sx={{width: 90, boderColor: 'pink', borderStyle: 'solid', borderWidth: 2}}>OK</Button>
            </Box>

            <Box component="div">
              <Box component="div">
                <Typography>Created at</Typography>
                <Typography>{props.stampCreated}</Typography>
              </Box>
              <Box component="div">
                <Button>...</Button>
                <Button>
                  <ShareLocation />
                </Button>
              </Box>
            </Box>
        </Box>
    )
}

export const Noticias = (props) => {
  const { info } = props
  const theme = useTheme()

  return (
    <Box component="div"
     sx={{
      backgroundColor: 'transparent',
      width: '100%',
      height: 340,
      overflowX: 'scroll',
      overflowY: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 2,
      '&::-webkit-scrollbar': {
        width: '0.4em',
        height: 8
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
      {
        info.map( (item, i) => <Item key={i} item={item} /> )
      }
     </Box>
  );
};


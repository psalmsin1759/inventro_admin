// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import { useState, useEffect } from 'react'

import { useAuth } from 'src/hooks/useAuth'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'

// Styled Grid component
const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  width: 298,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 250,
    position: 'static'
  }
}))

const AnalyticsProfile = () => {
  // ** Hook
  const { settings } = useSettings()

  const auth = useAuth()

  const user = auth.user

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ p: theme => `${theme.spacing(6.75, 7.5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Hello{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                {/* {userJson.name} */}
              </Box>
              {user?.name}!
            </Typography>
            <Typography variant='body2'>
              Welcome to Inventro{' '}
              <Box component='span' sx={{ fontWeight: 600 }}>
                management Portal
              </Box>{' '}
              😎
            </Typography>
            <br />
            <br />
            <br />
            <br />
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Welcome' src={`/images/cards/illustration-john-${settings.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsProfile

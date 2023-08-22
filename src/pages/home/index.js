// ** MUI Imports

import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsProfile from 'src/views/dashboard/AnalyticsProfile'

const Home = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={8}>
          <AnalyticsProfile />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home

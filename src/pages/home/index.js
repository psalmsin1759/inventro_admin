// ** MUI Imports

import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import AnalyticsProfile from 'src/views/dashboard/AnalyticsProfile'
import HandCoin from 'mdi-material-ui/HandCoin'
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import ChartjsLineChart from 'src/views/dashboard/ChartjsLineChart'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'

const Home = () => {
  // ** Hook
  const theme = useTheme()

  // Vars
  const whiteColor = '#fff'
  const lineChartYellow = '#d4e157'
  const lineChartPrimary = '#787EFF'
  const lineChartWarning = '#ff9800'
  const labelColor = theme.palette.text.primary
  const borderColor = theme.palette.action.focus
  const gridLineColor = theme.palette.action.focus

  const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

  const [storeCount, seStoreCount] = useState(0)
  const [orderCount, seOrderCount] = useState(0)
  const [storeCountLastSeven, setStoreCountLastSeven] = useState(0)

  const URLGRAPH = '/getsummary'

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      axios.defaults.headers.post['Content-Type'] = 'application/json'

      const response = await axios.get(URLGRAPH)
      //{ ...response?.data.data }
      seStoreCount(response.data.storeCount)
      seOrderCount(response.data.orderCount)
      setStoreCountLastSeven(response.data.storeCount7Days)
    }
    fetchData()
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={6}>
          <AnalyticsProfile />
        </Grid>
        <Grid item xs={12} md={2}>
          <CardStatisticsVertical
            stats={storeCount}
            color='primary'
            icon={<HandCoin />}
            title='Total Stores'
            chipText='All'
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CardStatisticsVertical
            stats={storeCountLastSeven}
            color='primary'
            icon={<HandCoin />}
            title='Total Stores'
            chipText='This Week'
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <CardStatisticsVertical
            stats={orderCount}
            color='primary'
            icon={<HandCoin />}
            title='Transaction Hit'
            chipText=''
          />
        </Grid>
        <Grid item xs={12}>
          <ChartjsLineChart
            white={whiteColor}
            labelColor={labelColor}
            success={lineChartYellow}
            borderColor={borderColor}
            primary={lineChartPrimary}
            warning={lineChartWarning}
            gridLineColor={gridLineColor}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Home

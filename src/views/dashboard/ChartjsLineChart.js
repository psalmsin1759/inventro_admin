// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useState, useEffect } from 'react'
import axios from '../../api/axios'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

import { Chart as ChartJS, registerables } from 'chart.js'

const ChartjsLineChart = props => {
  const auth = useAuth()
  const user = auth.user

  //const [graphData, setGraphData] = useState({})
  const [haveData, setHaveData] = useState(false)
  const [maxAmount, setMaxAmount] = useState(500)
  const [dd, setDD] = useState([])

  const [graphData, setGraphData] = useState({})

  const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

  const URLGRAPH = '/getsummary'

  useEffect(() => {
    const fetchData = async () => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      axios.defaults.headers.post['Content-Type'] = 'application/json'

      const response = await axios.get(URLGRAPH)
      setGraphData(response.data.graphData)
    }
    fetchData()
  }, [])

  ChartJS.register(...registerables)
  //ChartJS.register(...registerables)
  //Chart.register(Line)
  //Chart.register(Line)
  // ** Props
  const { white, primary, success, warning, labelColor, borderColor, gridLineColor } = props

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          borderColor,
          color: gridLineColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: 400,
        grid: {
          borderColor,
          color: gridLineColor
        },
        ticks: {
          stepSize: 100,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const chartData = {
    labels: Array.isArray(graphData) ? graphData.map(({ date_month }) => date_month) : null,
    datasets: [
      {
        label: 'Stores Per Month',
        data: Array.isArray(graphData) ? graphData.map(({ store_count }) => store_count) : null,
        fill: false,
        tension: 0.5,
        pointRadius: 1,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: warning,
        backgroundColor: warning,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: primary
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Stores Per Month'
        titleTypographyProps={{ variant: 'h6' }}
        subheader='Stores'
        subheaderTypographyProps={{ variant: 'caption' }}
      />
      <CardContent>
        <Bar data={chartData} height={400} />
      </CardContent>
    </Card>
  )
}

export default ChartjsLineChart

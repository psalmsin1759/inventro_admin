// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Alert from '@mui/material/Alert'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import toast from 'react-hot-toast'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { useState, useEffect } from 'react'

import { useAuth } from 'src/hooks/useAuth'
import axios from '../../api/axios'

// ** Hook
import { useSettings } from 'src/@core/hooks/useSettings'
import Close from 'mdi-material-ui/Close'
import LoadingButton from '@mui/lab/LoadingButton'

const ProductBulk = () => {
  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const [selectedStore, setSelectedStore] = useState(0)

  // ** Hook
  const { settings } = useSettings()

  const auth = useAuth()

  const user = auth.user

  const [stores, setStores] = useState([])

  useEffect(() => {
    loadGames()
  }, [])

  const URL = '/getstores'

  const loadGames = async () => {
    const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

    const response = await axios.get(URL, {
      Headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    setStores(response?.data.data)
  }

  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = event => {
    setFile(event.target.files[0])
  }

  const [buttonLoading, setButtonLoading] = useState(false)

  const handleSubmit = async e => {
    setButtonLoading(true)

    if (!file) {
      setError('Please select a file to upload.')

      setButtonLoading(false)

      return
    }

    const formData = new FormData()
    formData.append('storeid', selectedStore)
    formData.append('file', file)

    const URL = '/uploadProducts'

    const response = await axios.post(URL, formData, {
      Headers: { 'content-type': 'multipart/form-data' }
    })

    if (response?.data.success) {
      setButtonLoading(false)

      setSeverity('success')
      setOutputValue('Successful')
      setOpen1(true)

      toast.success('Successful')
    } else {
      setButtonLoading(false)
      setSeverity('error')
      setOpen1(true)
      setOutputValue(response?.data.message)
    }
  }

  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    const link = document.createElement('a')
    link.href = 'https://docs.google.com/spreadsheets/d/1-WqsAwDvC8BX1Mc_EyyqWYKuTMdSovhgoVicHLd9HyA/edit?usp=sharing'
    link.setAttribute('download', 'samsple.xlsx')
    link.setAttribute('target', '_blank')
    document.body.appendChild(link)
    link.click()
    link.remove()
    setLoading(false)
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <CardHeader title='Upload Bulk Products To Store' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ m: 0 }} />
      <CardContent>
        <form onSubmit={e => e.preventDefault()} noValidate>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Box sx={{ mb: 6 }}>
                <Collapse in={open1}>
                  <Alert
                    severity={severity}
                    action={
                      <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpen1(false)}>
                        <Close fontSize='inherit' />
                      </IconButton>
                    }
                  >
                    {outputValue}
                  </Alert>
                </Collapse>
                {/* <Button disabled={open1} variant='outlined' sx={{ mt: 2 }} onClick={() => setOpen1(true)}>
                    Open Collapse
                  </Button> */}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-separator-select-label'>Select Store</InputLabel>
                <Select
                  label='Select Store'
                  name='store'
                  required
                  onChange={e => setSelectedStore(e.target.value)}
                  id='form-layouts-separator-select'
                  labelId='form-layouts-separator-select-label'
                >
                  {stores?.map(store => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                Upload Excel File
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={true}
                  onChange={handleFileChange}
                  accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                  fullWidth
                  type='file'
                  label=''
                  placeholder='Excel File'
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Grid item xs={12}>
                <Button sx={{ justifyContent: 'flex-end' }} onClick={handleDownload} disabled={loading}>
                  {loading ? 'Downloading...' : 'Download sample Excel format'}
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                loading={buttonLoading}
                loadingPosition='start'
                onClick={handleSubmit}
                size='large'
                type='submit'
                sx={{ mr: 2 }}
                variant='contained'
              >
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default ProductBulk

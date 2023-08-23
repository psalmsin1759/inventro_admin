// ** React Imports
import { useState } from 'react'

import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Close from 'mdi-material-ui/Close'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import qs from 'qs'

import axios from '../../api/axios'
import { useAuth } from 'src/hooks/useAuth'

import toast from 'react-hot-toast'

import LoadingButton from '@mui/lab/LoadingButton'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

const defaultValues = {
  title: '',
  details: ''
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  title: yup
    .string()
    .min(3, obj => showErrors('Title', obj.value.length, obj.min))
    .required(),

  details: yup
    .string()
    .min(3, obj => showErrors('Details', obj.value.length, obj.min))
    .required()
})

const PushNotification = () => {
  const auth = useAuth()
  const user = auth.user

  // file uploadd

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const [buttonLoading, setButtonLoading] = useState(false)

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      title: data.title,
      body: data.details
    }
    const URL = '/sendPushToAll'

    const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/x-www-form-urlencoded' }
    })

    if (response?.data.success) {
      setSeverity('success')
      setOutputValue('Messsage Sent')
      setOpen1(true)

      reset()
      setButtonLoading(false)
      toast.success('Sent!')
    } else {
      setSeverity('error')
      setOpen1(true)
      setOutputValue('Error occurred')

      setButtonLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Send Push Notification' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ m: 0 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <Grid container spacing={5}>
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
              </Box>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='title'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Title'
                      onChange={onChange}
                      fullWidth
                      placeholder='Title'
                      error={Boolean(errors.title)}
                    />
                  )}
                />
                {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='details'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Details'
                      onChange={onChange}
                      fullWidth
                      placeholder='Details'
                      error={Boolean(errors.details)}
                    />
                  )}
                />
                {errors.details && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.details.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ m: 0 }} />
        <CardActions>
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
        </CardActions>
      </form>
    </Card>
  )
}

export default PushNotification

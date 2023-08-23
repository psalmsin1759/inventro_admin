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
  password: '',
  confirmpassword: ''
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
  password: yup
    .string()
    .min(3, obj => showErrors('Password', obj.value.length, obj.min))
    .required(),

  confirmpassword: yup
    .string()
    .min(3, obj => showErrors('Confirm Password', obj.value.length, obj.min))
    .required()
})

const ChangePassword = () => {
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

    if (data.password == data.confirmpassword) {
      const input = {
        password: data.password,
        adminid: user.id
      }
      const URL = '/changepassword'

      const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

      const response = await axios.post(URL, qs.stringify(input))

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
    } else {
      setSeverity('error')
      setOpen1(true)
      setOutputValue('Password Mismatch')
      setButtonLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Change Password' titleTypographyProps={{ variant: 'h6' }} />
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
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Password'
                      type='password'
                      onChange={onChange}
                      fullWidth
                      placeholder='Password'
                      error={Boolean(errors.password)}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='confirmpassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Confirm Password'
                      type='password'
                      onChange={onChange}
                      fullWidth
                      placeholder='Confirm Password'
                      error={Boolean(errors.confirmpassword)}
                    />
                  )}
                />
                {errors.confirmpassword && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmpassword.message}</FormHelperText>
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

export default ChangePassword

import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import CardActions from '@mui/material/CardActions'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import qs from 'qs'
import axios from '../../../api/axios'

import LoadingButton from '@mui/lab/LoadingButton'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, obj => showErrors('Email', obj.value.length, obj.min))
    .required(),
  name: yup
    .string()
    .min(3, obj => showErrors('Name', obj.value.length, obj.min))
    .required(),
  phone: yup
    .string()
    .min(3, obj => showErrors('Phone', obj.value.length, obj.min))
    .required()
})

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const StaffEdit = ({ id }) => {
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const URL = 'admins/' + id

    const response = await axios.get(URL, {
      Headers: { 'content-type': "'application/json" }
    })

    reset({
      name: response?.data.data.name,
      phone: response?.data.data.phone,
      email: response?.data.data.email
    })
  }

  const [buttonLoading, setButtonLoading] = useState(false)

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

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

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      name: data.name,
      phone: data.phone
    }

    const URL = '/admins/' + id

    const response = await axios.put(URL, formData, {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    console.log(response)

    if (response?.data.success) {
      setSeverity('success')
      setOutputValue('Successfully added')
      setOpen1(true)

      setButtonLoading(false)
    } else {
      setSeverity('error')
      setOpen1(true)
      setOutputValue('Error occurred')

      setButtonLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader title='Edit Minister Info' titleTypographyProps={{ variant: 'h6' }} />
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

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Admin Name'
                      onChange={onChange}
                      placeholder='Admin Name'
                      error={Boolean(errors.name)}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Email'
                      onChange={onChange}
                      placeholder='Email'
                      error={Boolean(errors.email)}
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Phone Number'
                      type='number'
                      onChange={onChange}
                      placeholder='Phone Number'
                      error={Boolean(errors.phone)}
                    />
                  )}
                />
                {errors.phone && <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 0 }} />
            </Grid>
          </Grid>
        </CardContent>

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

export default StaffEdit

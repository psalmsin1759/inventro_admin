// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import Alert from '@mui/material/Alert'
import qs from 'qs'
import axios from '../../api/axios'

import LoadingButton from '@mui/lab/LoadingButton'

import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const defaultValues = {
  email: '',
  name: '',
  phone: ''
}

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

const AddStaffDrawer = props => {
  const auth = useAuth()
  const user = auth.user
  const userid = user?.id

  // ** Props
  const { open, toggle, reloadTable } = props

  const [buttonLoading, setButtonLoading] = useState(false)

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

  const handleClose = () => {
    toggle()
    reset()
  }

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      name: data.name,
      email: data.email,
      phone: data.phone
    }

    print(data.name + ' ' + data.email)

    const URL = '/admins'

    const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))
    print(accessToken)

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    const response = await axios.post(URL, qs.stringify(input))

    if (response?.data.success) {
      setSeverity('success')
      setOutputValue('Successfully added')
      setOpen1(true)

      reset()

      reloadTable()

      toggle()

      setButtonLoading(false)
    } else {
      setSeverity('error')
      setOpen1(true)
      setOutputValue('Error occurred')

      setButtonLoading(false)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Admin</Typography>
        <Close fontSize='small' onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Header>
      <Box sx={{ p: 5 }}>
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
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Email'
                  type='email'
                  onChange={onChange}
                  placeholder='Email'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>

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

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LoadingButton
              loading={buttonLoading}
              loadingPosition='start'
              size='large'
              type='submit'
              variant='contained'
              sx={{ mr: 3 }}
            >
              Submit
            </LoadingButton>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddStaffDrawer

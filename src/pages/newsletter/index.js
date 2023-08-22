// ** React Imports
import { useState, useEffect } from 'react'

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
import { useAuth } from 'src/hooks/useAuth'

import axios from '../../api/axios'

import toast from 'react-hot-toast'

import LoadingButton from '@mui/lab/LoadingButton'

import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

// ** Third Party Components
import { EditorState } from 'draft-js'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

const defaultValues = {
  subject: ''
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
  subject: yup
    .string()
    .min(3, obj => showErrors('Subject', obj.value.length, obj.min))
    .required()
})

const NewsletterPage = () => {
  const auth = useAuth()
  const user = auth.user
  const churchID = user.church_id

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

  const { quill, quillRef } = useQuill()
  console.log(quill)

  const [message, setMessage] = useState('')

  const [formValues, setFormValues] = useState({
    subject: '',
    message: ''
  })

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        setMessage(quill.root.innerHTML)

        console.log('Text change!')
        console.log(quill.getText()) // Get text only
        console.log(quill.getContents()) // Get delta contents
        console.log(quill.root.innerHTML) // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML) // Get innerHTML using quillRef
      })
    }
  }, [quill])

  const [open1, setOpen1] = useState(false)

  const [severity, setSeverity] = useState('error')
  const [outputValue, setOutputValue] = useState('')

  const [buttonLoading, setButtonLoading] = useState(false)

  // const [messageValue, setMessageValue] = useState(EditorState.createEmpty())

  const onSubmit = async data => {
    setButtonLoading(true)

    const input = {
      subject: data.subject,
      body: message
    }
    const URL = '/sendEmailToAll'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    if (response?.data.success) {
      setSeverity('success')
      setOutputValue('Messsage Sent')
      setOpen1(true)

      reset()

      if (quill) {
        quill.setText('')
      }

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
      <CardHeader title='Email' titleTypographyProps={{ variant: 'h6' }} />
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
                  name='subject'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Subject'
                      placeholder='Subject'
                      onChange={onChange}
                      fullWidth
                      error={Boolean(errors.subject)}
                    />
                  )}
                />
                {errors.subject && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.subject.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
              <div style={{ width: parent, height: 300 }}>
                <div ref={quillRef} />
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <br />
        <br />
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

export default NewsletterPage

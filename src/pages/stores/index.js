// ** MUI Imports
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import Button from '@mui/material/Button'

// table delete edit
import Image from 'next/image'
import * as React from 'react'
import PropTypes from 'prop-types'
import LinkMui from '@mui/material/Link'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import qs from 'qs'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'
import CustomChip from 'src/@core/components/mui/chip'

import { useAuth } from 'src/hooks/useAuth'

const StorePage = () => {
  const auth = useAuth()
  const user = auth.user

  const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

  const [data, setData] = useState([])

  //delete
  const [selectedRow, setSelectedRow] = useState(0)

  const [open, setOpen] = useState(false)

  const deleteRow = async id => {
    setSelectedRow(id)
    setOpen(true)
  }

  const handleNoDialog = () => {
    setOpen(false)
  }

  const handleYesDialog = async () => {
    const input = {
      id: selectedRow,
      churchid: churchID
    }

    const URL = '/dashboard/deleteSermon'
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    axios.defaults.headers.post['Content-Type'] = 'application/json'

    const response = await axios.post(URL, qs.stringify(input), {
      Headers: { 'content-type': 'application/x-www-form-urlencoded' }
    })

    reloadData()

    setOpen(false)
  }

  const URL = '/getstores'

  useEffect(() => {
    const reloadData = async () => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      axios.defaults.headers.post['Content-Type'] = 'application/json'

      const response = await axios.get(URL)

      setData(response?.data.data)
    }
    reloadData()
  }, [])

  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false)

    return (
      <Box>
        {expanded ? value : value.slice(0, 200)}&nbsp;
        {value.length > 200 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <LinkMui type='button' component='button' sx={{ fontSize: 'inherit' }} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'view less' : 'view more'}
          </LinkMui>
        )}
      </Box>
    )
  }

  ExpandableCell.propTypes = {
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.any
  }

  const columns = [
    {
      flex: 1.5,
      field: 'name',
      minWidth: 200,
      headerName: 'Name'
    },
    {
      flex: 1,
      minWidth: 200,
      field: 'email',
      headerName: 'Email'
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'currencyname',
      headerName: 'Default Currency'
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'next_expiration',
      headerName: 'Expiry Date'
    },
    {
      flex: 0.5,
      minWidth: 130,
      field: 'subscriptonname',
      headerName: 'Subscription Plan'
    },

    {
      flex: 0.5,
      minWidth: 130,
      field: 'created_at',
      headerName: 'Joined'
    }
  ]

  //const onSubmit = async data => {

  //const loadTransaction = async () => {

  return (
    <>
      <Card>
        <CardHeader title='Stores' />
        <Box sx={{ height: 500 }}>
          {/* <DataGrid columns={columns} rows={data} pageSize={12} /> */}

          <DataGrid
            rows={data}
            columns={columns}
            pageSize={8}
            sx={{
              '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                py: 1
              },
              '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                py: '15px'
              },
              '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                py: '22px'
              },
              '& .MuiDataGrid-renderingZone': {
                maxHeight: 'none !important'
              },
              '& .MuiDataGrid-cell': {
                lineHeight: 'unset !important',
                maxHeight: 'none !important',
                whiteSpace: 'normal'
              },
              '& .MuiDataGrid-row': {
                maxHeight: 'none !important'
              },
              '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
                outline: 'none'
              }
            }}
          />
        </Box>

        <Dialog
          open={open}
          disableEscapeKeyDown
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              handleNoDialog()
            }
          }}
        >
          <DialogTitle id='alert-dialog-title'>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>Are you sure you want to delete?</DialogContentText>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button onClick={handleNoDialog}>No</Button>
            <Button onClick={handleYesDialog}>Yes</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  )
}

export default StorePage

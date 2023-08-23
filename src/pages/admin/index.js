// ** MUI Imports
import { DataGrid } from '@mui/x-data-grid'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import { useState, useEffect } from 'react'
import axios from '../../api/axios'
import Button from '@mui/material/Button'
import AddMinisterDrawer from './AddStaffDrawer'

import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import DeleteOutline from 'mdi-material-ui/DeleteOutline'

import * as React from 'react'
import PropTypes from 'prop-types'
import LinkMui from '@mui/material/Link'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import qs from 'qs'
import { useAuth } from 'src/hooks/useAuth'

const StaffListPage = () => {
  const auth = useAuth()
  const user = auth.user
  const churchID = user.church_id

  const accessToken = JSON.parse(window.localStorage.getItem('accessToken'))

  const [addUserOpen, setAddUserOpen] = useState(false)

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const reloadData = () => {
    loadTransaction()
  }

  const [data, setData] = useState([])

  const URL = '/admins'

  useEffect(() => {
    loadTransaction()
  }, [])

  const loadTransaction = async () => {
    const response = await axios.get(URL, {
      Headers: { Authorization: `Bearer ${accessToken}`, 'content-type': "'application/json" }
    })

    console.log(response?.data.data)

    setData(response?.data.data)
  }

  const [selectedRow, setSelectedRow] = useState(0)

  const [open, setOpen] = useState(false)

  const handleNoDialog = () => {
    setOpen(false)
  }

  const handleYesDialog = async () => {
    const URL = '/admins/' + selectedRow

    const response = await axios.delete(URL, {
      Headers: { Authorization: `Bearer ${accessToken}`, 'content-type': 'application/x-www-form-urlencoded' }
    })

    //setData(null)

    reloadData()

    setOpen(false)
  }

  const deleteRow = async id => {
    setSelectedRow(id)
    setOpen(true)
  }

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
      field: 'name',
      headerName: 'Name',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1
    },

    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1
    },

    {
      field: 'created_at',
      headerName: 'Joined',
      flex: 0.5
    },

    {
      sortable: false,
      field: 'actions',
      headerName: '',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='Edit'>
            <Box>
              <Link href={`/admin/edit/${row.id}`} passHref>
                <IconButton size='small' component='a' sx={{ textDecoration: 'none', mr: 0.5 }}>
                  <PencilOutline />
                </IconButton>
              </Link>
            </Box>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => deleteRow(row.id)}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <Card>
        <CardHeader title='Admin' />
        <Box
          sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button sx={{ mb: 2 }} onClick={toggleAddUserDrawer} variant='contained'>
              Add Admin
            </Button>
          </Box>
        </Box>
        <Box sx={{ height: 500 }}>
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

        <AddMinisterDrawer open={addUserOpen} toggle={toggleAddUserDrawer} reloadTable={reloadData} />
      </Card>
    </>
  )
}

export default StaffListPage

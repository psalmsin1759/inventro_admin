// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import UploadOutline from 'mdi-material-ui/UploadOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import AccountGroupOutline from 'mdi-material-ui/AccountGroupOutline'

const navigation = () => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home'
    },
    {
      title: 'Bulk Upload',
      icon: UploadOutline,
      path: '/product'
    },
    {
      title: 'Push Notification',
      icon: AlertCircleOutline,
      path: '/push'
    },
    {
      title: 'Newsletter',
      icon: EmailOutline,
      path: '/newsletter'
    },
    {
      title: 'Admin',
      icon: AccountGroupOutline,
      path: '/admin'
    }
  ]
}

export default navigation

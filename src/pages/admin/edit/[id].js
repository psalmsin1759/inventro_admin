import StaffEdit from '.'
import { useRouter } from 'next/router'

const EditMinister = () => {
  const router = useRouter()
  const { id } = router.query

  return <StaffEdit id={id} />
}

export default EditMinister

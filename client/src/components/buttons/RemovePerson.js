import { DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { GET_PEOPLE, REMOVE_PERSON } from '../../graphql/queries'
import filter from 'lodash.filter'

const RemovePerson = ({ id }) => {
  const [removePerson] = useMutation(REMOVE_PERSON, {
    update(cache, { data: { removePerson } }) {
      const { peoples } = cache.readQuery({ query: GET_PEOPLE })
      
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          peoples: filter(peoples, p => p.id !== removePerson.id)
        }
      })
    }
  })

  const handleButtonClick = () => {
    let result = window.confirm(
      'Are you sure you want to delete this person? This will also delete all their cars.'
    )

    if (result) {
      removePerson({
        variables: {
          id
        }
      })
    }
  }

  return (
    <DeleteOutlined 
      key='delete' 
      style={{ color: 'red' }} 
      onClick={handleButtonClick} 
    />
  )
}

export default RemovePerson
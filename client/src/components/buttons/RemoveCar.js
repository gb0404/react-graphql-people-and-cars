import { DeleteOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client'
import { GET_PEOPLE, REMOVE_CAR } from '../../graphql/queries'

const RemoveCar = ({ id }) => {
  const [removeCar] = useMutation(REMOVE_CAR, {
    update(cache, { data: { removeCar } }) {
      const { peoples } = cache.readQuery({ query: GET_PEOPLE })
      
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          peoples: peoples.map(person => ({
            ...person,
            cars: person.cars.filter(car => car.id !== removeCar.id)
          }))
        }
      })
    }
  })

  const handleButtonClick = () => {
    let result = window.confirm('Are you sure you want to delete this car?')

    if (result) {
      removeCar({
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

export default RemoveCar
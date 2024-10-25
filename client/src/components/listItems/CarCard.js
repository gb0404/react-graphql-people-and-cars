import { Card } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { GET_PEOPLE, REMOVE_CAR } from '../../graphql/queries'
import UpdateCar from '../forms/UpdateCar'

const CarCard = ({ id, year, make, model, price, personId }) => {
  const [editMode, setEditMode] = useState(false)
  const styles = getStyles()

  const [removeCar] = useMutation(REMOVE_CAR, {
    update(cache, { data: { removeCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE })
      const updatedPeople = people.map(person => {
        if (person.id === removeCar.personId) {
          return {
            ...person,
            cars: person.cars.filter(car => car.id !== removeCar.id)
          }
        }
        return person
      })
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: updatedPeople
        }
      })
    }
  })

  const handleButtonClick = () => setEditMode(!editMode)

  const handleDelete = () => {
    let result = window.confirm('Are you sure you want to delete this car?')
    if (result) {
      removeCar({
        variables: {
          id
        }
      })
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div style={styles.container}>
      {editMode ? (
        <UpdateCar
          id={id}
          year={year}
          make={make}
          model={model}
          price={price}
          personId={personId}
          onButtonClick={handleButtonClick}
        />
      ) : (
        <Card
          type="inner"
          title={`${year} ${make} ${model} -> ${formatPrice(price)}`}
          actions={[
            <EditOutlined key='edit' onClick={handleButtonClick} />,
            <DeleteOutlined key='delete' style={{ color: 'red' }} onClick={handleDelete} />
          ]}
        />
      )}
    </div>
  )
}

const getStyles = () => ({
  container: {
    marginBottom: '10px'
  }
})

export default CarCard
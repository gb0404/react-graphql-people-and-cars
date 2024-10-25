import { Card } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UpdatePerson from '../forms/UpdatePerson'
import CarCard from './CarCard'
import { useMutation } from '@apollo/client'
import { GET_PEOPLE, REMOVE_PERSON } from '../../graphql/queries'

const PersonCard = ({ id, firstName, lastName, cars }) => {
  const [editMode, setEditMode] = useState(false)
  const styles = getStyles()

  const [removePerson] = useMutation(REMOVE_PERSON, {
    update(cache, { data: { removePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE })
      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          people: people.filter(person => person.id !== removePerson.id)
        }
      })
    }
  })

  const handleButtonClick = () => setEditMode(!editMode)

  const handleDelete = () => {
    let result = window.confirm('Are you sure you want to delete this person and all their cars?')
    if (result) {
      removePerson({
        variables: {
          id
        }
      })
    }
  }

  return (
    <div style={styles.container}>
      {editMode ? (
        <UpdatePerson
          id={id}
          firstName={firstName}
          lastName={lastName}
          onButtonClick={handleButtonClick}
        />
      ) : (
        <Card
          title={`${firstName} ${lastName}`}
          actions={[
            <EditOutlined key='edit' onClick={handleButtonClick} />,
            <DeleteOutlined key='delete' style={{ color: 'red' }} onClick={handleDelete} />
          ]}
          style={styles.card}
        >
            {cars?.length ? (
              cars.map(car => (
                <CarCard key={car.id} {...car} />
              ))
            ) : (
              <p>No cars for this person</p>
            )}
               <Link to={`/people/${id}`}>
               Learn More
            </Link>
        </Card>
      )}
    </div>
  )
}

const getStyles = () => ({
  container: {
    marginBottom: '20px'
  },
  card: {
    width: '100%',
    marginBottom: '16px'
  }
})

export default PersonCard
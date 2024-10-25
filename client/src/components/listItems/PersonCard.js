import { Card } from 'antd'
import { useState } from 'react'
import { EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import UpdatePerson from '../forms/UpdatePerson'
import RemovePerson from '../buttons/RemovePerson'
import CarCard from './CarCard'

const PersonCard = ({ id, firstName, lastName, cars = [] }) => {
  const [editMode, setEditMode] = useState(false)
  const styles = getStyles()

  const handleButtonClick = () => setEditMode(!editMode)

  return (
    <div>
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
          style={styles.card}
          actions={[
            <EditOutlined key='edit' onClick={handleButtonClick} />,
            <RemovePerson id={id} />
          ]}
        >
          {cars.map(car => (
            <CarCard key={car.id} {...car} />
          ))}
          
          {<Link to={`/people/${id}`}>LEARN MORE</Link>}

        </Card>
      )}
    </div>
  )
}

const getStyles = () => ({
  card: {
    width: '1200px',
    marginBottom: '16px'
  }
})

export default PersonCard

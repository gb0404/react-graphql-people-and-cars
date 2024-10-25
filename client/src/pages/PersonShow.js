import { useQuery } from '@apollo/client'
import { GET_PERSON_WITH_CARS } from '../graphql/queries'
import { useParams, Link } from 'react-router-dom'
import { Card } from 'antd'

const PersonShow = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id }
  })

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  if (!data.personWithCars) return 'Person not found'

  const { firstName, lastName, cars } = data.personWithCars

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div style={{ maxWidth: '900px', padding: '20px' }}>
      <Card title={`${firstName} ${lastName}'s Cars`}>
        {cars.map(car => (
          <Card.Grid key={car.id} style={{ width: '100%' }}>
            {car.year} {car.make} {car.model} - {formatPrice(car.price)}
          </Card.Grid>
        ))}
      </Card>
      <div style={{ marginTop: '20px' , alignItems: 'start' }}>
        <Link to="/">GO BACK HOME</Link>
      </div>
    </div>
  )
}

export default PersonShow
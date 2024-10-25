import { useQuery } from '@apollo/client'
import { useParams, Link } from 'react-router-dom'
import { Card, Button } from 'antd'
import { GET_PERSON_WITH_CARS } from '../graphql/queries'
import CarCard from '../components/listItems/CarCard'

const ShowPage = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id }
  })
  const styles = getStyles()

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  if (!data.personWithCars) return 'Person not found'

  const { firstName, lastName, cars } = data.personWithCars

  return (
    <div style={styles.container}>
      <Link to="/">
        <Button type="primary" style={styles.backButton}>
          Go Back Home
        </Button>
      </Link>
      <Card title={`${firstName} ${lastName}'s Cars`} style={styles.card}>
        {cars?.length ? (
          cars.map(car => (
            <CarCard key={car.id} {...car} />
          ))
        ) : (
          <p>No cars found for this person</p>
        )}
      </Card>
    </div>
  )
}

const getStyles = () => ({
  container: {
    padding: '20px',
    width: '90%'
  },
  backButton: {
    marginBottom: '20px'
  },
  card: {
    width: '100%'
  }
})

export default ShowPage
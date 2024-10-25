import { useQuery } from '@apollo/client'
import { GET_PEOPLE } from '../graphql/queries'
import AddPerson from '../components/forms/AddPerson'
import AddCar from '../components/forms/AddCar'
import PersonCard from '../components/listItems/PersonCard'

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE)
  const styles = getStyles()

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <div style={styles.container}>
      <h2 style={{textAlign:'center', borderBottom:'1px solid #e8e8e8', paddingBottom: '30px'}}>PEOPLE AND THEIR CARS</h2>
      <AddPerson />
      {data.people.length > 0 && <AddCar />}
      <div style={styles.cardsContainer}>
        {data.people.map(person => (
          <PersonCard key={person.id} {...person} />
        ))}
      </div>
    </div>
  )
}

const getStyles = () => ({
  container: {
    padding: '20px'
  },
  cardsContainer: {
    marginTop: '20px',
  }
})

export default HomePage
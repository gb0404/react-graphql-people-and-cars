import { useQuery } from '@apollo/client'
import { GET_PEOPLE } from '../../graphql/queries'
import { List } from 'antd'
import PersonCard from '../listItems/PersonCard'
import PersonList from './PersonList'

const People = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE)

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (

    <List grid={{ column: 1 }}>
      <PersonList />

      {data.peoples.map(person => (
        <List.Item key={person.id}> 
          <PersonCard {...person} />
        </List.Item>
      ))}
    </List>
  )
}

export default People
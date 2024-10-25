import './App.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Title from './components/layout/Title'
import AddPerson from './components/forms/AddPerson'
import AddCar from '../src/components/forms/AddCar'
import People from '../src/components/lists/People'
import PersonShow from '../src/pages/PersonShow'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className='App'>
          <Routes>
            <Route path="/" element={
              <>
                <Title />
                <AddPerson />
                <AddCar />
                <People />
              </>
            } />
            <Route path="/people/:id" element={<PersonShow />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
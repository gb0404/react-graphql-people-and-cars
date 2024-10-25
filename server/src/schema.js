import find from 'lodash.find'
import remove from 'lodash.remove'
import { filter } from 'lodash';

const peopleArray = []
const cars = []

const typeDefs = `
  type Person {
    id: String!
    firstName: String
    lastName: String
    cars: [Car]
  }

  type Car {
    id: String!
    year: Int
    make: String
    model: String
    price: Float
    personId: String
    person: Person
  }

  type Query {
    person(id: String!): Person
    personWithCars(id: String!): Person
    peoples: [Person]
    cars: [Car]
  }

  type Mutation {
    addPerson(id: String!, firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String!, lastName: String!): Person
    removePerson(id: String!): Person
    addCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    updateCar(id: String!, year: Int!, make: String!, model: String!, price: Float!, personId: String!): Car
    removeCar(id: String!): Car
  }
`

const resolvers = {
  Query: {
    person: (root, args) => {
      return find(peopleArray, { id: args.id })
    },
    personWithCars: (root, args) => {
      const person = find(peopleArray, { id: args.id })
      if (!person) return null
      return {
        ...person,
        cars: filter(cars, { personId: args.id })
      }
    },
    peoples: () => peopleArray,
    cars: () => cars
  },
  Person: {
    cars: (person) => filter(cars, { personId: person.id })
  },
  Car: {
    person: (car) => find(peopleArray, { id: car.personId })
  },
  Mutation: {
    addPerson: (root, args) => {
      const newPerson = {
        id: args.id,
        firstName: args.firstName,
        lastName: args.lastName
      }
      peopleArray.push(newPerson)
      return newPerson
    },
    updatePerson: (root, args) => {
      const person = find(peopleArray, { id: args.id })
      if (!person) throw new Error(`Person with ID ${args.id} not found`)
      
      person.firstName = args.firstName
      person.lastName = args.lastName
      return person
    },
    removePerson: (root, args) => {
      const removedPerson = find(peopleArray, { id: args.id })
      if (!removedPerson) throw new Error(`Person with ID ${args.id} not found`)
      
      remove(peopleArray, p => p.id === removedPerson.id)
      // Also remove all cars owned by this person
      remove(cars, c => c.personId === removedPerson.id)
      return removedPerson
    },
    addCar: (root, args) => {
      const newCar = {
        id: args.id,
        year: args.year,
        make: args.make,
        model: args.model,
        price: args.price,
        personId: args.personId
      }
      cars.push(newCar)
      return newCar
    },
    updateCar: (root, args) => {
      const car = find(cars, { id: args.id })
      if (!car) throw new Error(`Car with ID ${args.id} not found`)
      
      Object.assign(car, args)
      return car
    },
    removeCar: (root, args) => {
      const removedCar = find(cars, { id: args.id })
      if (!removedCar) throw new Error(`Car with ID ${args.id} not found`)
      
      remove(cars, c => c.id === removedCar.id)
      return removedCar
    }
  }
}


export { typeDefs, resolvers }
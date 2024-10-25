// server/src/schema.js

import find from 'lodash.find'
import remove from 'lodash.remove'
import filter from 'lodash.filter'

const peopleArray = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates'
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs'
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds'
  }
]

const cars = [
  {
  id: '1',
  year: '2019',
  make: 'Toyota',
  model: 'Corolla',
  price: '40000',
  personId: '1'
  },
  {
  id: '2',
  year: '2018',
  make: 'Lexus',
  model: 'LX 600',
  price: '13000',
  personId: '2'
  },
  {
  id: '3',
  year: '2017',
  make: 'Honda',
  model: 'Civic',
  price: '20000',
  personId: '3'
  }
  ]

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
    people: [Person]
    car(id: String!): Car
    cars: [Car]
    personWithCars(id: String!): Person
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
    people: () => peopleArray,
    car: (root, args) => {
      return find(cars, { id: args.id })
    },
    cars: () => cars,
    personWithCars: (root, args) => {
      const person = find(peopleArray, { id: args.id })
      if (!person) return null
      
      person.cars = filter(cars, { personId: args.id })
      return person
    }
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
      if (!person) {
        throw new Error(`Couldn't find person with id ${args.id}`)
      }

      person.firstName = args.firstName
      person.lastName = args.lastName

      return person
    },
    removePerson: (root, args) => {
      const removedPerson = find(peopleArray, { id: args.id })
      if (!removedPerson) {
        throw new Error(`Couldn't find person with id ${args.id}`)
      }

      remove(peopleArray, p => p.id === removedPerson.id)
      // Remove associated cars
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
      if (!car) {
        throw new Error(`Couldn't find car with id ${args.id}`)
      }

      car.year = args.year
      car.make = args.make
      car.model = args.model
      car.price = args.price
      car.personId = args.personId

      return car
    },
    removeCar: (root, args) => {
      const removedCar = find(cars, { id: args.id })
      if (!removedCar) {
        throw new Error(`Couldn't find car with id ${args.id}`)
      }

      remove(cars, c => c.id === removedCar.id)

      return removedCar
    }
  }
}

export { typeDefs, resolvers }
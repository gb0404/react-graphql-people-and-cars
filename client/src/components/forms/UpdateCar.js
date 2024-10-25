import { useMutation, useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import { UPDATE_CAR, GET_PEOPLE, GET_CARS } from '../../graphql/queries'

const UpdateCar = props => {
  const { id, year, make, model, price, personId, onButtonClick } = props
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const { loading, error, data } = useQuery(GET_PEOPLE)
  const [updateCar] = useMutation(UPDATE_CAR, {
    update(cache, { data: { updateCar } }) {
      try {
        // Update cars list
        const existingCars = cache.readQuery({ query: GET_CARS });
        if (existingCars) {
          const updatedCars = existingCars.cars.map(car => 
            car.id === updateCar.id ? updateCar : car
          );
          
          cache.writeQuery({
            query: GET_CARS,
            data: {
              cars: updatedCars
            }
          });
        }

        const { peoples } = cache.readQuery({ query: GET_PEOPLE });
        const updatedPeoples = peoples.map(person => {
          if (person.id === personId && person.id !== updateCar.personId) {
            return {
              ...person,
              cars: (person.cars || []).filter(car => car.id !== updateCar.id)
            };
          }
          if (person.id === updateCar.personId && person.id !== personId) {
            return {
              ...person,
              cars: [...(person.cars || []), updateCar]
            };
          }
          if (person.id === updateCar.personId && person.id === personId) {
            return {
              ...person,
              cars: (person.cars || []).map(car => 
                car.id === updateCar.id ? updateCar : car
              )
            };
          }
          return person;
        });

        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            peoples: updatedPeoples
          }
        });
      } catch (e) {
        console.error('Cache update error:', e);
      }
    }
  });

  useEffect(() => {
    forceUpdate()
  }, [])

  const onFinish = values => {
    const { year, make, model, price, personId: newPersonId } = values
    updateCar({
      variables: {
        id,
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId: newPersonId
      }
    })
    onButtonClick()
  }

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  return (
    <Form
      name='update-car-form'
      layout='inline'
      form={form}
      onFinish={onFinish}
      initialValues={{
        year,
        make,
        model,
        price,
        personId
      }}
    >
      <Form.Item name='year' rules={[{ required: true, message: 'Please enter year' }]}>
        <InputNumber placeholder='Year' />
      </Form.Item>
      <Form.Item name='make' rules={[{ required: true, message: 'Please enter make' }]}>
        <Input placeholder='Make' />
      </Form.Item>
      <Form.Item name='model' rules={[{ required: true, message: 'Please enter model' }]}>
        <Input placeholder='Model' />
      </Form.Item>
      <Form.Item name='price' rules={[{ required: true, message: 'Please enter price' }]}>
        <InputNumber
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          placeholder='Price'
        />
      </Form.Item>
      <Form.Item name='personId' rules={[{ required: true, message: 'Please select person' }]}>
        <Select style={{ width: 200 }}>
          {data.peoples.map(person => (
            <Select.Option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        <Button type='primary' htmlType='submit'>
          Update Car
        </Button>
      </Form.Item>
      <Button onClick={onButtonClick}>Cancel</Button>
    </Form>
  )
}

export default UpdateCar

import { useMutation, useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import { ADD_CAR, GET_PEOPLE, GET_CARS } from '../../graphql/queries'
import { v4 as uuidv4 } from 'uuid'

const AddCar = () => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const { loading, error, data } = useQuery(GET_PEOPLE)
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      try {
        const existingCarsData = cache.readQuery({ query: GET_CARS });
        const newCar = {
          ...addCar,
          __typename: 'Car',
          person: {
            __typename: 'Person',
            id: addCar.personId
          }
        };
        
        cache.writeQuery({
          query: GET_CARS,
          data: {
            cars: existingCarsData ? [...existingCarsData.cars, newCar] : [newCar]
          }
        });

        const existingPeopleData = cache.readQuery({ query: GET_PEOPLE });
        if (existingPeopleData) {
          const updatedPeoples = existingPeopleData.peoples.map(person => {
            if (person.id === addCar.personId) {
              const updatedCars = person.cars || [];
              return {
                ...person,
                cars: [...updatedCars, {
                  ...addCar,
                  __typename: 'Car'
                }]
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
        }
      } catch (e) {
        console.error('Cache update error:', e);
      }
    }
  });

  useEffect(() => {
    forceUpdate({})
  }, [])

  const onFinish = values => {
    const { year, make, model, price, personId } = values

    addCar({
      variables: {
        id: uuidv4(), // Generate new ID for each car
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId
      }
    });
    
    form.resetFields()
  }

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  if (!data?.peoples?.length) return null

  return (
    <div style={{ marginBottom: '4px', textAlign: 'center'}} >
      <h2 style={{ paddingBottom: '10px', borderBottom: '1px solid #e8e8e8'}}><span>Add Car</span></h2>
      <Form
        name='add-car-form'
        layout='inline'
        size='large'
        style={{ marginBottom: '40px' }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item 
          label={<span>Year</span>} 
          name='year' 
          rules={[{ required: true, message: 'Please enter year' }]}
        >
          <InputNumber placeholder='Year' />
        </Form.Item>
        <Form.Item 
          label={<span>Make</span>} 
          name='make' 
          rules={[{ required: true, message: 'Please enter make' }]}
        >
          <Input placeholder='Make' />
        </Form.Item>
        <Form.Item 
          label={<span>Model</span>} 
          name='model' 
          rules={[{ required: true, message: 'Please enter model' }]}
        >
          <Input placeholder='Model' />
        </Form.Item>
        <Form.Item 
          label={<span>Price</span>} 
          name='price' 
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder='Price'
          />
        </Form.Item>
        <Form.Item 
          label={<span>Person</span>} 
          name='personId' 
          rules={[{ required: true, message: 'Please select person' }]}
        >
          <Select placeholder="Select a person" style={{ width: 200 }}>
            {data.peoples.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type='primary'
              htmlType='submit'
              disabled={
                !form.isFieldsTouched(true) ||
                form.getFieldsError().filter(({ errors }) => errors.length).length
              }
            >
              Add Car
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddCar;
import { useMutation, useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ADD_CAR, GET_PEOPLE } from '../../graphql/queries'

const AddCar = () => {
  const [id] = useState(uuidv4())
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const { loading, error, data } = useQuery(GET_PEOPLE)
  const [addCar] = useMutation(ADD_CAR)

  useEffect(() => {
    forceUpdate({})
  }, [])

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`
  if (!data.people.length) return null

  const onFinish = values => {
    const { year, make, model, price, personId } = values

    addCar({
      variables: {
        id,
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId
      },
      update: (cache, { data: { addCar } }) => {
        const data = cache.readQuery({ query: GET_PEOPLE })
        const updatedPeople = data.people.map(person => {
          if (person.id === addCar.personId) {
            return {
              ...person,
              cars: [...person.cars, addCar]
            }
          }
          return person
        })
        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            ...data,
            people: updatedPeople
          }
        })
      }
    })
    form.resetFields()
  }

  return (
    <div style={{ marginBottom: '4px', textAlign: 'center', display:'grid', alignItems:'center'}} >
      <h2 style={{ paddingBottom: '10px', borderBottom: '1px solid #e8e8e8' }}><span>Add Car</span></h2>
      <Form
        name="add-car-form"
        layout="inline"
        size="large"
        style={{ marginBottom: '40px', display:"flex" , justifySelf:'center'}}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label={<span>Year</span>}
          name="year" rules={[{ required: true, message: 'Please enter year' }]}>
          <InputNumber placeholder="Year" min={1900} max={2024} />
        </Form.Item>
        <Form.Item label={<span>Make</span>}
          name="make" rules={[{ required: true, message: 'Please enter make' }]}>
          <Input placeholder="Make" />
        </Form.Item>
        <Form.Item label={<span>Model</span>}
          name="model" rules={[{ required: true, message: 'Please enter model' }]}>
          <Input placeholder="Model" />
        </Form.Item>
        <Form.Item label={<span>Price</span>}
          name="price" rules={[{ required: true, message: 'Please enter price' }]}>
          <InputNumber
            placeholder="Price"
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item label={<span>Person</span>}
          name="personId" rules={[{ required: true, message: 'Please select a person' }]}>
          <Select placeholder="Select a Person">
            {data.people.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item shouldUpdate={true}>
          {() => (
            <Button
              type="primary"
              htmlType="submit"
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
      <h2 style={{ paddingBottom: '10px', borderBottom: '1px solid #e8e8e8'}}><span>Records</span></h2>

    </div>
    
  )
}

export default AddCar
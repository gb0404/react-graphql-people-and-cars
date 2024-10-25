import { useMutation, useQuery } from '@apollo/client'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import { GET_PEOPLE, UPDATE_CAR } from '../../graphql/queries'

const UpdateCar = ({ id, year, make, model, price, personId, onButtonClick }) => {
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const { loading, error, data } = useQuery(GET_PEOPLE)
  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }]  // Add this to fix the update issue
  })

  useEffect(() => {
    forceUpdate({})
  }, [])

  if (loading) return 'Loading...'
  if (error) return `Error! ${error.message}`

  const onFinish = values => {
    const { year, make, model, price, personId } = values

    updateCar({
      variables: {
        id,
        year: parseInt(year),
        make,
        model,
        price: parseFloat(price),
        personId
      }
    })
    onButtonClick()
  }

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
      <Form.Item name="year" rules={[{ required: true, message: 'Please enter year' }]}>
        <InputNumber placeholder="Year" min={1900} max={2024} />
      </Form.Item>
      <Form.Item name="make" rules={[{ required: true, message: 'Please enter make' }]}>
        <Input placeholder="Make" />
      </Form.Item>
      <Form.Item name="model" rules={[{ required: true, message: 'Please enter model' }]}>
        <Input placeholder="Model" />
      </Form.Item>
      <Form.Item name="price" rules={[{ required: true, message: 'Please enter price' }]}>
        <InputNumber
          placeholder="Price"
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
      <Form.Item name="personId" rules={[{ required: true, message: 'Please select a person' }]}>
        <Select placeholder="Select a Person">
          {data.people.map(person => (
            <Select.Option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Update Car
        </Button>
      </Form.Item>
      <Button onClick={onButtonClick}>Cancel</Button>
    </Form>
  )
}

export default UpdateCar
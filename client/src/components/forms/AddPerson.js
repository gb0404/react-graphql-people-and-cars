import { useMutation } from '@apollo/client'
import { Button, Form, Input } from 'antd'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ADD_PERSON, GET_PEOPLE } from '../../graphql/queries'

const AddPerson = () => {
  const [id] = useState(uuidv4())
  const [form] = Form.useForm()
  const [, forceUpdate] = useState()

  const [addPerson] = useMutation(ADD_PERSON)

  useEffect(() => {
    forceUpdate({})
  }, [])

  const onFinish = values => {
    const { firstName, lastName } = values

    addPerson({
      variables: {
        id,
        firstName,
        lastName
      },
      update: (cache, { data: { addPerson } }) => {
        const data = cache.readQuery({ query: GET_PEOPLE })
        cache.writeQuery({
          query: GET_PEOPLE,
          data: {
            ...data,
            people: [...data.people, addPerson]
          }
        })
      }
    })
    form.resetFields()
  }

  return (
    <div  style={{ marginBottom: '4px', textAlign: 'center', display:'grid', alignItems:'center'}} >
    <h2 style={{ paddingBottom: '10px' ,borderBottom: '1px solid #e8e8e8', alignSelf:'center'}}><span>Add Person</span></h2>
    <Form
      name="add-person-form"
      layout="inline"
      size="large"
      style={{ marginBottom: '40px', display:"flex" , justifySelf:'center'}}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item  label={<span>First Name</span>} name='firstName' rules={[{ required: true, message: 'Please enter first name' }]}
      >
        <Input placeholder="First Name" />
      </Form.Item>
      <Form.Item label={<span>Last Name</span>} name='lastName' rules={[{ required: true, message: 'Please enter last name' }]}
      >
        <Input placeholder="Last Name" />
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
            Add Person
          </Button>
        )}
      </Form.Item>
    </Form>
    </div>
  )
}

export default AddPerson
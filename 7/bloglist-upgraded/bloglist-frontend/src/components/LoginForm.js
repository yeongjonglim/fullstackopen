import React from 'react'
import { useDispatch } from 'react-redux'
import { userLogin } from '../reducers/loginReducer'
import { Card, Form, Input, Button } from 'antd'

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 8,
    },
}

const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 8,
    },
}

const LoginForm = () => {

    const dispatch = useDispatch()

    const rules = (name) => ([{
        required: true,
        message: `Please input your ${name}`
    }])

    const onFinish = values => {
        dispatch(userLogin({
            username: values.username,
            password: values.password
        }))
    }

    return (
        <div>
            <Card title="log in to application">
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={rules('username')}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={rules('password')}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default LoginForm

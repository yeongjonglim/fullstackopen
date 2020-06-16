import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import './App.css'
import 'antd/dist/antd.css'
import Blogs from './components/Blogs'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Users from './components/Users'
import User from './components/User'
import { getBlog } from './reducers/blogReducer'
import { userCheck, userLogout } from './reducers/loginReducer'

const { Content } = Layout

const App = () => {
    const [current, setCurrent] = useState('blogs')
    const user = useSelector(({ login }) => login)

    const dispatch = useDispatch()
    const history = useHistory()

    const matchUser = useRouteMatch('/users/:id')
    const matchBlog = useRouteMatch('/blogs/:id')

    useEffect(() => {
        dispatch(getBlog())
    }, [dispatch])

    useEffect(() => {
        dispatch(userCheck())
    }, [dispatch])

    const handleNavClick = (event) => {
        if (event.key === 'logout') {
            history.push('/')
            dispatch(userLogout())
            return
        }
        setCurrent(event.key)
    }

    const layoutSelection = () => {
        if (user === null) {
            return (
                <LoginForm />
            )
        } else {
            return (
                <Layout>
                    <Menu onClick={handleNavClick} selectedKeys={[current]} mode="horizontal">
                        <Menu.Item key="blogs">
                            <Link to="/">
                                blogs
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="users">
                            <Link to="/users">
                                users
                            </Link>
                        </Menu.Item>
                        <Menu.SubMenu title={user.name + ' logged in'}>
                            <Menu.Item key="logout">
                                logout
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                    <Content className="site-layout" style={{ padding: '0 50px', marginTop: 16 }}>
                        <h2>blogs</h2>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                            <Switch>
                                <Route path="/users/:id">
                                    <User id={matchUser ? matchUser.params.id : null}/>
                                </Route>
                                <Route path="/users">
                                    <Users />
                                </Route>
                                <Route path="/blogs/:id">
                                    <Blog id={matchBlog ? matchBlog.params.id : null} />
                                </Route>
                                <Route path="/">
                                    <Blogs />
                                </Route>
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            )
        }
    }

    return (
        <div>
            <Notification />
            {layoutSelection()}
        </div>
    )
}

export default App

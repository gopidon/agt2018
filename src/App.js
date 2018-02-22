import React from 'react';
import { Link, Switch, Route  } from 'react-router-dom';
import Home from './Home';
import Test from './Test';
import Register from './components/Register';
import RepresentationPage from './components/RepresentationPage';
import RepresentationList from './components/RepresentationList';

import { Layout, Menu, Affix } from 'antd';
const { Header, Content} = Layout;

const FixedMenuLayout = () => (
    <Layout className="layout">
        <Header>
            <Affix>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['News']}
                    style={{ lineHeight: '64px' }}>
                    <Menu.Item key="Home">
                        <Link to="/reps" className="nav-text">My Representations</Link>
                    </Menu.Item>
                    {/*<Menu.Item key="Test">
                     <Link to="/Test" className="nav-text">Test</Link>
                     </Menu.Item>*/}
                </Menu>
            </Affix>
        </Header>
        <Content style={{ padding: '0 50px' }}>
            <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/reps" component={RepresentationList}/>
                    <Route exact path="/reps/show/:representationId" component={RepresentationPage}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/reps/:createResult" component={RepresentationList}/>
                </Switch>
            </div>
        </Content>
    </Layout>
)

export default FixedMenuLayout

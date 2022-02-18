import React, { useEffect, useState } from 'react';
import { Card, Table, Row, Input, Button, Col, message } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import NewModal from "./modals/NewReminder";
import '../configs/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import AxiosClient from '../services/AxiosClient';
import { OS, currentBrowser } from "../configs/system";


const Reminder = () => {
    const [list, SetList] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(10)
    const [loading, setLoading] = useState(false)
    const [reminder, setReminder] = useState()
    const [query_value, setQueryValue] = useState('')


    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Event',
            dataIndex: 'event'
        },
        {
            title: 'Details',
            dataIndex: 'details'
        },
        {
            title: 'Date',
            dataIndex: 'event_date',
            render: (_, record) => (
                <span>{moment.parseZone(record.created_on).format('MMM, Do YYYY, hh:mm A')}</span>
            ),
            sorter: true
        }
    ];

    const AuthUser = async => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);

                const access_token = credential.accessToken;
                // The signed-in user info.

                const email = result.user.email;
                const user_name = result.user.displayName;

                const device_os = OS(window);
                const device_name = currentBrowser(window);
                //console.log(token, email, user_name);
                saveAuth({ access_token, email, user_name, device_name, device_os });
                // ...
            }).catch((error) => {
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // // The email of the user's account used.
                // const email = error.email;
                // // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(error);
                // ...
            });
    }

    const saveAuth = async (data) => {
        const hide = message.loading("Fetching")
        try {
            const client = await AxiosClient();
            const response = await client.post(`auth/onboard`, { ...data });
            console.log(response.data.data.token);
            if(response.data.data.token)
            localStorage.setItem('auth_token',response.data.data.token);

        } catch (error) {
        }
        hide()
    }

    const onSearch = e => {

    }

    const fetchReminder = async () => {

    }

    useEffect(() => {
        fetchReminder();
        if(!localStorage.getItem('auth_token')){AuthUser();}     
    }, [])

    return (
        <>
            <div className="main">
                <div className="container">
                    <fieldset>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                                <Input
                                    placeholder="Search"
                                    prefix={<SearchOutlined />}
                                    onInput={(e) => e.currentTarget.value === '' && onSearch(e)}
                                    onKeyDown={(e) => e.key === 'Enter' && onSearch(e)} />
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>

                            </Col>
                            <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                                <Button className="button_example" type="primary" onClick={() => setReminder({})}>
                                    <PlusCircleOutlined />
                                    <span>New Reminder</span>
                                </Button>

                            </Col>
                        </Row>


                        <Card>
                            <div className="table-responsive">
                                <Table
                                    columns={tableColumns}
                                    dataSource={list}
                                    loading={loading}
                                    onChange={(pagination, filter, sort) => fetchReminder(pagination.current, query_value, sort?.field, sort?.order?.slice(0, -3))}
                                    style={{ cursor: 'pointer' }}
                                    pagination={{ total }}
                                />
                            </div>

                        </Card>
                    </fieldset>
                </div>
            </div>
            <NewModal
                initialValues={reminder}
                onClose={() => setReminder()}
                onFinish={fetchReminder} />
        </>

    )
}

export default Reminder;
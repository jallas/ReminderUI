import React, { useEffect, useState } from 'react';
import { Card, Table, Row, Input, Button, Col, message, Popconfirm } from 'antd';
import { SearchOutlined, PlusCircleOutlined, ReloadOutlined, DeleteFilled } from '@ant-design/icons';
import moment from 'moment';
import NewModal from "./modals/NewReminder";
import '../configs/firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import AxiosClient from '../services/AxiosClient';
import { OS, currentBrowser } from "../configs/system";
//import {useChromeStorageLocal,createChromeStorageStateHookLocal} from 'use-chrome-storage';
import {useSettingsStore} from '../services/chromeStorage';


const Reminder = () => {
    const [list, setList] = useState([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(10)
    const [loading, setLoading] = useState(false)
    const [reminder, setReminder] = useState()
    const [query_value, setQueryValue] = useState('')

    const [setValue] = useSettingsStore();


    const tableColumns = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'Title',
            dataIndex: 'title'
        },
        {
            title: 'Details',
            dataIndex: 'details'
        },
        {
            title: 'Participants',
            dataIndex: 'participants',
            render: (_, record) => (
                <span>{
                    record.participants.map((item) =>
                        <div key={item.id}>{item.email}</div>
                    )
                }</span>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'event_date',
            render: (_, record) => (
                <span>{moment.parseZone(record.event_date).format('MMM, Do YYYY, hh:mm A')}</span>
            ),
            sorter: true
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (<><span style={{ cursor: 'pointer', color: 'blue', paddingRight: '10px' }} onClick={() => sendReminder(record)} ><ReloadOutlined /></span>
                 <Popconfirm
                        placement="right"
                        title={"Are you sure you want to cancel this record?"}
                        onConfirm={() => cancelReminder(record)}
                        okText="Yes"
                        cancelText="No">
                        <DeleteFilled />
                    </Popconfirm>
                {/* <span style={{ cursor: 'pointer', color: 'green',paddingLeft: '10px' }} onClick={() => setReminder(record)} ><EditOutlined /></span> */}
                </>
                ),
        },
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
        const hide = message.loading("Processing")
        try {
            const client = await AxiosClient();
            const response = await client.post(`auth/onboard`, { ...data });
            console.log(response.data.data.token);
            if (response.data.data.token){
                localStorage.setItem('auth_token', response.data.data.token);
                setValue(response.data.data.token);
               //fetchReminder();
            }

        } catch (error) {
        }
        hide()
    }

    const onSearch = e => {
        setQueryValue(e.currentTarget.value)
        fetchReminder(page, e.currentTarget.value)
    }

    const fetchReminder = async (page = 1, search = '', sortBy = 'created_on', sortDir = 'DESC', limit = 10) => {
        
        setLoading(true);
        try {
            const client = await AxiosClient();
            const response = await client.get(`reminders/?page=${page}&limit=${limit}&sort_by=${sortBy}&sort_dir=${sortDir}`);
            setList(response.data.data.reminders)
            setTotal(response.data.data.page_info.total)
            setPage(response.data.data.page_info.page)

        } catch (error) {
            setLoading(false);
            message.error(error.response?.data?.message || error.response?.statusText
                || error.message
                || 'Seems like something went wrong with your request. Please try again.')
        }
        setLoading(false);
    }

    const sendReminder = async(record) => {
        const hide = message.loading("Fetching")
        try {
            const client = await AxiosClient();
            const response = await client.put(`reminders/notification/${record.id}`);
            if (response.data.status !== "success") throw new Error(response?.data?.message)
            message.success(response?.data?.message)
        } catch (error) {
            setLoading(false);
            message.error(error.response?.data?.message || error.response?.statusText
                || error.message
                || 'Seems like something went wrong with your request. Please try again.')
        }
        hide()
    }

    const cancelReminder = async(record) => {
        const hide = message.loading("Processing")
        try {
            const client = await AxiosClient();
            const response = await client.put(`reminders/cancel/${record.id}`);
            if (response.data.status !== "success") throw new Error(response?.data?.message)
            message.success(response?.data?.message)
            fetchReminder();
        } catch (error) {
            setLoading(false);
            message.error(error.response?.data?.message || error.response?.statusText
                || error.message
                || 'Seems like something went wrong with your request. Please try again.')
        }
        hide()
    }
    useEffect(() => {
        if (!localStorage.getItem('auth_token')) { 
            AuthUser();
            //setValue(localStorage.getItem('auth_token')); 
        }
        else {
            fetchReminder();
        }
    },[]);

    return (
        <>
            <div className="main">
                <div className="container">
                    <fieldset>
                        <Row gutter={16}>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                <Input
                                    placeholder="Search"
                                    prefix={<SearchOutlined />}
                                    onInput={(e) => e.currentTarget.value === '' && onSearch(e)}
                                    onKeyDown={(e) => e.key === 'Enter' && onSearch(e)} />         
                            </Col>
                            <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                            <Button type="primary" className="button_right" onClick={() => setReminder({})}>
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
                                    rowKey='id'
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


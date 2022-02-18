
import React, { useState } from 'react'
import { Modal, Form, Input, Button, message, TimePicker } from 'antd';
import moment from 'moment';
import AxiosClient from '../../services/AxiosClient';

const NewReminderModal = ({ initialValues, onClose, onFinish }) => {
  const [time, setTime] = useState(moment());
  const [loading, setLoading] = useState(false)
  if (!initialValues) { return null }

  const PostData = async (data) => {
    setLoading(true)
    try {
        if (time !== "") {
          let participants = data.participant.split(',');
          console.log(participants);
          const hide = message.loading("Fetching")
          try {
              const client = await AxiosClient();
              const response = await client.post(`reminders/create`, { ...data, event_time:time,participants  });
              console.log(response.data.data);
              message.success(response.data.data.message);
          } catch (error) {
          }
          hide()
            onFinish();
            onClose();
        }
        else {
            message.success("Select time")
        }
    } catch (error) {
        message.error(error.response?.data?.message || error.response?.statusText
            || error.message
            || 'Seems like something went wrong with your request. Please try again.')
    }
    setLoading(false)
  }

  const onTimeChnage = async (time, timeString) => {
    setTime(timeString);
  }

  return (
    <Modal
      title={'New Reminder'}
      visible
      closable
      footer={null}
      width={425}
      destroyOnClose
      onCancel={onClose}>
      <div>
        <Form layout="vertical" onFinish={PostData} initialValues={initialValues}>
          <Form.Item name="title" label="TITLE" rules={[{ required: true }]} >
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="body" label="BODY" rules={[{ required: true }]}>
            <Input.TextArea rows={4} autoComplete="off" />
          </Form.Item>
          <Form.Item name="event_date" label="Date" rules={[{ required: true }]}>
            <Input type="date" autoComplete="off" />
          </Form.Item>
          <Form.Item name="event_time" label="Time">
            <TimePicker onChange={onTimeChnage} value={moment(time, 'HH:mm:ss') || moment('00:00:00', 'HH:mm:ss')} />,
          </Form.Item>
          <Form.Item name="participant" label="Participants">
            <Input.TextArea rows={2} autoComplete="off" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Send</Button>
          </Form.Item>
        </Form>
      </div>

    </Modal>
  )
}

export default NewReminderModal;

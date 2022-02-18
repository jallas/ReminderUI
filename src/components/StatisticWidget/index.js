import React from 'react'
import { Card } from 'antd';
import PropTypes from "prop-types";
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatisticWidget = ({ title, value, status, subtitle, prefix, style }) => {
  return (
    <Card style={style}>
      {title && <h4 className="mb-0 text-center">{title}</h4>}
      <div className={`${prefix ? 'd-flex' : ''} ${title ? 'mt-3' : ''}`}>
        {prefix ? <div className="mr-2">{prefix}</div> : null}
        <div>
          <h1 className="mb-0 font-weight-bold text-center">{value}</h1>
          {
            status ?
              <span className={`font-size-md font-weight-bold ml-3 text-center ${status !== 0 && status > 0 ? 'text-success' : 'text-danger'}`}>
                {status}
                {status !== 0 && status > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              </span>
              :
              null
          }
        </div>
        {subtitle && <div className="text-gray-light mt-1 text-center">{subtitle}</div>}
      </div>
    </Card>
  )
}

StatisticWidget.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  value: PropTypes.string,
  subtitle: PropTypes.string,
  status: PropTypes.number,
  prefix: PropTypes.element
};

export default StatisticWidget
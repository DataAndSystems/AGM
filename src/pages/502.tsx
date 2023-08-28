import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const ServiceUnavailablePage: React.FC = () => (
  <Result
    status="info"
    title="当前服务不可用"
    subTitle="对不起，当前服务不可用，请稍后再试"
    extra={
      <Button type="primary" onClick={() => history.push('/user/login')}>
        返回登录
      </Button>
    }
  />
);

export default ServiceUnavailablePage;

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
import { Tag, Table, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getHcps } from '@/services/hmdp/hcp';
import { getLocalUserInfo } from '@/services/hmdp/user';

/*
id: number;
name: string;
hospital?: string;
department?: string;
admin_title?: string;
kvp_admin_title?: string;
academic_title?: string;
kvp_academic_title?: string;
supervisor_title?: string;
kvp_supervisor_title?: string;
research_territory: string;
max_education_degree?: string;
data_state: number;
revise_owner?: User;
*/

// TODO: 需要把这个any改成特定的props类型

const valueEnum = {
  0: 'close',
  1: 'processing',
  2: 'tobefixed',
  3: 'finished',
};
const ProcessMap = {
  close: 'normal',
  processing: 'active',
  tobefixed: 'success',
  finished: 'exception',
};

export type Status = {
  color: string;
  text: string;
};

const statusMap = {
  undefined: {
    color: '',
    text: '未处理',
  },
  1: {
    color: '',
    text: '未处理',
  },
  3: {
    color: 'red',
    text: '待修复',
  },
  2: {
    color: 'blue',
    text: '处理中',
  },
  4: {
    color: 'green',
    text: '已处理',
  },
  5: {
    color: 'green',
    text: '已审核',
  }
};

let DataCollationList: React.FC = (props: any) => {

  const columns: ProColumns<Hcp>[] = [
    {
      title: 'ID',
      width: 60,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left'
    },
    {
      title: '姓名',
      width: 60,
      fixed: 'left',
      key: 'hcp_name',
      dataIndex: 'hcp_name',
    },
    {
      title: '医院',
      width: 180,
      key: 'hospital',
      dataIndex: 'hospital',
    },
    {
      title: '科室',
      width: 60,
      key: 'department',
      dataIndex: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 60,
      key: 'status',
      render: (_, record) => <Tag color={statusMap[record.data_state].color}>{statusMap[record.data_state].text}</Tag>,
    },
    {
      title: '操作',
      width: 60,
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (e: any) => {
        return [<Link to={`/workspace/project/${props.match.params.project_id}/revision?hcp_id=${e.props.text.id}`}>校对</Link>]
      },
    },
  ];

  let [hcps, setHcps] = useState<Hcp[]>([]);
  let [current, setCurrent] = useState<number>(1);
  let [pageSize, setPageSize] = useState<number>(20);
  let [total, setTotal] = useState<number>();
  let [dataState, setDataState] = useState<string>('1');

  let fetchHcp = async (c?: number, ps?: number, ds?: number) => {

    if(!c) {
      c = current;
    }
    if(!ps) {
      ps = pageSize;
    }
    if(!ds) {
      ds = parseInt(dataState);
    }

    let userInfo = getLocalUserInfo();
    console.log(userInfo);

    console.log(`load hcp ${ps} ${c}`);
    let result = await getHcps({
      project_id: props.match.params.project_id,
      pageSize: ps,
      current: c,
      data_state: ds,
      role_list: userInfo.roles,
      user_id: userInfo.id,
    });
    if(result?.success) {
      setHcps(result.data!);
      setTotal(result.total);
      setCurrent(c!);
      setPageSize(ps);
    }
  }

  useEffect(() => {
    if(props.match.params.project_id === ':project_id'){
      location.replace("/project/overview")
    }
    fetchHcp();
  },[]);

  return (
    <PageContainer
      tabActiveKey={dataState}
      tabList={[
        /*
        {
          tab: '处理中',
          key: '2',
        },*/
        {
          tab: '待修复',
          key: '3',
        },
        {
          tab: '未处理',
          key: '1',
        },
        {
          tab: '已处理',
          key: '4',
        },
        {
          tab: '已审核',
          key: '5',
        },
      ]}
      onTabChange={(ds) => {
        setDataState(ds);
        fetchHcp(current, pageSize, parseInt(ds));
      }}
    >
      <ProTable<Hcp>
      columns={columns}
      rowSelection={{
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={() => {
        return (
          <Space size={16}>
            <a>导出数据</a>
          </Space>
        );
      }}
      dataSource={hcps}
      scroll={{ x: 1300 }}
      options={false}
      search={false}
      rowKey="id"
      headerTitle="批量操作"
      pagination={{
        pageSize: pageSize,
        current: current,
        total: total,
      }}
      onChange={(pagination)=>{
        fetchHcp(pagination.current, pagination.pageSize);
      }}
    />
    </PageContainer>
  );
};

export default DataCollationList;
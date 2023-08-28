import React, { useState, useEffect } from 'react';
import { Statistic, List, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { getProjectProgress, getProjectUserProgressList } from '@/services/hmdp/project_progress'
import { getProject } from '@/services/hmdp/project'
import { history } from 'umi'
const { Divider } = ProCard;

// TODO: 需要把这个any改成特定的props类型
let ProjectDetail: React.FC = (props: any) => {

  let [projectProgressLoading, setProjectProgressLoading] = useState(false);
  let [projectUserProgressLoading, setProjectUserProgressLoading] = useState(false);
  let [projectProgress, setProjectProgress] = useState<ProjectProgress>();
  let [projectUserProgressList, setProjectUserProgressList] = useState<UserProjectProgress[]>([]);
  let [filteredUserProgressList, setFilteredUserProgressList] = useState<UserProjectProgress[]>([]);
  let [searchChangeOn, setSearchChangeOn] = useState(true);
  let [currentProject, setCurrentProject] = useState<Project>();

  let fetchProjectProgress = async (project_id: number) =>{
    setProjectProgressLoading(true);
    let data = await getProjectProgress(project_id);
    if (data?.success) {
        setProjectProgress(data.data!);
    }
    setProjectProgressLoading(false);
  }

  let fetchProjectUserProgressList = async (project_id: number) => {
    setProjectProgressLoading(true);
    let data = await getProjectUserProgressList(project_id);
    console.log(data);
    if (data?.success) {
        setProjectUserProgressList(data.data!);
        setFilteredUserProgressList(data.data!);
    }
    setProjectUserProgressLoading(false);
  }

  let fetchProject = async (project_id: number) => {
    let data = await getProject(project_id);
    if (data?.success) {
      setCurrentProject(data.data);
    }
  }

  useEffect(
    ()=>{
      //fetchProject(props.match.params.id)
      fetchProjectProgress(props.match.params.id);
      fetchProjectUserProgressList(props.match.params.id)
    },
    []
  );

  let onSearchWorker = (e: any) => {

    if(!searchChangeOn && e.type === 'change') {
      return;
    }
    if(e.type === 'compositionstart') {
      setSearchChangeOn(false);
    } else if (e.type === 'compositionend') {
      setSearchChangeOn(true);
    }
    let searchKey = e.target.value;

    let filteredList = projectUserProgressList.filter(
      (userProgress?: ProjectProgress) => userProgress!.user!.name.indexOf(searchKey) != -1
    )
    setFilteredUserProgressList(filteredList);
  }

  let UserSearchBar = () => {
    return (
      <Input
        prefix={<SearchOutlined />} 
        allowClear={true}
        placeholder="输入员工姓名进行搜索"
        onCompositionStart={onSearchWorker}
        onCompositionEnd={onSearchWorker}
        onChange={onSearchWorker}
        style={{ width: 200 }} />
    )
  };

  let onReviewWork = (worker?: User) => {
    return () => {
      console.log(worker?.name);
      history.push(`/workspace/project/${props.match.params.id}/revision?mode=check&user_id=${worker?.id}`);
    }
  }
  
  let UserActionBar = (worker?: User) => {
    return (
      <>
        <Button onClick={onReviewWork(worker)} type="primary">抽查</Button>
      </>
    )
  };

  return (
    <PageContainer>
      <ProCard loading={projectProgressLoading} title={projectProgress?.project?.name} ghost
        extra={
          (
            <Button type='primary' onClick={
              ()=> {
                history.push(`/workspace/project/${props.match.params.id}`);
              }
            }>进入工作区</Button>
          )
        }
      >
        <ProCard.Group>
          <ProCard>
            <Statistic valueStyle={{color: 'green'}} title="今日" value={`${projectProgress?.f_num_today}`} />
          </ProCard>
          <Divider />
          <ProCard>
            <Statistic valueStyle={{color: 'red'}} title="待修复" value={projectProgress?.num_tofix} />
          </ProCard>
          <Divider />
          <ProCard>
            <Statistic valueStyle={{color: 'green'}}  title="总进度" value={`${projectProgress?.f_num_total}/${projectProgress?.p_num_total}`} />
          </ProCard>
          <Divider />
        </ProCard.Group>
      </ProCard>
      <ProCard loading={projectUserProgressLoading} title="明细" ghost extra={UserSearchBar()}>
      <List
        grid={{
            gutter: 16
        }}
        dataSource={filteredUserProgressList}
        renderItem={(item: UserProjectProgress)=>(
            <List.Item>
                <ProCard className={styles.singleCard} title={item?.task?.user?.name} extra={UserActionBar(item?.task?.user)}>
                <ProCard>
                    <Statistic valueStyle={{color: 'green'}} title="今日" value={`${item?.finished_num_today?item?.finished_num_today:0}`} />
                </ProCard>
                <Divider />
                <ProCard>
                    <Statistic valueStyle={{color: 'red'}} title="待修复" value={item?.num_tofix} />
                </ProCard>
                <Divider />
                <ProCard>
                    <Statistic valueStyle={{color: 'green'}} title="总进度" value={`${item?.finished_num_total}/${item?.num_total}`} />
                </ProCard>
                </ProCard>
            </List.Item>
        )}
      />
      </ProCard>
    </PageContainer>
  );
};

export default ProjectDetail;
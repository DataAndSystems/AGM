import React, { useState, useEffect } from 'react';
import { Statistic, List, Input, Button, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { getMyProjects } from '@/services/hmdp/project'
import { getLocalUserInfo } from '@/services/hmdp/user'
import { access } from '@/components/Security'
const { AccessChecker } = access
const { TabPane } = Tabs;


// TODO: 需要把这个any改成特定的props类型
let ProjectOverview: React.FC = (props: any) => {

  let [projectLoading, setProjectLoading] = useState(false);
  let [projects, setProjects] = useState<Project[]>([]);
  let [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  let [searchChangeOn, setSearchChangeOn] = useState(true);
  let [projectStatus, setProjectStatus] = useState(1);

  let fetchProjects = async (status: number) =>{
    setProjectLoading(true);

    let data = await getMyProjects(status, getLocalUserInfo().id);
    console.log(data);
    if (data?.success) {
      setProjects(data.data!);
      setFilteredProjects(data.data!);
    }
    setProjectLoading(false);
  }

  useEffect(
    ()=>{
        fetchProjects(projectStatus);
    },
    []
  );

  let onSearchProject = (e: any) => {

    if(!searchChangeOn && e.type === 'change') {
        return;
      }
      if(e.type === 'compositionstart') {
        setSearchChangeOn(false);
      } else if (e.type === 'compositionend') {
        setSearchChangeOn(true);
      }
      let searchKey = e.target.value;
  
      let filteredList = projects.filter(
        (project?: Project) => project!.name.indexOf(searchKey) != -1
      )
      setFilteredProjects(filteredList);
  }

  let ProjectSearchBar = () => {
    return (
      <Input
        prefix={<SearchOutlined />} 
        allowClear={true}
        placeholder="输入项目名进行搜索"
        onCompositionStart={onSearchProject}
        onCompositionEnd={onSearchProject}
        onChange={onSearchProject}
        style={{ width: 200 }} />
    )
  };

  let onEnterProject = (project: Project) => {
    return () => {

      let userInfo = getLocalUserInfo();
      console.log(userInfo.roles.indexOf('4000001'));
      if(userInfo.roles.indexOf('4000001') >= 0) {
        history.push(`/workspace/project/${project.id}`);
      } else if (userInfo.roles.indexOf('4000002') >= 0) {
        history.push(`/project/${project.id}`);
      } else if (userInfo.roles.indexOf('4000000') >= 0) {
        history.push(`/project/${project.id}`);
      }
      // history.push('/project/' + project.id, state: {project: project});
      // 可以将项目信息通过state传到下一个页面
      console.log(project.name);
    }
  }
  
  let ProjectActionBar = (project: Project) => {
    return (
      <AccessChecker featureCode="view_project_detail"><Button onClick={onEnterProject(project)} type="primary">进入</Button></AccessChecker>
    )
  };

  let getRoundValue = (value: number) => {
    if(!value) {
      return 0;
    }
    return Math.round(value * 100) / 100 
  }

  return (
    <PageContainer>
      <Tabs defaultActiveKey="1" onChange={
          (value: any)=>{
              if(value == "1") {
                setProjectStatus(1);
                fetchProjects(1);
              } else {
                setProjectStatus(0);
                fetchProjects(0);
              }
          }
      }>
        <TabPane tab="进行中" key="1">
          <ProCard loading={projectLoading} title="项目列表" ghost extra={ProjectSearchBar()}>
            <List
              grid={{
                gutter: 16
              }}
              dataSource={filteredProjects}
              renderItem={(project: Project)=>(
                <List.Item>
                    <ProCard className={styles.singleCard} title={project?.name} extra={ProjectActionBar(project)}>
                    <ProCard>
                        <Statistic valueStyle={{fontSize: 14}} title="负责人" value={project?.owner_name!} />
                    </ProCard>
                    <ProCard>
                        <Statistic title="成员" value={project?.project_members} />
                    </ProCard>
                    <ProCard>
                        <Statistic valueStyle={{color: 'green'}} title="进度" value={getRoundValue(project?.finished_count! / project?.total_count! * 100)} suffix={'%'} />
                    </ProCard>
                    </ProCard>
                </List.Item>
              )}
            />
          </ProCard>
        </TabPane>
        <TabPane tab="已结束" key="2">
          <ProCard loading={projectLoading} title="项目列表" ghost extra={ProjectSearchBar()}>
            <List
              grid={{
                gutter: 16
              }}
              dataSource={filteredProjects}
              renderItem={(project: Project)=>(
                <List.Item>
                    <ProCard className={styles.singleCard} title={project?.name} extra={ProjectActionBar(project)}>
                    <ProCard>
                        <Statistic title="负责人" value={project.owner_name} />
                    </ProCard>
                    <ProCard>
                        <Statistic title="项目成员" value={project.project_members} />
                    </ProCard>
                    <ProCard>
                        <Statistic valueStyle={{color: 'green'}} title="进度" value={project?.finished_count! / project?.total_count! * 100} suffix={'%'} />
                    </ProCard>
                    </ProCard>
                </List.Item>
              )}
            />
          </ProCard>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default ProjectOverview;
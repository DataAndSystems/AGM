import React, { useState, useEffect, useRef, useReducer } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Row, Col, Dropdown, Menu, Button, message, Space, Input } from 'antd';
import Highlighter from 'web-highlighter';
import { getUnrevisedHcp, updateHcp, getHcp, updateHcpState } from '@/services/hmdp/hcp';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import styles from './index.less';
import { HmFormList } from '@/components/Form/form-list/HmFormList'
import { HmForm } from '@/components/Form/form-field/HmFormField'
import { SelectOption } from '@/components/Form/types/Types'
import { options_to_object } from '@/components/Form/util/Util';
import { getLocalUserInfo } from '@/services/hmdp/user'
import { history } from 'umi';
import { NodeExpandOutlined } from '@ant-design/icons';
import { access } from '@/components/Security'
const { AccessChecker } = access

let professional_title_options: SelectOption[] = [
  {value: '', label: ''},
  {value: 'pro_t_001', label: '主任医师'},
  {value: 'pro_t_002', label: '副主任医师'},
  {value: 'pro_t_003', label: '主治医师'},
  {value: 'pro_t_004', label: '住院医师'},
  {value: 'pro_t_005', label: '其它职称'},
];

let admin_title_options: SelectOption[] = [
  {value: '', label: ''},
  {value: 'admin_post_001', label: '院长'},
  {value: 'admin_post_002', label: '副院长'},
  {value: 'admin_post_003', label: '科室主任'},
  {value: 'admin_post_004', label: '科室副主任'},
  {value: 'admin_post_005', label: '中心主任'},
  {value: 'admin_post_006', label: '中心副主任'},
  {value: 'admin_post_008', label: '病区主任'},
  {value: 'admin_post_007', label: '其它行政职务'},
  {value: 'admin_post_009', label: '党委书记'},
  {value: 'admin_post_010', label: '党委副书记'},
  {value: 'admin_post_011', label: '病组组长'},
  {value: 'admin_post_012', label: '所长'},
  {value: 'admin_post_013', label: '副所长'},
  {value: 'admin_post_014', label: '国家级机构主任'},
  {value: 'admin_post_015', label: '病区副主任'},
  {value: 'admin_post_016', label: '省级机构主任'},
  {value: 'admin_post_017', label: '省级机构副主任'},
];

let academic_title_options: SelectOption[] = [
  {value: '', label: ''},
  {value: 'ac_t_001', label: '教授'},
  {value: 'ac_t_003', label: '副教授'},
  {value: 'ac_t_005', label: '讲师'},
  {value: 'ac_t_006', label: '研究员（正高）'},
  {value: 'ac_t_007', label: '二级教授'},
];

let supervisor_title_options: SelectOption[] = [
  {value: '', label: ''},
  {value: 'su_t_001', label: '博士生导师'},
  {value: 'su_t_002', label: '硕士生导师'},
];

let association_level_options: SelectOption[] = [
  {value: 'ass_001', label: '国家级协会'},
  {value: 'ass_002', label: '国际级协会'},
  {value: 'ass_003', label: '省级协会'},
  {value: 'ass_004', label: '市级协会'},
  {value: 'ass_005', label: '地区级协会'},
];

let association_title_options: SelectOption[] = [
  {value: '0ff_001', label: '主任委员'},
  {value: '0ff_002', label: '候任主任委员'},
  {value: '0ff_003', label: '名誉主任委员'},
  {value: '0ff_004', label: '副主任委员'},
  {value: '0ff_005', label: '常务委员'},
  {value: '0ff_006', label: '委员'},
  {value: '0ff_007', label: '秘书长'},
  {value: '0ff_008', label: '副秘书长'},
  {value: '0ff_009', label: '秘书'},
  {value: '0ff_010', label: '会长'},
  {value: '0ff_011', label: '名誉会长'},
  {value: '0ff_012', label: '副会长'},
  {value: '0ff_013', label: '组长'},
  {value: '0ff_014', label: '名誉组长'},
  {value: '0ff_015', label: '副组长'},
  {value: '0ff_016', label: '会员'},
  {value: '0ff_017', label: '组员'},
  {value: '0ff_018', label: '顾问'},
  {value: '0ff_019', label: '主席'},
  {value: '0ff_020', label: '前任主席'},
  {value: '0ff_021', label: '候任主席'},
  {value: '0ff_022', label: '副主席'},
  {value: '0ff_023', label: '总干事'},
  {value: '0ff_024', label: '副总干事'},
  {value: '0ff_025', label: '理事长'},
  {value: '0ff_026', label: '名誉理事长'},
  {value: '0ff_027', label: '副理事长'},
  {value: '0ff_028', label: '理事'},
  {value: '0ff_029', label: '其他协会职务'},
];

let education_degree_options: SelectOption[] = [
  {value: 'edu_001', label: '学士'},
  {value: 'edu_002', label: '硕士'},
  {value: 'edu_003', label: '博士'},
  {value: 'edu_004', label: '博士后'},
  {value: 'edu_005', label: '进修'},
  {value: 'edu_006', label: '访问学者'},
  {value: 'edu_007', label: '研究员'},
  {value: 'edu_008', label: '其它经历'},
]

let award_level_options: SelectOption[] = [
  {value: 'award_001', label: '国际级奖项'},
  {value: 'award_002', label: '国家级奖项'},
  {value: 'award_003', label: '省级奖项'},
  {value: 'award_004', label: '市级奖项'},
  {value: 'award_005', label: '县区级奖项'},
  {value: 'award_006', label: '医院级奖项'},
  {value: 'award_007', label: '学院级奖项'},
  {value: 'award_008', label: '奖项级别未知'},
  {value: 'award_009', label: '其他'},
]

let honour_level_options: SelectOption[] = [
  {value: 'honour_level_01', label: '国家级'},
  {value: 'honour_level_02', label: '省级'},
  {value: 'honour_level_03', label: '市级'},
];

let honour_title_options: SelectOption[] = [
  {value: 'honour_title_01', label: '外籍院士'},
  {value: 'honour_title_02', label: '国家院士'},
  {value: 'honour_title_03', label: '长江学者'},
  {value: 'honour_title_04', label: '千人计划'},
  {value: 'honour_title_05', label: '杰出青年'},
  {value: 'honour_title_06', label: '青年千人计划'},
  {value: 'honour_title_07', label: '青年长江学者'},
  {value: 'honour_title_08', label: '优秀青年基金'},
  {value: 'honour_title_09', label: '青年拔尖人才'},
  {value: 'honour_title_10', label: '百千万人才工程|百千万人才'},
  {value: 'honour_title_11', label: '万人计划'},
  {value: 'honour_title_12', label: '百人计划'},
  {value: 'honour_title_13', label: '国务院政府特殊津贴'},
  {value: 'honour_title_14', label: '八桂学者'},
  {value: 'honour_title_15', label: '巴渝学者'},
  {value: 'honour_title_16', label: '楚天学者'},
  {value: 'honour_title_17', label: '东方学者'},
  {value: 'honour_title_18', label: '芙蓉学者'},
  {value: 'honour_title_19', label: '井岗学者'},
  {value: 'honour_title_20', label: '昆仑学者'},
  {value: 'honour_title_21', label: '两江学者'},
  {value: 'honour_title_22', label: '龙江学者'},
  {value: 'honour_title_23', label: '闽江学者'},
  {value: 'honour_title_24', label: '攀登学者'},
  {value: 'honour_title_25', label: '钱江学者'},
  {value: 'honour_title_26', label: '黔灵学者'},
  {value: 'honour_title_27', label: '三晋学者'},
  {value: 'honour_title_28', label: '三秦学者'},
  {value: 'honour_title_29', label: '泰山学者'},
  {value: 'honour_title_30', label: '天山学者'},
  {value: 'honour_title_31', label: '皖江学者'},
  {value: 'honour_title_32', label: '燕赵学者'},
  {value: 'honour_title_33', label: '云岭学者'},
  {value: 'honour_title_34', label: '长白山学者'},
  {value: 'honour_title_35', label: '中原学者'},
  {value: 'honour_title_36', label: '珠江学者'},
  {value: 'honour_title_37', label: '卓越学者'},
  {value: 'honour_title_38', label: '漓江学者'},
  {value: 'honour_title_39', label: '桐江学者'},
  {value: 'honour_title_40', label: '西湖学者'},
]

let professional_title_options_obj = options_to_object(professional_title_options);
let admin_title_options_obj = options_to_object(admin_title_options);
let academic_title_options_obj = options_to_object(academic_title_options);
let supervisor_title_options_obj = options_to_object(supervisor_title_options);


// TODO: 需要把这个any改成特定的props类型
let DataCollationView: React.FC = (props: any) => {

  let briefRef = useRef(null);
  let [formRef] = Form.useForm<Hcp>();

  const actions = {
    objectFetched: 'OBJECT_FETCHED',
    objectChanged: 'OBJECT_CHANGED',
    subObjectAdded: 'SUB_OBJECT_ADDED',
    subObjectDeleted: 'SUB_OBJECT_DELETED',
    briefSelectionChanged: 'BRIEF_SELECTION_CHANGED',
  }

  let highlightSelection = (h:  any, text: string, textid: string, type: string) => {
    console.log(h);
    if(!text || text.length == 0) {
      return;
    }
    let hcp = hcpState.hcp;
    if(!hcp || !hcp.introduction) {
      return;
    }
    let start = hcp.introduction.indexOf(text);
    h.fromStore(start, start + text.length, text, textid);
    h.addClass(`${type}_selection_bg`, textid);
  }

  let initBriefSelection = (h: any, hcp?: Hcp) => {

    if(!h) {
      return;
    }

    for(let i in hcp?.association_list) {
      let item = hcp?.association_list[i];
      //let start = hcp?.introduction?.indexOf(item.association_name);
      highlightSelection(h, item.association_name, `${item.brief_id}`, 'associatiion');

      /*
      console.log(`brief item start: ${start} length ${item.association_name.length} ${item.brief_id}`);
      if(item.association_name) {
        console.log('add brief selection');
        h.fromStore(start, start + item.association_name.length, item.association_name, `${item.brief_id}`);
        h.addClass(styles.associatiion_selection_bg, item.brief_id);
      }*/
    }
    for(let i in hcp?.award_list) {
      let item = hcp?.award_list[i];
      let start = hcp?.introduction?.indexOf(item.award_name);
      if(item.award_name) {
        h.fromStore(start, start + item.award_name.length, item.award_name, item.brief_id);
        h.addClass(styles.award_selection_bg, item.brief_id);
      }
    }
    for(let i in hcp?.education_list) {
      let item = hcp?.education_list[i];
      let start = hcp?.introduction?.indexOf(item.school);
      if(item.school) {
        h.fromStore(start, start + item.school.length, item.school, item.brief_id);
        h.addClass(styles.education_selection_bg, item.brief_id);
      }
    }
    for(let i in hcp?.honour_list) {
      let item = hcp?.honour_list[i];
      let start = hcp?.introduction?.indexOf(item.honour_title);
      if(item.honour_title) {
        h.fromStore(start, start + item.honour_title.length, item.honour_title, item.brief_id);
        h.addClass(styles.honour_selection_bg, item.brief_id);
      }
    }
  }

  let addBriefIds = (hcp: Hcp) => {
    for(let i in hcp.association_list) {
      let item = hcp.association_list[i];
      item.brief_id = item.id;
    }
    for(let i in hcp.award_list) {
      let item = hcp.award_list[i];
      item.brief_id = item.id;
    }
    for(let i in hcp.education_list) {
      let item = hcp.education_list[i];
      item.brief_id = item.id;
    }
    for(let i in hcp.honour_list) {
      let item = hcp.honour_list[i];
      item.brief_id = item.id;
    }
  }

  type HcpAction = {type: string, payload: any}

  let [gotoHcpId, setGotoHcpId] = useState();

  let [hcpState, dispatch] = useReducer((currentHcpState: any, action: HcpAction) => {

    switch(action.type) {
      case actions.objectFetched:
        //console.log('object fetched');
        //console.log(action.payload);
        let newState = {hcp: action.payload}
        currentHcpState = newState;
        break;
      case actions.objectChanged:
        //console.log('object changed');
        //console.log(action.payload);
        currentHcpState.hcp = {...currentHcpState.hcp, ...action.payload};
        break;
      case actions.subObjectAdded:
        //console.log('object data added');
        if(!currentHcpState.hcp[action.payload.fieldName]) {
          currentHcpState.hcp[action.payload.fieldName] = []
        }
        currentHcpState.hcp[action.payload.fieldName].push(action.payload.data);
        break;
      case actions.subObjectDeleted:
        //console.log('object data deleted');
        //console.log(action.payload);
        let item = currentHcpState.hcp[action.payload.fieldName][action.payload.index];
        if(highlighter) {
          highlighter.remove(item.brief_id);
        }
        currentHcpState.hcp[action.payload.fieldName].splice(action.payload.index, 1);
        break;
      case actions.briefSelectionChanged:
        //console.log('activeSelectedId selection changed');
        currentHcpState.activeSelectedId = action.payload;
        currentHcpState.briefContextMenuDisabled = currentHcpState.activeSelectedId? false : true;
        break;
      default:
        break;
    }
    //console.log('current hcp');
    //console.log(currentHcpState);
    formRef.setFieldsValue(currentHcpState.hcp!);
    return currentHcpState;
  }, {activeSelectedId: null}); 

  //let [hcpState.activeSelectedId, setCurrentBriefSelectionId] = useState<string>();
  let [highlighter, setHighliter] = useState<Highlighter>();

  let fetchUnrevisedHcp = async (project_id: number, user_id: number, data_state?: string) => {
    let result = await getUnrevisedHcp(project_id, user_id, data_state);
    if (result?.success) {
        // setCurrentHcp(result.data);
      if(result?.data) {
        addBriefIds(result.data);
        dispatch({type: actions.objectFetched, payload: result.data});
        return result.data;
      } else {
        message.info('任务已全部完成');
      }
    }
  }

  let fetchHcp = async (project_id: number, user_id: number, hcp_id: number) => {
    let result = await getHcp(project_id, hcp_id);
    if (result?.success) {
      if(result?.data) {
        addBriefIds(result.data);
        console.log(result.data);
        dispatch({type: actions.objectFetched, payload: result.data});
        return result.data;
      } else {
        message.error('未招到指定ID的数据');
      }
    }
  }

  let initialBriefPanel = (hcp?: Hcp) => {
    if(!briefRef.current) {
      return;
    }
    let h = new Highlighter({$root: briefRef.current, style: {className: styles.normal_selection_bg}});
    h.on(Highlighter.event.CREATE, function (data: any, _inst: Highlighter, _e: Event) {
        // console.log(data);
        // console.log(data.sources[0].text);
    });
    h.on(Highlighter.event.CLICK, function (data: any, inst: Highlighter, _e: Event) {
        // console.log(data);
        inst.getDoms(data.id).forEach((s: any)=>{
          // console.log(s.innerText);
        })
    });
    h.on(Highlighter.event.HOVER, function (data: any, inst: Highlighter, _e: Event) {
        // console.log(data);
        inst.getDoms(data.id).forEach((s: any)=>{
          // console.log(s.innerText);
        })
        let a = hcpState.activeSelectedId;
        dispatch({type: actions.briefSelectionChanged, payload: data.id})
        // briefDispatch({type: 'briefSelectionChanged', payload: data.id})
        // setCurrentBriefSelectionId(data.id);
    });
    h.on(Highlighter.event.HOVER_OUT, function (data: any, inst: Highlighter, _e: Event) {
      dispatch({type: actions.briefSelectionChanged, payload: null})
    });
    setHighliter(h);
    h.run();

    initBriefSelection(h, hcp);
  }

  let loadData = async function(hcp_id? : number, data_state?: string) {
    let userInfo = getLocalUserInfo()
    console.log(`begin load data`);
    
    let user_id = props.location.query.user_id;
    if(!user_id) {
      user_id = userInfo.id;
    }

    if(!hcp_id) {
      hcp_id = props.location.query.hcp_id;
    }
    let hcpData = null;
    if(!hcp_id) {
      hcpData = await fetchUnrevisedHcp(props.match.params.project_id, user_id, data_state);
    } else {
      console.log('fetch hcp by id');
      hcpData = fetchHcp(props.match.params.project_id, user_id, hcp_id);
    }

    return hcpData;
  }

  useEffect(() => {

    let hcpData = null;
    if(props.location.query.mode === 'check') {
      hcpData = loadData(undefined, '4');
    } else {
      hcpData = loadData();
    }
    //console.log(briefRef.current);
    hcpData.then((data)=>{
      console.log('data feched callback');
      setTimeout(()=>{initialBriefPanel(data)}, 1000);
    });

  }, [])

  let onFormValueChange = (changedValues: any, allValues: any) => {
    // console.log(changedValues);
    // console.log(allValues);

    Object.keys(changedValues).forEach((key)=>{
      if(key === 'kvp_supervisor_title') {
        formRef.setFieldsValue({supervisor_title: supervisor_title_options_obj[changedValues['kvp_supervisor_title']]})
      } else if(key === 'kvp_admin_title') {
        formRef.setFieldsValue({admin_title: admin_title_options_obj[changedValues['kvp_admin_title']]})
      } else if(key === 'kvp_academic_title') {
        formRef.setFieldsValue({academic_title: academic_title_options_obj[changedValues['kvp_academic_title']]})
      } else if(key === 'kvp_professional_title') {
        formRef.setFieldsValue({professional_title: professional_title_options_obj[changedValues['kvp_professional_title']]})
      }
    });

    //console.log('form changed');
    //console.log(allValues);
    console.log('data changed');

    dispatch({type: actions.objectChanged, payload: allValues});
    
  }

  let onFormFinish = async (values: Hcp) => {
      
      console.log('on form finish');
      let dataToSave = {...values, data_state: 4, id: hcpState?.hcp.id, user_id: getLocalUserInfo().id}
      console.log(dataToSave);

      dataToSave?.education_list?.map((eduation: HcpEducation)=>{
        if(eduation.overseas) {
          eduation.overseas = 1
        } else {
          eduation.overseas = 0
        }
      });
      
      let r = await updateHcp(dataToSave);
      if(r?.success) {
        message.success('保存成功，继续下一条数据处理');
      } else {
        message.error(r.message);
        return false;
      }

      return true;
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  let addAssociation = () => {
    console.log(hcpState);
    if(!hcpState.activeSelectedId) {
      return;
    }
    let newAssociation: HcpAssociation = {
      association_name: highlighter.getDoms(hcpState.activeSelectedId)[0].innerText,
      brief_id: hcpState.activeSelectedId
    }

    console.log('ready to add association data');

    dispatch({type: actions.subObjectAdded, payload: {fieldName: 'association_list', data: newAssociation}});

    highlighter.addClass(styles.associatiion_selection_bg, hcpState.activeSelectedId);
  }

  let addEducation = () => {
    let newEduction: HcpEducation = {
      school: highlighter.getDoms(hcpState.activeSelectedId)[0].innerText,
      brief_id: hcpState.activeSelectedId
    }
    console.log('ready to add education data');
    dispatch({type: actions.subObjectAdded, payload:{fieldName: 'education_list', data:newEduction}});
    highlighter.addClass(styles.education_selection_bg, hcpState.activeSelectedId);
  }

  let addAward = () => {
    let newAward: HcpAward = {
      award_name: highlighter.getDoms(hcpState.activeSelectedId)[0].innerText,
      brief_id: hcpState.activeSelectedId
    }
    console.log('ready to add award data');
    dispatch({type: actions.subObjectAdded, payload:{fieldName: 'award_list', data: newAward}});
    highlighter.addClass(styles.award_selection_bg, hcpState.activeSelectedId);
  }

  let addHonour = () => {
    let newHonour: HcpHonour = {
      honour_title: highlighter.getDoms(hcpState.activeSelectedId)[0].innerText,
      brief_id: hcpState.activeSelectedId
    }
    console.log('ready to add honour data');
    dispatch({type: actions.subObjectAdded, payload:{fieldName: 'honour_list', data:newHonour}});
    highlighter.addClass(styles.honour_selection_bg, hcpState.activeSelectedId)
  }

  let deleteSubObject = (subObjectInfo: {fieldName: string, index: number}) => {
    dispatch({type: actions.subObjectDeleted, payload: subObjectInfo});
  }

  let removeSelection = () => {
    highlighter.remove(hcpState.activeSelectedId);
  }

  let briefSelectionMenu = (
    <Menu onClick={(_e)=>{
        console.log(hcpState.activeSelectedId);
    }}>
        <Menu.Item onClick={ removeSelection } key="delete">删除</Menu.Item>
        <Menu.Item onClick={ ()=>{addAssociation()} } key="add_association">添加到学协会</Menu.Item>
        <Menu.Item onClick={ addEducation } key="add_education">添加到学历</Menu.Item>
        <Menu.Item onClick={ addAward } key="add_reward">添加到获奖</Menu.Item>
        <Menu.Item onClick={ addHonour } key="add_honour">添加头衔</Menu.Item>
    </Menu>
  );

  const listRowGutter = { xs: 8, sm: 16, md: 24, lg: 32 }

  const emptyList = () => (
    //<Button type="primary">添加学协会</Button>
    <span>无</span>
  );

  let saveUpdate = async () => {
    console.log('on form finish');
    let dataToSave = {...hcpState.hcp, data_state: 4, user_id: getLocalUserInfo().id}
    console.log(dataToSave);

    dataToSave?.education_list?.map((eduation: HcpEducation)=>{
      if(eduation.overseas) {
        eduation.overseas = 1
      } else {
        eduation.overseas = 0
      }
    });
    
    let r = await updateHcp(dataToSave);
    if(r?.success) {
      message.success('保存成功，继续下一条数据处理');
    } else {
      message.error(r.message);
      return false;
    }
    return true;
  }

  let saveHcpState = async (data_state: number) => {
    let dataToSave = {id: hcpState.hcp.id, data_state: data_state, user_id: getLocalUserInfo().id}
    return await updateHcpState(dataToSave);
  }

  let saveUpdateAndNext = async() => {
    let r = await saveUpdate();
    if( r ) {
      await nextRecord();
    }
  }

  let loadNextRecord = async(data_state?: string) => {
    console.log(location.search);
    let needReload = false;
    let newQuery = '';
    if(location.search) {
      let querys = location.search.substring(1).split('&');
      let filteredQuerys = querys.filter((query)=>{
        if(query.indexOf('hcp_id') >= 0) {
          needReload = true;
          return false;
        }
        return true;
      });
      newQuery = filteredQuerys.join('&');
    }

    if(needReload) {
      location.replace(`${location.pathname}?${newQuery}`);
    } else {
      loadData(undefined, data_state);
    }
    
    //if(location.search.indexOf('hcp_id') > 0) {
    //  location.replace(`${location.pathname}`);
    //} else {
    //  loadData(undefined, data_state);
    //}
  }

  let nextRecord = async () => {
    if (props.location.query.mode === 'check') {
      console.log('check data');
      loadNextRecord('4');
    } else {
      loadNextRecord('1,3');
    }
  }

  let nextFinishedRecord = async () => {
    let r = await saveHcpState(5);
    if(r) {
      loadNextRecord('4');
    }
  }

  let unqualified = async () => {
    let r = await saveHcpState(3);
    if(r) {
      loadNextRecord('4');
    }
  }

  return (
    <PageContainer>
      <ProForm<Hcp>
        initialValues={hcpState}
        {...layout}
        form={formRef}
        onValuesChange={onFormValueChange}
        onFinish={onFormFinish}
        submitter={{
          render: (formProps, doms) => {
            return [
              <AccessChecker checker={()=>
                !(props.location.query.mode === 'check')
              }>
                <Button type="primary" key="submit" onClick={saveUpdate}>
                  提交
                </Button></AccessChecker>,
              <AccessChecker checker={()=>
                !(props.location.query.mode === 'check')
              }>
                <Button type="primary" key="submitAndNext" onClick={saveUpdateAndNext}>
                  提交并载入下一条
                </Button>
              </AccessChecker>
              ,
              <AccessChecker checker={()=>
                !(props.location.query.mode === 'check')
              }>
                <Button type="primary" key="nextRecord" onClick={nextRecord}>
                  下一条
                </Button>
              </AccessChecker>
              ,
              <AccessChecker featureCode="approve_revise">
                <Button type="primary" key="nextFinishedRecord" onClick={nextFinishedRecord}>
                合格并抽查下一条
                </Button>
              </AccessChecker>,
              <AccessChecker featureCode="reject_revise">
                <Button type="primary" danger key="submitAndNext" onClick={unqualified}>
                不合格
                </Button>
              </AccessChecker>,
              <Button key="rest" onClick={() => {
                formRef.resetFields
                loadData(hcpState.hcp.id);
              }}>
                重置
              </Button>
            ];
          },
        }}
      >
        <Row gutter={20}>
          <Col span="18">
          医生ID：{hcpState?.hcp?.id}
          <AccessChecker featureCode="goto_record">
          <Input style={{marginLeft: '20px', width: '100px'}} value={gotoHcpId} onChange={(e)=>{
            console.log(e.target.value)
            setGotoHcpId(e.target.value);
          }}/>
          <Button type={"primary"} onClick={()=>{
            loadData(gotoHcpId)
            setGotoHcpId(undefined);
          }}>
            前往
          </Button>
          <Button type={"primary"} onClick={()=> {
            history.push(`/project/${props.match.params.project_id}`)
          }} >返回项目详情</Button>
          </AccessChecker>
          </Col>
          <Col span="6">
            <div style={{textAlign: 'right'}}><h1>处理人：{hcpState?.hcp?.username}</h1></div>
          </Col>
        </Row>
        <div style={{height: '20px'}}></div>
        <Row gutter={20}>
        <Col span="16">
          <HmForm
              fields={[
                {groupName: '基本信息', fields: [
                  { label:"医生姓名",
                  fieldType:"input",
                  name:"hcp_name",
                  width: "sm",
                  rules: [{required: true, message: '医生姓名不能为空'}]
                },
                { label:"所属医院",
                  fieldType:"input",
                  name:"hospital",
                  width:"sm",
                  rules: [{required: true, message: '所属医院不能为空'}]
                },
                { label:"所属科室",
                  fieldType:"input",
                  name:"department",
                  width:"sm" 
                },
                { label:"医生职级",
                  fieldType:"input",
                  name:"professional_title",
                  width:"sm" 
                },
                { label:"行政职务",
                  fieldType:"input",
                  name:"admin_title",
                  width:"sm" 
                },
                /*{ label:"教学职称",
                  fieldType:"input",
                  name:"academic_title",
                  width:"sm" 
                },
                { label:"导师职称",
                  fieldType:"input",
                  name:"supervisor_title",
                  width:"sm" 
                },
                {
                  fieldType: "select",
                  selectOptions: professional_title_options,
                  width: "sm",
                  name: "kvp_professional_title",
                  label: "医生职级"
                },
                { label:"研究领域",
                  fieldType:"input",
                  name:"research_territory",
                  width:"sm" 
                },*/
                { label:"最高学历",
                  fieldType:"input",
                  name:"max_education_degree",
                  width:"sm" 
                },
                ]},
              ]}
              form={formRef}
          />
        <ProForm.Group title="学协会" extra={<Button type="primary" onClick={()=>{dispatch({type: actions.subObjectAdded, payload:{fieldName: 'association_list', data:{}}})}}>添加学协会</Button>}>
          <HmFormList<HcpAssociation>
            headerClassName={styles.list_header}
            contentClassName={styles.list_row}
            configProvider={{renderEmpty: emptyList}}
            fields={
              [
                {
                  fieldLabel: "名称",
                  fieldSpan: "6",
                  fieldType: "input",
                  name: "association_name"
                },
                {
                  fieldLabel: "等级",
                  fieldSpan: "4",
                  fieldType: "select",
                  selectOptions: association_level_options,
                  name: "kvp_association_level"
                },
                {
                  fieldLabel: "职位",
                  fieldSpan: "4",
                  fieldType: "select",
                  selectOptions: association_title_options,
                  name: "kvp_association_title"
                },
                {
                  fieldLabel: "时间",
                  fieldSpan: "6",
                  fieldType: "input",
                  name: "duration"
                },
                {
                  fieldLabel: "届数",
                  fieldSpan: "2",
                  fieldType: "input",
                  name: "due_times"
                },
                {
                  fieldLabel: "操作",
                  fieldSpan: "2",
                  fieldType: "input",
                  name: "",
                  fieldRender: (item: any) => {
                    return (<a key={item.fieldKey} onClick={
                      ()=>{
                        deleteSubObject({fieldName: "association_list",  index: item.name})
                      }}>删除</a>)
                  }
                },
              ]
            }
            name="association_list"
            rowGutter={listRowGutter}
            form={formRef}
          />
        </ProForm.Group>
        <ProForm.Group title="学历" extra={<Button type="primary" onClick={()=>{dispatch({type: actions.subObjectAdded, payload:{fieldName: 'education_list', data:{}}})}}>添加学历</Button>}>
          <HmFormList<HcpEducation>
            headerClassName={styles.list_header}
            contentClassName={styles.list_row}
            configProvider={{renderEmpty: emptyList}}
            fields={
              [
                {
                  fieldLabel: "学校",
                  fieldSpan: "6",
                  fieldType: "input",
                  name: "school"
                },
                {
                  fieldLabel: "专业",
                  fieldSpan: "7",
                  fieldType: "input",
                  name: "major"
                },
                {
                  fieldLabel: "学历",
                  fieldSpan: "3",
                  fieldType: "select",
                  selectOptions: education_degree_options,
                  name: "kvp_education_degree"
                },
                {
                  fieldLabel: "时间",
                  fieldSpan: "3",
                  fieldType: "input",
                  name: "duration"
                },
                {
                  fieldLabel: "海外经历",
                  fieldSpan: "3",
                  fieldType: "checkbox",
                  name: "overseas"
                },
                {
                  fieldLabel: "操作",
                  fieldSpan: "2",
                  fieldType: "input",
                  name: "",
                  fieldRender: (item: any) => {
                    return (<a key={item.fieldKey} onClick={
                      ()=>{
                        deleteSubObject({fieldName: "education_list",  index: item.name})
                      }}>删除</a>)
                  }
                },
              ]
            }
            name="education_list"
            rowGutter={listRowGutter}
            form={formRef}
          />
        </ProForm.Group>
        <ProForm.Group title="获奖" extra={<Button type="primary" onClick={()=>{dispatch({type: actions.subObjectAdded, payload:{fieldName: 'award_list', data:{}}})}}>添加获奖</Button>}>
          <HmFormList<HcpEducation>
            headerClassName={styles.list_header}
            contentClassName={styles.list_row}
            configProvider={{renderEmpty: emptyList}}
            fields={
              [
                {
                  fieldLabel: "奖项",
                  fieldSpan: "10",
                  fieldType: "input",
                  name: "award_name"
                },
                {
                  fieldLabel: "等级",
                  fieldSpan: "4",
                  fieldType: "select",
                  selectOptions: award_level_options,
                  name: "kvp_award_level"
                },
                {
                  fieldLabel: "时间",
                  fieldSpan: "4",
                  fieldType: "input",
                  name: "award_time"
                },
                {
                  fieldLabel: "操作",
                  fieldSpan: "2",
                  fieldType: "input",
                  name: "",
                  fieldRender: (item: any) => {
                    return (<a key={item.fieldKey} onClick={
                      ()=>{
                        deleteSubObject({fieldName: "award_list",  index: item.name})
                      }}>删除</a>)
                  }
                },
              ]
            }
            name="award_list"
            rowGutter={listRowGutter}
            form={formRef}
          />    
        </ProForm.Group>
        </Col>
        <Col>
        <ProForm.Group title="简介">
          <Dropdown
            onVisibleChange={(visible: boolean) => {
              if(!visible) {
                dispatch({type: actions.briefSelectionChanged, payload: null});
              }
            }}
            disabled={(()=>{ console.log(`dropdown ${hcpState.briefContextMenuDisabled}`); return hcpState.briefContextMenuDisabled })()}
            overlay={briefSelectionMenu} trigger={['contextMenu']}>
            <div style={{maxWidth: '350px', height: '550px', overflowY: 'auto', }} ref={briefRef}>
             <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}} >{hcpState?.hcp?.introduction}</pre>
            </div>
          </Dropdown> 
        </ProForm.Group>
        </Col>
        </Row>
        
        <ProFormText hidden width="md" name="professional_title" />
        <ProFormText hidden width="md" name="admin_title"  />
        <ProFormText hidden width="md" name="academic_title"  />
        <ProFormText hidden width="md" name="supervisor_title" />
      </ProForm>
    </PageContainer>
  );
};

export default DataCollationView;

/* <ProForm.Group title="头衔" extra={<Button type="primary" onClick={()=>{dispatch({type: actions.subObjectAdded, payload:{fieldName: 'honour_list', data:{}}})}}>添加头衔</Button>}>
        <HmFormList<HcpHonour>
            headerClassName={styles.list_header}
            contentClassName={styles.list_row}
            configProvider={{renderEmpty: emptyList}}
            fields={
              [
                {
                  fieldLabel: "头衔",
                  fieldSpan: "10",
                  fieldType: "select",
                  selectOptions: honour_title_options,
                  name: "kvp_honour_title"
                },
                {
                  fieldLabel: "级别",
                  fieldSpan: "6",
                  fieldType: "select",
                  selectOptions: honour_level_options,
                  name: "kvp_honour_level"
                },
                {
                  fieldLabel: "操作",
                  fieldSpan: "4",
                  fieldType: "input",
                  name: "",
                  fieldRender: (item: any) => {
                    return (<a key={item.fieldKey} onClick={
                      ()=>{
                        deleteSubObject({fieldName: "honour_list",  index: item.name})
                      }}>删除</a>)
                  }
                },
              ]
            }
            name="honour_list"
            rowGutter={listRowGutter}
            form={formRef}
          />    
        </ProForm.Group> */
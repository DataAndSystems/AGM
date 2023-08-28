// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {getLocalUserInfo} from '@/services/hmdp/user';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {

  console.log('get user info');
  return getLocalUserInfo();
  /*
  return request<API.CurrentUser>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
  */
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

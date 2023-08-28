import React, { ReactNode } from 'react';
import { Form, ConfigProvider, List, Row, Col, Input, FormInstance } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { FormListFieldData } from 'antd/lib/form/FormList';
import { ProFormSelect, ProFormCheckbox } from '@ant-design/pro-form';
import { SelectOption } from '../types/Types';

export interface HmFormListFieldProps<T> {
  fieldLabel: string
  fieldSpan?: string
  fieldType?: string
  name: string
  fieldRender?: (item: FormListFieldData) => ReactNode
  selectOptions?: SelectOption[]
}

export interface HmFormListProps<T> {
  headerClassName: string
  contentClassName: string
  configProvider: ConfigProviderProps
  dataSource?: T[]
  headerRender?: (item: HmFormListFieldProps<T>[]) => ReactNode
  fields: HmFormListFieldProps<T>[]
  name: string
  rowGutter: object
  form: FormInstance
}


export const HmFormList = function formlist<T> (props: HmFormListProps<T>) {

    let getFieldContent = (fieldData: FormListFieldData, fieldProps: HmFormListFieldProps<T>): ReactNode => {
      
      if(fieldProps.fieldRender) {
        return fieldProps.fieldRender(fieldData);
      }
      switch(fieldProps.fieldType) {
        case "input":
          return (
            <Form.Item
              {...fieldData}
              name={[fieldData.name, fieldProps.name]}
              fieldKey={[fieldData.fieldKey, fieldProps.name]}
            >
              <Input/>
            </Form.Item>
          )
        case "select":
          return (
            <ProFormSelect
              {...fieldData}
                options={fieldProps.selectOptions}
                name={[fieldData.name, fieldProps.name]}
                fieldKey={[fieldData.fieldKey, fieldProps.name]}
            />
          )
        case "checkbox":
          return (
            <ProFormCheckbox
              {...fieldData}
                name={[fieldData.name, fieldProps.name]}
                fieldKey={[fieldData.fieldKey, fieldProps.name]}
            />
          )
        default:
          return props.form.getFieldValue([fieldData.name, fieldProps.name]);
      }

    }

    return  (
      <Form.Item>
        <ConfigProvider {...props.configProvider}>
          <List
            header={props.headerRender ? props.headerRender(props.fields) : (
            <div className={props.headerClassName}>
              <Row gutter={props.rowGutter}>
                {
                  props.fields.map((fieldProps: HmFormListFieldProps<T>) => {
                    return (<Col key={fieldProps.name} span={fieldProps.fieldSpan}>{fieldProps.fieldLabel}</Col>)
                  })
                }
              </Row>
            </div>)}
            dataSource={props.dataSource}
          >
            <Form.List name={props.name}>
              {(fieldDatas, {add, remove}) => {
                return (
                  fieldDatas.map((fieldData, index) => (
                    <List.Item key={fieldData.fieldKey}>
                      <div key={fieldData.fieldKey} className={props.contentClassName}>
                        <Row key={fieldData.fieldKey} gutter={props.rowGutter}>
                          {
                            props.fields.map((fieldProps: HmFormListFieldProps<T>) => {
                              return (<Col key={`${fieldData.fieldKey}-${fieldProps.name}`} span={fieldProps.fieldSpan}>
                                {getFieldContent(fieldData, fieldProps)}
                              </Col>)
                            })
                          }
                        </Row>
                      </div>
                    </List.Item>
                    )
                  )
                )
              }}
            </Form.List>
          </List>
        </ConfigProvider>
      </Form.Item>
    );
}

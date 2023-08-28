import React, { useState, useEffect, ReactNode } from 'react';
import { Form, ConfigProvider, List, Row, Col, Input, FormInstance } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { FormListFieldData } from 'antd/lib/form/FormList';
import ProForm, { ProFormSelect, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';

export type SelectOption = {value: string, label?: string};

export interface HmFormFieldProps {
  label?: string
  fieldType?: string
  width?: number | "sm" | "md" | "xl" | "xs" | "lg" | undefined;
  name?: string
  fieldRender?: (item: FormListFieldData) => ReactNode
  selectOptions?: SelectOption[]
  groupName?: string
  fields?: HmFormFieldProps[]
  rules?: any[]
}

export interface HmFormProps<T> {
  fields: HmFormFieldProps[]
  name?: string
  form: FormInstance
}

export const HmForm = function form<T> (props: HmFormProps<T>) {

  let renderFields = (fieldProps: HmFormFieldProps) => {
    return fieldProps.fields!.map((childFieldProps: HmFormFieldProps) => {
        return getFieldContent(childFieldProps)
    })
  }

  let getFieldContent = (fieldProps: HmFormFieldProps): ReactNode => {
        
    //console.log(fieldProps)
    if(fieldProps.groupName) {
      return (
        <ProForm.Group title={fieldProps.groupName}>
          {renderFields(fieldProps)}
        </ProForm.Group>
      )
    }

    switch(fieldProps.fieldType) {
      case "input":
        return (
          <ProFormText
            {...fieldProps}
            fieldKey={fieldProps.name}
          />
        )
      case "select":
        return (
          <ProFormSelect
            {...fieldProps}
            fieldKey={fieldProps.name}
            options={fieldProps.selectOptions}
          />
        )
      case "checkbox":
        return (
          <ProFormCheckbox
            {...fieldProps}
            fieldKey={fieldProps.name}
          />
        )
      default:
        return props.form.getFieldValue([fieldProps.name!]);
      }
    }

    return renderFields(props);
}

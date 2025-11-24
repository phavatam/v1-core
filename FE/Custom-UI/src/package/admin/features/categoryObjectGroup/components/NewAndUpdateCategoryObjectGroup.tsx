import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, Radio, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryObjectGroupDTO } from "@models/categoryObjectGroupDTO";
import {
  useGetCategoryObjectGroupByIdQuery,
  useInsertCategoryObjectGroupMutation,
  useUpdateCategoryObjectGroupMutation
} from "@API/services/CategoryObjectGroupApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryObjectGroup(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryObjectGroup, isLoading: LoadingCategoryObjectGroup } = useGetCategoryObjectGroupByIdQuery(
    { idCategoryObjectGroup: id! },
    { skip: !id }
  );
  const [newCategoryObjectGroup, { isLoading: LoadingInsertCategoryNationaly }] =
    useInsertCategoryObjectGroupMutation();
  const [updateCategoryObjectGroup, { isLoading: LoadingUpdateCategoryNationaly }] =
    useUpdateCategoryObjectGroupMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryObjectGroup?.payload && id) {
      formRef.setFieldsValue(CategoryObjectGroup?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryObjectGroup, formRef, id]);
  const onfinish = async (values: CategoryObjectGroupDTO) => {
    try {
      const result = id
        ? await updateCategoryObjectGroup({
            CategoryObjectGroup: values
          }).unwrap()
        : await newCategoryObjectGroup({ CategoryObjectGroup: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryObjectGroup">
      <Spin spinning={LoadingCategoryObjectGroup}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên nhóm đối tượng: " name={"nameObjectGroup"}>
                <Input ref={(input) => input && input.focus()} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={"isHide"} label="Trạng thái" initialValue={true}>
                <Radio.Group optionType="button">
                  <Radio value={true}>Bật</Radio>
                  <Radio value={false}>Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "flex-end"
                  }}
                >
                  <Button
                    type="default"
                    htmlType="reset"
                    loading={LoadingInsertCategoryNationaly || LoadingUpdateCategoryNationaly}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingInsertCategoryNationaly || LoadingUpdateCategoryNationaly}
                    icon={<CheckCircleOutlined />}
                    style={{
                      float: "right"
                    }}
                  >
                    Lưu
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </div>
  );
}

export const NewAndUpdateCategoryObjectGroup = WithErrorBoundaryCustom(_NewAndUpdateCategoryObjectGroup);

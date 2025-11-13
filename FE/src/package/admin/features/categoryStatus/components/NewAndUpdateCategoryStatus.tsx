import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, Radio, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryStatusDTO } from "@models/categoryStatusDTO";
import {
  useGetCategoryStatusByIdQuery,
  useInsertCategoryStatusMutation,
  useUpdateCategoryStatusMutation
} from "@API/services/CategoryStatusApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryStatus(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryStatus, isLoading: LoadingCategoryStatus } = useGetCategoryStatusByIdQuery(
    { idCategoryStatus: id! },
    { skip: !id }
  );
  const [newCategoryStatus, { isLoading: LoadingInsertCategoryNationaly }] = useInsertCategoryStatusMutation();
  const [updateCategoryStatus, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateCategoryStatusMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryStatus?.payload && id) {
      formRef.setFieldsValue(CategoryStatus?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryStatus, formRef, id]);
  const onfinish = async (values: CategoryStatusDTO) => {
    try {
      const result = id
        ? await updateCategoryStatus({
            CategoryStatus: values
          }).unwrap()
        : await newCategoryStatus({ CategoryStatus: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryStatus">
      <Spin spinning={LoadingCategoryStatus}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên loại trạng thái: " name={"statusName"}>
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

export const NewAndUpdateCategoryStatus = WithErrorBoundaryCustom(_NewAndUpdateCategoryStatus);

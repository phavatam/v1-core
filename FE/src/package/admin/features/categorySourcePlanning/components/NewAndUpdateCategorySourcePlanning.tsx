import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, Radio, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategorySourcePlanningDTO } from "@models/categorySourcePlanningDTO";
import {
  useGetCategorySourcePlanningByIdQuery,
  useInsertCategorySourcePlanningMutation,
  useUpdateCategorySourcePlanningMutation
} from "@API/services/CategorySourcePlanningApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategorySourcePlanning(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategorySourcePlanning, isLoading: LoadingCategorySourcePlanning } =
    useGetCategorySourcePlanningByIdQuery({ idCategorySourcePlanning: id! }, { skip: !id });
  const [newCategorySourcePlanning, { isLoading: LoadingInsertCategoryNationaly }] =
    useInsertCategorySourcePlanningMutation();
  const [updateCategorySourcePlanning, { isLoading: LoadingUpdateCategoryNationaly }] =
    useUpdateCategorySourcePlanningMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategorySourcePlanning?.payload && id) {
      formRef.setFieldsValue(CategorySourcePlanning?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategorySourcePlanning, formRef, id]);
  const onfinish = async (values: CategorySourcePlanningDTO) => {
    try {
      const result = id
        ? await updateCategorySourcePlanning({
            CategorySourcePlanning: values
          }).unwrap()
        : await newCategorySourcePlanning({ CategorySourcePlanning: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateAllowance">
      <Spin spinning={LoadingCategorySourcePlanning}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên nguồn kế hoạch: " name={"sourcePlanningName"}>
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

export const NewAndUpdateCategorySourcePlanning = WithErrorBoundaryCustom(_NewAndUpdateCategorySourcePlanning);

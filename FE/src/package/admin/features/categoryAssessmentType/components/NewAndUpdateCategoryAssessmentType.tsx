import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Radio, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryAssessmentTypeDTO } from "@models/categoryAssessmentTypeDTO";
import {
  useGetCategoryAssessmentTypeByIdQuery,
  useInsertCategoryAssessmentTypeMutation,
  useUpdateCategoryAssessmentTypeMutation
} from "@API/services/CategoryAssessmentTypeApis.service";
import TextArea from "antd/es/input/TextArea";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryAssessmentType(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryAssessmentType, isLoading: LoadingCategoryAssessmentType } =
    useGetCategoryAssessmentTypeByIdQuery({ idCategoryAssessmentType: id! }, { skip: !id });
  const [newCategoryAssessmentType, { isLoading: LoadingInsertCategoryNationaly }] =
    useInsertCategoryAssessmentTypeMutation();
  const [updateCategoryAssessmentType, { isLoading: LoadingUpdateCategoryNationaly }] =
    useUpdateCategoryAssessmentTypeMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryAssessmentType?.payload && id) {
      formRef.setFieldsValue(CategoryAssessmentType?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryAssessmentType, formRef, id]);
  const onfinish = async (values: CategoryAssessmentTypeDTO) => {
    try {
      const result = id
        ? await updateCategoryAssessmentType({
            CategoryAssessmentType: values
          }).unwrap()
        : await newCategoryAssessmentType({ CategoryAssessmentType: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryAssessmentType">
      <Spin spinning={LoadingCategoryAssessmentType}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden={true} />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên ưu hoặc nhược điểm đánh giá: " name={"nameAssessmentType"}>
                <TextArea rows={4} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={"status"} label="Ưu điểm hay nhược điểm" initialValue={1}>
                <Radio.Group optionType="button">
                  <Radio value={1}>Ưu điểm</Radio>
                  <Radio value={2}>Nhược điểm</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
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

export const NewAndUpdateCategoryAssessmentType = WithErrorBoundaryCustom(_NewAndUpdateCategoryAssessmentType);

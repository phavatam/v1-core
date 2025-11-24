import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, InputNumber, Radio, Row, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryReviewDTO } from "@models/categoryReviewDTO";
import {
  useGetCategoryReviewByIdQuery,
  useInsertCategoryReviewMutation,
  useUpdateCategoryReviewMutation
} from "@API/services/CategoryReviewApis.service";
import TextArea from "antd/es/input/TextArea";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewCategoryReview(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryReview, isLoading: LoadingCategoryReview } = useGetCategoryReviewByIdQuery(
    { idCategoryReview: id! },
    { skip: !id }
  );
  const [newCategoryReview, { isLoading: LoadingInsertCategoryNationaly }] = useInsertCategoryReviewMutation();
  const [updateCategoryReview, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateCategoryReviewMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryReview?.payload && id) {
      formRef.setFieldsValue(CategoryReview?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryReview, formRef, id]);
  const onfinish = async (values: CategoryReviewDTO) => {
    try {
      const result = id
        ? await updateCategoryReview({
            CategoryReview: values
          }).unwrap()
        : await newCategoryReview({ CategoryReview: values }).unwrap();
      if (result.success) {
        //setVisible(false);
        //formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryAssessmentType">
      <Spin spinning={LoadingCategoryReview}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden={true} />
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tiêu đề nhận xét đánh giá: " name={"title"}>
                <TextArea rows={2} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Tên nhận xét đánh giá: " name={"nameReview"}>
                <TextArea rows={8} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Số thứ tự: "
                name={"sort"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Số thứ tự"
                  },
                  {
                    pattern: /^[0-9]+$/,
                    message: "Giá trị phải là số nguyên dương"
                  },
                  {
                    validator: (_, value) =>
                      value && value.toString().length > 10
                        ? Promise.reject("Giá trị không được vượt quá 10 số")
                        : Promise.resolve()
                  }
                ]}
                initialValue={0}
              >
                <InputNumber
                  style={{
                    width: "100%"
                  }}
                  formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
                  parser={(value) => parseInt(value!.replace(/[^\d]/g, ""), 10) || 0} // Parse and ensure integer
                />
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

export const NewCategoryReview = WithErrorBoundaryCustom(_NewCategoryReview);

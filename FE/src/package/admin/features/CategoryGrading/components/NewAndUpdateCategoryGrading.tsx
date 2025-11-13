import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, InputNumber, Row, Space, Spin, Switch } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryGradingDTO } from "@models/CategoryGradingDTO";
import {
  useGetCategoryGradingByIdQuery,
  useInsertCategoryGradingMutation,
  useUpdateCategoryGradingMutation
} from "@API/services/CategoryGrading.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryGrading(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryGrading, isLoading: LoadingCategoryGrading } = useGetCategoryGradingByIdQuery(
    { idCategoryGrading: id! },
    { skip: !id }
  );
  const [newCategoryGrading, { isLoading: LoadingInsertCategoryNationaly }] = useInsertCategoryGradingMutation();
  const [updateCategoryGrading, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateCategoryGradingMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryGrading?.payload && id) {
      formRef.setFieldsValue(CategoryGrading?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryGrading, formRef, id]);
  const onfinish = async (values: CategoryGradingDTO) => {
    try {
      debugger;
      const result = id
        ? await updateCategoryGrading({
            CategoryGrading: values
          }).unwrap()
        : await newCategoryGrading({ CategoryGrading: values }).unwrap();
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
      <Spin spinning={LoadingCategoryGrading}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form layout={"horizontal"} labelCol={{ span: 8 }} form={formRef} onFinish={onfinish}>
              <Form.Item name={"id"} hidden />
              <Form.Item name={"status"} hidden />
              <Form.Item name={"createdDate"} hidden />
              <Form.Item label="Tên loại xếp loại đánh giá" name={"nameGrading"}>
                <Input />
              </Form.Item>
              <Form.Item label="Từ điểm" name={"fromValue"}>
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/[^0-9]/g, "")}
                />
              </Form.Item>
              <Form.Item label="Đến điểm" name={"toValue"}>
                <InputNumber
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value!.replace(/[^0-9]/g, "")}
                />
              </Form.Item>
              <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
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
            </Form>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export const NewAndUpdateCategoryGrading = WithErrorBoundaryCustom(_NewAndUpdateCategoryGrading);

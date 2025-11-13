import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, Radio, Row, Space, Spin } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryJobStatusDTO } from "@models/categoryJobStatusDTO";
import {
  useGetCategoryJobStatusByIdQuery,
  useInsertCategoryJobStatusMutation,
  useUpdateCategoryJobStatusMutation
} from "@API/services/CategoryJobStatusApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryJobStatus(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryJobStatus, isLoading: LoadingCategoryJobStatus } = useGetCategoryJobStatusByIdQuery(
    { idCategoryJobStatus: id! },
    { skip: !id }
  );
  const [newCategoryJobStatus, { isLoading: LoadingInsertCategoryNationaly }] = useInsertCategoryJobStatusMutation();
  const [updateCategoryJobStatus, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateCategoryJobStatusMutation();
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryJobStatus?.payload && id) {
      formRef.setFieldsValue(CategoryJobStatus?.payload);
    } else {
      formRef.resetFields();
    }
  }, [CategoryJobStatus, formRef, id]);
  const onfinish = async (values: CategoryJobStatusDTO) => {
    try {
      const result = id
        ? await updateCategoryJobStatus({
            CategoryJobStatus: values
          }).unwrap()
        : await newCategoryJobStatus({ CategoryJobStatus: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryJobStatus">
      <Spin spinning={LoadingCategoryJobStatus}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tên trạng thái công việc: " name={"jobStatusName"}>
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

export const NewAndUpdateCategoryJobStatus = WithErrorBoundaryCustom(_NewAndUpdateCategoryJobStatus);

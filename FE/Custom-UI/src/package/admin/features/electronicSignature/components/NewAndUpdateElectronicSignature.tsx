import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Row, Select, Space, Spin } from "antd";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { ElectronicSignatureDTO } from "@models/electronicSignatureDTO";
import {
  useGetElectronicSignatureByIdQuery,
  useInsertElectronicSignatureMutation,
  useUpdateElectronicSignatureMutation
} from "@API/services/ElectronicSignatureApis.service";
import { useGetListUserParentAndChildrenQuery } from "@API/services/UserApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateElectronicSignature(props: IProps) {
  const { setVisible, id } = props;
  const { data: ElectronicSignature, isLoading: LoadingElectronicSignature } = useGetElectronicSignatureByIdQuery(
    { idElectronicSignature: id! },
    { skip: !id }
  );
  const [newElectronicSignature, { isLoading: LoadingInsertCategoryNationaly }] =
    useInsertElectronicSignatureMutation();
  const [updateElectronicSignature, { isLoading: LoadingUpdateCategoryNationaly }] =
    useUpdateElectronicSignatureMutation();
  const [formRef] = Form.useForm();

  const { data: ListUserParentAndChildren, isLoading: LoadingListUserParentAndChildren } =
    useGetListUserParentAndChildrenQuery({
      pageSize: 0,
      pageNumber: 0
    });

  useEffect(() => {
    if (ElectronicSignature?.payload && id) {
      formRef.setFieldsValue(ElectronicSignature?.payload);
    } else {
      formRef.resetFields();
    }
  }, [ElectronicSignature, formRef, id]);
  const onfinish = async (values: ElectronicSignatureDTO) => {
    try {
      const result = id
        ? await updateElectronicSignature({
            ElectronicSignature: values
          }).unwrap()
        : await newElectronicSignature({ ElectronicSignature: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateElectronicSignature">
      <Spin spinning={LoadingElectronicSignature}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Người dùng: " name={"idUser"}>
                <Select
                  allowClear
                  showSearch
                  loading={LoadingListUserParentAndChildren}
                  optionFilterProp={"label"}
                  options={ListUserParentAndChildren?.listPayload?.map((item) => ({
                    label: item.fullname + " - " + item.email + " - " + item.userCode,
                    value: item.id
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Trạng thái" name={"status"} initialValue={0}>
                <Select allowClear showSearch loading={LoadingListUserParentAndChildren} optionFilterProp={"label"}>
                  <Select.Option value={0}>Hoạt động (Active)</Select.Option>
                  <Select.Option value={1}>Tạm ngưng (Suspended)</Select.Option>
                  <Select.Option value={2}>Thu hồi (Revoked)</Select.Option>
                  <Select.Option value={3}>Hết hạn (Expired)</Select.Option>
                </Select>
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

export const NewAndUpdateElectronicSignature = WithErrorBoundaryCustom(_NewAndUpdateElectronicSignature);

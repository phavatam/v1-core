import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, InputNumber, Row, Space, Spin, TreeSelect } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { TypeAssessmentDTO } from "@models/typeAssessmentDTO";
import {
  useGetTypeAssessmentByIdQuery,
  useInsertTypeAssessmentMutation,
  useUpdateTypeAssessmentMutation
} from "@API/services/TypeAssessmentApis.service";
import dayjs from "dayjs";
import { arrayToTree, renderTree } from "@admin/features/unit";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateTypeAssessment(props: IProps) {
  const { setVisible, id } = props;
  const { data: TypeAssessment, isLoading: LoadingTypeAssessment } = useGetTypeAssessmentByIdQuery(
    { idTypeAssessment: id! },
    { skip: !id }
  );
  const [newTypeAssessment, { isLoading: LoadingInsertTypeAssessment }] = useInsertTypeAssessmentMutation();
  const [updateTypeAssessment, { isLoading: LoadingUpdateTypeAssessment }] = useUpdateTypeAssessmentMutation();
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  const arrayToTreeSelect = arrayToTree(ListUnit?.listPayload ?? []);

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (TypeAssessment?.payload && id) {
      formRef.setFieldsValue({
        ...TypeAssessment?.payload,
        createdDate: TypeAssessment?.payload.createdDate ? dayjs(TypeAssessment?.payload.createdDate) : null
      });
    } else {
      formRef.resetFields();
    }
  }, [TypeAssessment, formRef, id]);
  const onfinish = async (values: TypeAssessmentDTO) => {
    try {
      const result = id
        ? await updateTypeAssessment({
            TypeAssessment: values
          }).unwrap()
        : await newTypeAssessment({ TypeAssessment: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateTypeAssessment">
      <Spin spinning={LoadingTypeAssessment}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên thang điểm đánh giá: "
                name={"nameTypeAssessment"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Tên loại thời gian"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={"idUnit"} label="Chọn đơn vị">
                <TreeSelect
                  placeholder={"Chọn đơn vị"}
                  loading={LoadingListUnit}
                  showSearch
                  treeNodeFilterProp={"title"}
                  maxTagCount={"responsive"}
                  treeLine={true}
                  treeData={renderTree(arrayToTreeSelect)}
                  style={{ height: 40 }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={"startValue"}
                label="Số điểm tối thiểu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Số điểm tối thiểu"
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
              >
                <InputNumber
                  placeholder="0"
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
                  parser={(value) => parseInt(value!.replace(/[^\d]/g, ""), 10) || 0} // Parse and ensure integer
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={"endValue"}
                label="Số điểm tối đa"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Số điểm tối đa"
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
              >
                <InputNumber
                  placeholder="100"
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
                  parser={(value) => parseInt(value!.replace(/[^\d]/g, ""), 10) || 0}
                />
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
                    loading={LoadingInsertTypeAssessment || LoadingUpdateTypeAssessment}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingInsertTypeAssessment || LoadingUpdateTypeAssessment}
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

export const NewAndUpdateTypeAssessment = WithErrorBoundaryCustom(_NewAndUpdateTypeAssessment);

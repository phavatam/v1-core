import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  useGetListUnitAvailableQuery,
  useGetUnitByIdQuery,
  useInsertListUnitMutation,
  useUpdateUnitMutation
} from "@API/services/UnitApis.service";
import { Button, Col, Form, Row, Space, Spin, TreeSelect } from "antd";
import { HandleError } from "@admin/components";
import { UnitDTO } from "@models/unitDto";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { arrayToTree, renderTree } from "@admin/features/unit";
import TextArea from "antd/es/input/TextArea";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateUnit(props: IProps) {
  const { setVisible, id } = props;
  const { data: Unit, isLoading: LoadingUnit } = useGetUnitByIdQuery(
    { id: id! },
    {
      skip: !id
    }
  );
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  const [newUnit, { isLoading: LoadingInsertUnit }] = useInsertListUnitMutation();
  const [updateUnit, { isLoading: LoadingUpdateUnit }] = useUpdateUnitMutation();
  const [formRef] = Form.useForm();
  const arrayToTreeSelect = arrayToTree(ListUnit?.listPayload ?? []);

  useEffect(() => {
    if (Unit?.payload && id) {
      formRef.setFieldsValue(Unit?.payload);
    } else {
      formRef.resetFields();
    }
  }, [Unit, formRef, id]);
  const onfinish = async (values: UnitDTO) => {
    try {
      const result = id
        ? await updateUnit({
            unit: values
          }).unwrap()
        : await newUnit({ unit: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateUnit">
      <Spin spinning={LoadingUnit}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form layout={"vertical"} form={formRef} onFinish={onfinish}>
              <Form.Item name={"id"} hidden />
              <Form.Item
                label="Tên phòng ban (Mỗi dòng là 1 dữ liệu)"
                name={"unitName"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phòng ban"
                  }
                ]}
              >
                <TextArea rows={10} placeholder={"Đơn vị 1\nĐơn vị 2\nĐơn vị 3\nĐơn vị 4\n...."} />
              </Form.Item>

              <Form.Item
                name={"parentId"}
                label="Chọn phòng ban cha"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng ban cha"
                  }
                ]}
              >
                <TreeSelect
                  placeholder={"Chọn phòng ban cha"}
                  loading={LoadingListUnit}
                  showSearch
                  treeNodeFilterProp={"title"}
                  maxTagCount={"responsive"}
                  treeLine={true}
                  treeData={renderTree(arrayToTreeSelect)}
                  style={{ height: 40 }}
                />
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
                    loading={LoadingInsertUnit || LoadingUpdateUnit}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingInsertUnit || LoadingUpdateUnit}
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

export const NewAndUpdateUnit = WithErrorBoundaryCustom(_NewAndUpdateUnit);

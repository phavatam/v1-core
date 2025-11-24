import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, DatePicker, Form, Input, Radio, Row, Select, Space, Spin, TreeSelect } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryTimeTypeDTO } from "@models/categoryTimeTypeDTO";
import {
  useGetCategoryTimeTypeByIdQuery,
  useInsertCategoryTimeTypeMutation,
  useUpdateCategoryTimeTypeMutation
} from "@API/services/CategoryTimeTypeApis.service";
import dayjs from "dayjs";
import { arrayToTree, renderTree } from "@admin/features/unit";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryTimeType(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryTimeType, isLoading: LoadingCategoryTimeType } = useGetCategoryTimeTypeByIdQuery(
    { idCategoryTimeType: id! },
    { skip: !id }
  );
  const [newCategoryTimeType, { isLoading: LoadingInsertCategoryNationaly }] = useInsertCategoryTimeTypeMutation();
  const [updateCategoryTimeType, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateCategoryTimeTypeMutation();
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  const arrayToTreeSelect = arrayToTree(ListUnit?.listPayload ?? []);

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (CategoryTimeType?.payload && id) {
      formRef.setFieldsValue({
        ...CategoryTimeType?.payload,
        createdDate: CategoryTimeType?.payload.createdDate ? dayjs(CategoryTimeType?.payload.createdDate) : null,
        fromDate: CategoryTimeType?.payload.fromDate ? dayjs(CategoryTimeType?.payload.fromDate) : null,
        toDate: CategoryTimeType?.payload.toDate ? dayjs(CategoryTimeType?.payload.toDate) : null
      });
    } else {
      formRef.resetFields();
    }
  }, [CategoryTimeType, formRef, id]);
  const onfinish = async (values: CategoryTimeTypeDTO) => {
    try {
      const result = id
        ? await updateCategoryTimeType({
            CategoryTimeType: values
          }).unwrap()
        : await newCategoryTimeType({ CategoryTimeType: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryTimeType">
      <Spin spinning={LoadingCategoryTimeType}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên kỳ đánh giá: "
                name={"timeTypeName"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên kỳ đánh giá"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={"fromDate"}
                label="Ngày bắt đầu đánh giá"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày bắt đầu đánh giá"
                  }
                ]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="00/00/0000" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name={"toDate"}
                label="Ngày kết thúc đánh giá"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày kết thúc đánh giá"
                  }
                ]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="00/00/0000" style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={"period"} label="Loại giai đoạn đánh giá">
                <Select allowClear showSearch placeholder={"Chọn loại giai đoạn đánh giá"}>
                  <Select.Option value={0}>Đánh giá theo Tháng</Select.Option>
                  <Select.Option value={1}>Đánh giá theo Quý</Select.Option>
                  <Select.Option value={2}>Đánh giá theo Năm</Select.Option>
                </Select>
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
              <Form.Item name={"isHide"} label="Trạng thái Ẩn/Hiện" initialValue={true}>
                <Radio.Group optionType="button">
                  <Radio value={true}>Bật</Radio>
                  <Radio value={false}>Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            {/*<Col span={12}>
              <Form.Item name={"isRepeat"} label="Trạng thái lặp lại" initialValue={false}>
                <Radio.Group optionType="button">
                  <Radio value={true}>Bật</Radio>
                  <Radio value={false}>Tắt</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>*/}

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

export const NewAndUpdateCategoryTimeType = WithErrorBoundaryCustom(_NewAndUpdateCategoryTimeType);

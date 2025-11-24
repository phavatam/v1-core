import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, InputNumber, Radio, Row, Select, Space, Spin, Tag, TreeSelect } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";
import {
  useGetCategoryCriteriaByIdQuery,
  useGetListCategoryCriteriaAvailableQuery,
  useInsertCategoryCriteriaMutation,
  useUpdateCategoryCriteriaMutation
} from "@API/services/CategoryCriteriaApis.service";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import { useGetListTypeAssessmentQuery } from "@API/services/TypeAssessmentApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
import { arrayToTree, renderTree } from "@admin/features/unit";

export const renderTreeNodesCriteria = (nodes: CategoryCriteriaDTO[]): any => {
  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      return {
        title: <Tag> {node.nameCriteria}</Tag>,
        value: node.id,
        key: node.id,
        children: renderTreeNodesCriteria(node.children)
      };
    }
    return {
      title: <Tag> {node.nameCriteria}</Tag>,
      value: node.id,
      key: node.id
    };
  });
};

export function arrayToTreeCriteria(menuItems: CategoryCriteriaDTO[]) {
  const map = new Map();

  // First, create a map with the Id as the key
  for (const item of menuItems) {
    map.set(item.id, { ...item, children: [] });
  }

  // Then, iterate through the items to build the tree
  const menuTree = [];
  for (const item of menuItems) {
    const menuItem = map.get(item.id);
    if (menuItem) {
      if (item.idParent === null) {
        // Top-level item
        menuTree.push(menuItem);
      } else {
        // Child item
        const parentItem = map.get(item.idParent);
        if (parentItem) {
          parentItem.children.push(menuItem);
        }
      }
    }
  }
  return menuTree;
}

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewAndUpdateCategoryCriteria(props: IProps) {
  const { setVisible, id } = props;
  const { data: CategoryCriteria, isLoading: LoadingCategoryCriteria } = useGetCategoryCriteriaByIdQuery(
    { idCategoryCriteria: id! },
    { skip: !id }
  );
  const [newCategoryCriteria, { isLoading: LoadingInsertCategoryCriteria }] = useInsertCategoryCriteriaMutation();
  const [updateCategoryCriteria, { isLoading: LoadingUpdateCategoryCriteria }] = useUpdateCategoryCriteriaMutation();
  const {
    data: ListCategoryCriteria,
    isLoading: LoadingListCategoryCriteria,
    refetch
  } = useGetListCategoryCriteriaAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListTypeAssessment, isLoading: LoadingListTypeAssessment } = useGetListTypeAssessmentQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const arrayTreeCategoryCriteria = arrayToTreeCriteria(ListCategoryCriteria?.listPayload ?? []);

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  const arrayToTreeSelect = arrayToTree(ListUnit?.listPayload ?? []);

  const [formRef] = Form.useForm();

  useEffect(() => {
    refetch();
    if (CategoryCriteria?.payload && id) {
      formRef.setFieldsValue({
        ...CategoryCriteria?.payload,
        createdDate: CategoryCriteria?.payload.createdDate ? dayjs(CategoryCriteria?.payload.createdDate) : null
      });
    } else {
      formRef.resetFields();
    }
  }, [CategoryCriteria, formRef, id]);
  const onfinish = async (values: CategoryCriteriaDTO) => {
    try {
      const result = id
        ? await updateCategoryCriteria({
            CategoryCriteria: values
          }).unwrap()
        : await newCategoryCriteria({ CategoryCriteria: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateCategoryCriteria">
      <Spin spinning={LoadingCategoryCriteria}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên tiêu chí: "
                name={"nameCriteria"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Tên tiêu chí"
                  }
                ]}
              >
                <TextArea autoSize={{ minRows: 5, maxRows: 10 }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={"idParent"} label="Tiêu chí cha">
                <TreeSelect
                  placeholder={"Chọn tiêu chí cha"}
                  loading={LoadingListCategoryCriteria}
                  showSearch
                  allowClear
                  treeNodeFilterProp={"title"}
                  maxTagCount={"responsive"}
                  treeLine={true}
                  treeData={renderTreeNodesCriteria(arrayTreeCategoryCriteria)}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name={"idTypeAssessment"} label="Chọn thang điểm đánh giá">
                <Select
                  allowClear
                  showSearch
                  loading={LoadingListTypeAssessment}
                  placeholder={"Chọn thang điểm đánh giá"}
                  options={ListTypeAssessment?.listPayload?.map((item) => ({
                    value: item.id,
                    label: item.nameTypeAssessment
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
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
            <Col span={24}>
              <Form.Item
                name={"idUnit"}
                label="Chọn đơn vị"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đơn vị"
                  }
                ]}
              >
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
              <Form.Item name={"isDistinct"} label="Chỉ tính điểm 1 tiêu chí con" initialValue={true}>
                <Radio.Group optionType="button">
                  <Radio value={true}>Bật</Radio>
                  <Radio value={false}>Tắt</Radio>
                </Radio.Group>
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
                    loading={LoadingInsertCategoryCriteria || LoadingUpdateCategoryCriteria}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingInsertCategoryCriteria || LoadingUpdateCategoryCriteria}
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

export const NewAndUpdateCategoryCriteria = WithErrorBoundaryCustom(_NewAndUpdateCategoryCriteria);

import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Form, Input, Row, Space, Spin, TreeSelect, Switch, Select } from "antd";
import { useEffect } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import {
  useGetEvaluationsByIdQuery,
  useInsertListEvaluationsMutation,
  useUpdateEvaluationsMutation,
  useGetListEvaluationsQuery
} from "@API/services/EvaluationsApis.service";
import dayjs from "dayjs";
import { arrayToTree, renderTree } from "@admin/features/unit";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _NewEvaluations(props: IProps) {
  const { setVisible, id } = props;
  const { data: Evaluations, isLoading: LoadingEvaluations } = useGetEvaluationsByIdQuery(
    { idEvaluations: id! },
    { skip: !id }
  );
  const [newListEvaluations, { isLoading: LoadingInsertListEvaluations }] = useInsertListEvaluationsMutation();
  const { data: ListEvaluations, isLoading: LoadingListEvaluations } = useGetListEvaluationsQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const [updateEvaluations, { isLoading: LoadingUpdateCategoryNationaly }] = useUpdateEvaluationsMutation();
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });
  //console.log("ListEvaluations", ListEvaluations);
  const arrayToTreeSelect = arrayToTree(ListUnit?.listPayload ?? []);

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (Evaluations?.payload && id) {
      formRef.setFieldsValue({
        ...Evaluations?.payload,
        createdDate: Evaluations?.payload.createdDate ? dayjs(Evaluations?.payload.createdDate) : null
      });
    } else {
      formRef.resetFields();
    }
  }, [Evaluations, formRef, id]);
  const onfinish = async (values: EvaluationsDTO) => {
    try {
      const result = id
        ? await updateEvaluations({
            Evaluations: values
          }).unwrap()
        : await newListEvaluations({ EvaluationsList: values }).unwrap();
      if (result.success) {
        setVisible(false);
        formRef.resetFields();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  return (
    <div className="NewAndUpdateEvaluations">
      <Spin spinning={LoadingEvaluations}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"id"} hidden />
          <Form.Item name={"status"} hidden />

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Tên phiếu đánh giá: "
                name={"nameEvaluations"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Tên phiếu đánh giá"
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name={"listIdsUnit"}
                label="Chọn các đơn vị cần áp dụng (có thể chọn nhiều)"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Chọn đơn vị cần áp dụng"
                  }
                ]}
              >
                <TreeSelect
                  placeholder={"Chọn các đơn vị áp dụng"}
                  loading={LoadingListUnit}
                  showSearch
                  treeNodeFilterProp={"title"}
                  treeLine={true}
                  treeData={renderTree(arrayToTreeSelect)}
                  multiple
                />
              </Form.Item>
            </Col>
            
            <Col span={24}>
              <Form.Item
                name={"evaluationTemplateId"}
                label="Chọn mẫu đánh giá"
                rules={[
                  {
                    message: "Vui lòng chọn mẫu đánh giá"
                  }
                ]}
              >
                <Select
                  placeholder={"Chọn mẫu đánh giá"}
                  loading={LoadingListEvaluations}
                  options={ListEvaluations?.listPayload.map((item) => ({
                    label: `${item.nameEvaluations}`,
                    value: item.id
                  }))}
                  showSearch
                  optionFilterProp={"label"}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="isPrincipal"
                label="Phiếu đánh giá này dành cho Hiệu Trưởng hoặc Phó Hiệu Trưởng ?"
                valuePropName="checked"
              >
                <Switch checkedChildren={"Phải"} unCheckedChildren={"Không phải"} />
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
                    loading={LoadingUpdateCategoryNationaly && LoadingInsertListEvaluations}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingUpdateCategoryNationaly && LoadingInsertListEvaluations}
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

export const NewEvaluations = WithErrorBoundaryCustom(_NewEvaluations);

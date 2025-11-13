import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, DatePicker, Form, Row, Select, Space, Spin } from "antd";
import { CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { HandleError } from "@admin/components";
import { useUpdateCategoryTimeTypeEvaluationsMutation } from "@API/services/EvaluationsApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import moment from "moment";

interface IProps {
  setVisible: (value: boolean) => void;
  listIdEvaluations?: string[];
}

function _AddCategoryTimeTypeToEvaluations(props: IProps) {
  const { setVisible, listIdEvaluations } = props;
  const [formRef] = Form.useForm();
  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } =
    useGetListCategoryTimeTypeAvailableQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const [addCategoryTimeTypeToEvaluations, { isLoading: LoadingAddCategoryTimeTypeToEvaluations }] =
    useUpdateCategoryTimeTypeEvaluationsMutation();

  const onfinish = async (values: any) => {
    try {
      const result = await addCategoryTimeTypeToEvaluations({
        EvaluationsList: {
          listIdEvaluations: listIdEvaluations,
          idCategoryTimeType: values.idTypeAssessment
        }
      }).unwrap();
      if (result.success) {
        setVisible(false);
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const onReload = async () => {
    formRef.resetFields();
  };

  useEffect(() => {
    formRef.resetFields();
  }, [listIdEvaluations]);

  return (
    <div className="NewAndUpdateCriteriaOfEvaluations">
      <Spin spinning={LoadingListCategoryTimeType}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name={"idTypeAssessment"}
                label="Chọn kỳ đánh giá"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn kỳ đánh giá"
                  }
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  loading={LoadingListCategoryTimeType}
                  placeholder={"Chọn kỳ đánh giá"}
                  options={ListCategoryTimeType?.listPayload?.map((item) => ({
                    value: item.id,
                    label: item.timeTypeName,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    period: item.period
                  }))}
                  onChange={(value, option: any) => {
                    formRef.setFieldsValue({
                      fromDate: option.fromDate ? moment(option.fromDate, "YYYY-MM-DD") : null,
                      toDate: option.toDate ? moment(option.toDate, "YYYY-MM-DD") : null,
                      period: option.period !== undefined ? option.period : null
                    });
                  }}
                />
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
                <DatePicker format="DD/MM/YYYY" placeholder="00/00/0000" style={{ width: "100%" }} disabled />
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
                <DatePicker format="DD/MM/YYYY" placeholder="00/00/0000" style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name={"period"} label="Loại giai đoạn đánh giá">
                <Select allowClear showSearch placeholder={"Chọn loại giai đoạn đánh giá"} disabled>
                  <Select.Option value={0}>Đánh giá theo Tháng</Select.Option>
                  <Select.Option value={1}>Đánh giá theo Quý</Select.Option>
                  <Select.Option value={2}>Đánh giá theo Năm</Select.Option>
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
                    loading={LoadingAddCategoryTimeTypeToEvaluations}
                    icon={<ReloadOutlined />}
                    onClick={onReload}
                  >
                    Tải lại
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingAddCategoryTimeTypeToEvaluations}
                    icon={<CheckCircleOutlined />}
                    style={{
                      float: "right"
                    }}
                  >
                    Lưu thao tác
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

export const AddCategoryTimeTypeToEvaluations = WithErrorBoundaryCustom(_AddCategoryTimeTypeToEvaluations);

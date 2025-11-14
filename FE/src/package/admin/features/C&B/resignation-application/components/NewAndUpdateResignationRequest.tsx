import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  getFileInternRequest,
  useGetInternRequestByIdQuery,
  useInsertInternRequestMutation,
  useUpdateInternRequestMutation
} from "@API/services/InternRequestApis.service";
import { useGetListUnitQuery } from "@API/services/UnitApis.service";
import { useGetListCategoryPositionAvailableQuery } from "@API/services/CategoryPositionApis.service";
import { Button, Col, Form, Input, Row, Select, Space, Spin, DatePicker, Checkbox, InputNumber, Radio } from "antd";
import { CheckCircleOutlined, RetweetOutlined } from "@ant-design/icons";
import { CustomUploadFileDrag, HandleError, normFile } from "@admin/components";
import { useEffect, useState } from "react";
import { useGetListEmployeeQuery } from "@API/services/Employee.service";
import { useGetUserQuery } from "@API/services/UserApis.service";

interface Props {
  id?: string;
  AfterSave?: () => void;
}

function _NewAndUpdateResignationRequest(props: Props) {
  const { data: currentUser } = useGetUserQuery({ fetch: false });
  const [isExpiredLaborContractDate, setIsExpiredLaborContractDate] = useState(false);
  const { id, AfterSave } = props;
  const { data: InternRequest, isLoading: LoadingInternRequest } = useGetInternRequestByIdQuery(
    { idInternRequest: id! },
    { skip: !id }
  );

  const reasonList = [
    { value: "reason1", code: "Reason 1" },
    { value: "reason2", code: "Reason 2" },
    { value: "reason3", code: "Reason 3" }
  ];

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitQuery({ pageNumber: 0, pageSize: 0 });
  const { data: ListCategoryPosition, isLoading: LoadingListCategoryPosition } =
    useGetListCategoryPositionAvailableQuery({
      pageNumber: 0,
      pageSize: 0
    });
  const { data: ListEmployee, isLoading: LoadingListEmployee } = useGetListEmployeeQuery({
    pageNumber: 0,
    pageSize: 0
  });
  const [newInternRequest, { isLoading: LoadingInsertInternRequest }] = useInsertInternRequestMutation();
  const [updateInternRequest, { isLoading: LoadingUpdateInternRequest }] = useUpdateInternRequestMutation();
  const [formRef] = Form.useForm();
  useEffect(() => {
    formRef.resetFields();
    console.log("Có set nè");
    if (InternRequest?.payload && id) {
      formRef.setFieldsValue(InternRequest?.payload);
      if (InternRequest?.payload?.attachments) {
        formRef.setFieldsValue({
          Files: [
            {
              idFIle: InternRequest?.payload.id,
              uid: "-1",
              name: InternRequest?.payload.attachments,
              status: "done",
              url: getFileInternRequest(
                InternRequest.payload.id + "." + InternRequest?.payload?.attachments?.split(".")?.at(1)
              )
            }
          ]
        });
      }
    } else {
      formRef.resetFields();
      formRef.setFieldsValue({
        sapCode: "123",
        fullName: currentUser?.data?.fullName,
        positionName: "Tech",
        departmentName: "IT",
        divisionName: "AEON",
        workLocationName: "TP Hồ Chí Minh"
      });
    }
  }, [InternRequest?.payload, formRef, id]);

  const onfinish = async (values: any) => {
    try {
      const newDataInternRequest = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === "Files") return;
        const processedValue = value || ("" as any);
        newDataInternRequest.append(key, processedValue);
      });
      if (!(values.Files?.length > 0 && values.Files?.at(0)?.uid !== "-1")) {
        if (values.Files?.length > 0 && values.Files?.at(0)?.uid === "-1") {
          // không chỉnh sửa file
          newDataInternRequest.append("idFile", values.Files?.at(0)?.idFIle as string);
        } else if (values.Files?.length === 0) {
          // xóa file
          newDataInternRequest.append("idFile", "");
        }
      } else {
        // đã chỉnh sửa file
        newDataInternRequest.append("Files", values.Files?.at(0)?.originFileObj as Blob);
      }

      const result = id
        ? await updateInternRequest({
            internRequest: newDataInternRequest as any
          }).unwrap()
        : await newInternRequest({
            internRequest: newDataInternRequest as any
          }).unwrap();
      if (result.success) {
        AfterSave && AfterSave();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };
  return (
    <div className="NewAndUpdateInternRequest">
      <Spin spinning={LoadingInternRequest}>
        <Row>
          {/* prettier-ignore */}
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form layout={"vertical"} form={formRef} onFinish={onfinish}>
              <Form.Item name={"id"} hidden />
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Mã SAP" name={"sapCode"}>
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Ngày vào làm" name={"startDate"}>
                    <DatePicker placeholder="Ngày vào làm" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Họ và tên" name={"fullName"}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Trường hợp đặc biệt (hết hạn HĐ, nghỉ việc trước thời hạn,...):"
                    name={"isExpiredLaborContractDate"}>
                    <Checkbox checked={isExpiredLaborContractDate} onChange={() => {setIsExpiredLaborContractDate(!isExpiredLaborContractDate)}}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Vị trí" name={"positionName"}>
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Ngày chính thức nghỉ việc" name={"officialDate"}>
                    <DatePicker placeholder="Ngày chính thức nghỉ việc" disabled={isExpiredLaborContractDate } />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Phòng ban/ Ngành hàng" name={"departmentName"}>
                    <Input disabled/>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Số ngày phép dư tính đến ngày nghỉ việc: *" name={"unusedLeaveDate"}>
                    <InputNumber min={0} max={10}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Bộ phận/ Nhóm" name={"divisionName"}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Số bảo hiểm" name={"shuiBookName"}>
                    <Radio.Group>
                      <Radio value="0">Nhân viên giữ</Radio>
                      <Radio value="1">Công ty giữ</Radio>
                      <Radio value="2">Chưa tham gia bảo hiểm</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Form.Item label="Nơi làm việc" name={"workLocationName"}>
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item label="Lý do nghỉ việc" name={"reasonForActionCode"}>
                    <Select allowClear>
                      {reasonList.map((item) => {
                        return (
                          <Select.Option value={item.code}>{item.name}</Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item name={"isAgree"}>
                    <Checkbox>
                      Tôi đồng ý bồi thường tiền lương của những ngày không báo trước
                      <br />
                      I agree to compensate for un - notice days as required by law
                    </Checkbox >
                  </Form.Item>
                </Col>
              </Row>
              {/*<Form.Item label="Mã SapCode" name={"description"}>
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả" name={"description"}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Tên phòng ban" name={"unitName"} hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Phòng ban"
                name={"idUnit"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phòng ban"
                  }
                ]}
              >
                <Select
                  onChange={(_, option: any) => {
                    formRef.setFieldsValue({
                      unitName: option?.label
                    });
                  }}
                  loading={LoadingListUnit}
                  showSearch
                  options={ListUnit?.listPayload?.map((item) => ({
                    label: item.unitName,
                    value: item.id
                  }))}
                  optionFilterProp={"label"}
                />
              </Form.Item>
              <Form.Item label="Tên vị trí" name={"positionName"} hidden>
                <Input />
              </Form.Item>
              <Form.Item
                label="Vị trí"
                name={"idPosition"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn vị trí"
                  }
                ]}
              >
                <Select
                  onChange={(_, option: any) => {
                    formRef.setFieldsValue({
                      positionName: option?.label
                    });
                  }}
                  loading={LoadingListCategoryPosition}
                  showSearch
                  options={ListCategoryPosition?.listPayload?.map((item) => ({
                    label: item.positionName,
                    value: item.id
                  }))}
                  optionFilterProp={"label"}
                />
              </Form.Item>
              <Form.Item
                label="Nhân viên"
                name={"idEmployee"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn nhân viên"
                  }
                ]}
              >
                <Select
                  loading={LoadingListEmployee}
                  showSearch
                  options={ListEmployee?.listPayload?.map((item) => ({
                    label: item.name + " - " + item.code,
                    value: item.id
                  }))}
                  optionFilterProp={"label"}
                />
              </Form.Item>
              <Form.Item label="File đính kèm" name={"Files"} getValueFromEvent={normFile} valuePropName="fileList">
                <CustomUploadFileDrag multiple={false} maxCount={1} />
              </Form.Item>*/}
              <Form.Item>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "flex-end"
                  }}
                >
                  {/*<Button
                    type="default"
                    htmlType="reset"
                    loading={LoadingInsertInternRequest || LoadingUpdateInternRequest}
                    icon={<RetweetOutlined />}
                  >
                    Xóa
                  </Button>*/}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={LoadingInsertInternRequest || LoadingUpdateInternRequest}
                    icon={<CheckCircleOutlined />}
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

export const NewAndUpdateResignationRequest = WithErrorBoundaryCustom(_NewAndUpdateResignationRequest);

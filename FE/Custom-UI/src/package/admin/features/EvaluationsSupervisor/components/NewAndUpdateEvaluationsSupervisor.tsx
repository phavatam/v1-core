import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableProps
} from "antd";
import React, { useEffect, useState } from "react";
import { HandleError } from "@admin/components";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, RetweetOutlined, SettingOutlined } from "@ant-design/icons";
import { EvaluationsSupervisorDTO } from "@models/evaluationsSupervisorDTO";
import {
  useDeleteEvaluationsSupervisorMutation,
  useGetEvaluationsSupervisorByIdEvaluationsQuery,
  useInsertEvaluationsSupervisorMutation,
  useLazyGetEvaluationsSupervisorByIdQuery,
  useUpdateEvaluationsSupervisorMutation
} from "@API/services/EvaluationsSupervisorApis.service";
import { useGetListUserParentAndChildrenOfEvaluationsQuery, useGetListUserQuery } from "@API/services/UserApis.service";
import { useGetListUserTypeQuery } from "@API/services/UserType.service";
import { listItemBeforeStyle, listItemStyle, listStyle } from "@admin/features/evaluations";
import { ColumnsType } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { useGetListUnitQuery } from "@API/services/UnitApis.service";
interface IProps {
  setVisible: (value: boolean) => void;
  idEvaluations?: string;
}
function _NewAndUpdateEvaluationsSupervisor(props: IProps) {
  const { idEvaluations } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [id, setId] = useState<string | undefined>(undefined);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const menuAction = (record: EvaluationsSupervisorDTO) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<EditOutlined />}
          onClick={() => {
            setId(record.id);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
      </Menu>
    );
  };

  const resetData = () => {
    setId(undefined);
    setSelectedRowKeys([]);
    formRef.resetFields();
    refetch();
  };

  const {
    data: ListEvaluationsSupervisor,
    isLoading: LoadingListEvaluationsSupervisor,
    refetch
  } = useGetEvaluationsSupervisorByIdEvaluationsQuery({
    idEvaluations: idEvaluations || "",
    pageSize: 0,
    pageNumber: 0
  });

  const [getEvaluationsSupervisorById, { data: EvaluationsSupervisor, isLoading: LoadingEvaluationsSupervisor }] =
    useLazyGetEvaluationsSupervisorByIdQuery();

  const [newEvaluationsSupervisor, { isLoading: LoadingNewEvaluationsSupervisor }] =
    useInsertEvaluationsSupervisorMutation();

  const [updateEvaluationsSupervisor, { isLoading: LoadingUpdateEvaluationsSupervisor }] =
    useUpdateEvaluationsSupervisorMutation();

  const [deleteEvaluationsSupervisor, { isLoading: LoadingDeleteEvaluationsSupervisor }] =
    useDeleteEvaluationsSupervisorMutation();

  const [formRef] = Form.useForm();

  const { data: ListUserParentAndChildren, isLoading: LoadingListUserParentAndChildren } =
    useGetListUserParentAndChildrenOfEvaluationsQuery({
      idEvaluations: idEvaluations || "",
      pageSize: 0,
      pageNumber: 0
    });
  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUser, isLoading: LoadingListUser } = useGetListUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const columns: ColumnsType<EvaluationsSupervisorDTO> = [
    {
      title: "Tên người giám sát",
      dataIndex: "idUser",
      key: "idUser",
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUser?.listPayload?.find((item) => item.id === text)?.fullname}
        </div>
      )
    },
    {
      title: "Đơn vị",
      dataIndex: "idUser",
      key: "idUser",
      render: (unitId) => {
        const user = ListUser?.listPayload?.find((item) => item.id === unitId);
        if (user) {
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {ListUnit?.listPayload?.find((item) => item.id === user.unitId)?.unitName}
            </div>
          );
        }
      }
    },
    {
      title: "Loại người dùng",
      dataIndex: "idUser",
      key: "idUser",
      render: (text) => {
        const user = ListUser?.listPayload?.find((item) => item.id === text);
        if (user) {
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {ListUserType?.listPayload?.find((item) => item.id === user.userTypeId)?.typeName}
            </div>
          );
        }
      }
    },
    {
      title: "Thứ tự đánh giá",
      dataIndex: "sort",
      key: "sort",
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
          <SettingOutlined style={{ fontSize: 20 }} />
        </Dropdown>
      )
    }
  ];

  const propsTable: TableProps<EvaluationsSupervisorDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      align: "center",
      width: 150,
      ...item
    })),
    rowSelection: rowSelection,
    // onChange: handleChange,
    loading:
      LoadingListEvaluationsSupervisor &&
      LoadingListUserParentAndChildren &&
      LoadingListUserType &&
      LoadingListUser &&
      LoadingListUnit,
    dataSource: ListEvaluationsSupervisor?.listPayload,
    pagination: false,
    size: "middle"
  };

  useEffect(() => {
    if (id) {
      getEvaluationsSupervisorById({ idEvaluationsSupervisor: id });
    }
  }, [getEvaluationsSupervisorById, id]);

  useEffect(() => {
    if (EvaluationsSupervisor?.payload && id) {
      formRef.setFieldsValue(EvaluationsSupervisor?.payload);
    } else {
      formRef.resetFields();
    }
  }, [EvaluationsSupervisor, formRef, id]);

  const onfinish = async (values: EvaluationsSupervisorDTO) => {
    try {
      if (id) {
        const resultUpdate = await updateEvaluationsSupervisor({
          EvaluationsSupervisor: { ...values, id }
        }).unwrap();
        if (resultUpdate.success) {
          formRef.resetFields();
        }
      } else {
        const result = await newEvaluationsSupervisor({
          EvaluationsSupervisor: {
            ...values,
            idEvaluations: idEvaluations
          }
        }).unwrap();
        if (result.success) {
          formRef.resetFields();
        }
      }
      resetData();
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const options = ListUserParentAndChildren?.listPayload?.map((item) => {
    const userType = ListUserType?.listPayload?.find((itemType) => itemType.id === item.userTypeId)?.typeName;
    const unitName = ListUnit?.listPayload?.find((itemUnit) => itemUnit.id === item.unitId)?.unitName;
    return {
      label: `${item.fullname} ------ ${userType} ------ ${unitName} ------ ${item.email}`,
      value: item.id
    };
  });

  return (
    <div className="NewAndUpdateEvaluationsSupervisor">
      <Spin spinning={LoadingEvaluationsSupervisor && LoadingListUserType}>
        <Form layout={"vertical"} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} form={formRef} onFinish={onfinish}>
          <Form.Item name={"idEvaluations"} hidden>
            <Input value={idEvaluations} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Alert
                message="Lưu ý"
                description={
                  <ul style={listStyle}>
                    <li style={listItemStyle}>
                      <span style={listItemBeforeStyle}>- </span>Khi phiếu đánh giá này đã dữ liệu thì sẽ không thể
                      chỉnh sửa hay thêm người giám sát được nữa !
                    </li>
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
            </Col>

            <Col span={24}>
              <Form.Item
                label="Người giám sát: "
                name={"idUser"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn Người giám sát"
                  }
                ]}
              >
                <Select
                  allowClear
                  showSearch
                  loading={LoadingListUserParentAndChildren}
                  optionFilterProp={"label"}
                  options={options}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Số thứ tự đánh giá: "
                name={"sort"}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Số thứ tự đánh giá"
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
                initialValue={1}
              >
                <InputNumber
                  style={{
                    width: "100%"
                  }}
                  formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
                  parser={(value) => parseInt(value!.replace(/[^\d]/g, ""), 10) || 1} // Parse and ensure integer
                />
              </Form.Item>
            </Col>

            <Divider />
            <Col span={24}>
              <Space
                style={{
                  marginBottom: 16
                }}
                wrap
              >
                <Popconfirm
                  title="Bạn có chắc chắn không ?"
                  okText="Có"
                  cancelText="Không"
                  disabled={!(selectedRowKeys.length > 0)}
                  onConfirm={async () => {
                    try {
                      const result = await deleteEvaluationsSupervisor({
                        idEvaluationsSupervisor: selectedRowKeys as string[]
                      }).unwrap();
                      if (result.success) {
                        resetData();
                        return setSelectedRowKeys([]);
                      }
                    } catch (e: any) {
                      await HandleError(e);
                    }
                  }}
                >
                  <Button
                    danger
                    type="primary"
                    //loading={LoadingDeleleBankAccountInformation}
                    disabled={!(selectedRowKeys.length > 0)}
                    icon={<DeleteOutlined />}
                  >
                    Xóa {selectedRowKeys.length} mục
                  </Button>
                </Popconfirm>
              </Space>

              <Card bordered={false} className="criclebox">
                <Table {...propsTable} expandIconColumnIndex={1} />
              </Card>
            </Col>
            <Divider />
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
                    loading={
                      LoadingNewEvaluationsSupervisor ||
                      LoadingUpdateEvaluationsSupervisor ||
                      LoadingDeleteEvaluationsSupervisor
                    }
                    icon={<RetweetOutlined />}
                    onClick={() => {
                      resetData();
                    }}
                  >
                    Xóa
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={
                      LoadingNewEvaluationsSupervisor ||
                      LoadingUpdateEvaluationsSupervisor ||
                      LoadingDeleteEvaluationsSupervisor
                    }
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

export const NewAndUpdateEvaluationsSupervisor = WithErrorBoundaryCustom(_NewAndUpdateEvaluationsSupervisor);

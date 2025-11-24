import WithErrorBoundaryCustom from "~/units/errorBounDary/WithErrorBoundaryCustom";
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Typography
} from "antd";
import React, { useState } from "react";
import { FilterValue } from "antd/lib/table/interface";
import { UnitDTO } from "@models/unitDto";
import {
  ApartmentOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  InboxOutlined,
  PlusCircleOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StopOutlined,
  UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getExampleImportUnitExcel,
  useDeleteUnitMutation,
  useGetListUnitQuery,
  useHideUnitMutation,
  useImportUnitWithExcelMutation
} from "@API/services/UnitApis.service";
import { HandleError, ModalContent } from "@admin/components";
import { arrayToTree, DepartmentChart, NewAndUpdateUnit, renderTree } from "@admin/features/unit";
import { DrawerContent } from "@admin/components/DrawerContent/DrawerContent";
import { DepartmentChartOnly } from "@admin/features/unit/components/DepartmentChartOnly";
import { ListUserByUnit } from "@admin/features/unit/components/ListUserByUnit";
import Dragger from "antd/es/upload/Dragger";

const _Unit = () => {
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitQuery({ pageSize: 0, pageNumber: 0 });
  const [deleteListUnit, { isLoading: isLoadingDeleteListUnit }] = useDeleteUnitMutation();
  const [hideListUnit, { isLoading: isLoadingHideListUnit }] = useHideUnitMutation();

  const [file, setFile] = useState<File | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenDepartmentChart, setIsOpenDepartmentChart] = useState<boolean>(false);
  const [isOpenDepartmentChartOnly, setIsOpenDepartmentChartOnly] = useState<boolean>(false);
  const [isOpenListEmployeeByUnit, setIsOpenListEmployeeByUnit] = useState<boolean>(false);

  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<UnitDTO>["onChange"] = (pagination, filters) => {
    // pagination = pagination || {};
    setFilteredInfo(filters);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const [importUnitWithExcel] = useImportUnitWithExcelMutation();

  const handleGetExampleExcel = async () => {
    try {
      const res: any = await getExampleImportUnitExcel();
      if (res) {
        const data = res?.data as Blob;
        const file = new Blob([data]);
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(file);
        a.download = "Biểu mẫu thêm đơn vị/phòng ban.xlsx";
        a.click();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (file !== null) {
      await handleImportUnitWithExcel(file);
    }
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleImportUnitWithExcel = async (file: File) => {
    try {
      await importUnitWithExcel({ file: file });
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const data = arrayToTree(ListUnit?.listPayload ?? []);

  const menuAction = (record: UnitDTO) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<EditOutlined />}
          onClick={() => {
            setId(record.id);
            setIsOpenModal(true);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
      </Menu>
    );
  };

  const columns: TableColumnsType<UnitDTO> = [
    {
      title: "Tên",
      dataIndex: "unitName",
      key: "unitName",
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Mã",
      dataIndex: "unitCode",
      key: "unitCode"
    },
    {
      title: "Trạng thái",
      dataIndex: "isHide",
      key: "isHide",
      render: (text) => (text ? <Tag color={"error"}>Khóa</Tag> : <Tag color={"success"}>Hoạt động</Tag>)
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: ListUnit?.listPayload?.map((item) => ({
        text: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm"),
        value: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm")
      })),
      filteredValue: filteredInfo?.createdDate || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.createdDate.toString().startsWith(value),
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
            <SettingOutlined style={{ fontSize: 20 }} />
          </Dropdown>
          <ApartmentOutlined
            style={{ fontSize: 20 }}
            onClick={() => {
              setIsOpenDepartmentChartOnly(true);
              setId(record.id);
            }}
          />
          <UserOutlined
            style={{ fontSize: 20 }}
            onClick={() => {
              setIsOpenListEmployeeByUnit(true);
              setId(record.id);
            }}
          />
        </Space>
      ),
      width: 125
    }
  ];

  const propsTable: TableProps<UnitDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      ellipsis: true,
      width: 150,
      ...item
    })),
    rowSelection: {
      ...rowSelection,
      checkStrictly: true
    },
    onChange: handleChange,
    loading: LoadingListUnit,
    dataSource: renderTree(data),
    pagination: false,
    size: "middle"
  };
  //#endregion
  return (
    <div className={"unit"}>
      <ModalContent
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        title={id ? "Chỉnh sửa phòng ban" : "Thêm mới phòng ban"}
        width={"600px"}
      >
        <NewAndUpdateUnit setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <DrawerContent
        title={"Sơ đồ tổ chức"}
        open={isOpenDepartmentChart}
        onClose={() => setIsOpenDepartmentChart(false)}
        width={"auto"}
        placement={"left"}
      >
        <DepartmentChart />
      </DrawerContent>
      <ModalContent
        visible={isOpenDepartmentChartOnly}
        setVisible={setIsOpenDepartmentChartOnly}
        title={"Sơ đồ tổ chức"}
        width={"700px"}
      >
        <DepartmentChartOnly id={id} />
      </ModalContent>

      <ModalContent
        visible={isOpenListEmployeeByUnit}
        setVisible={setIsOpenListEmployeeByUnit}
        title={"Nhân sự có trong đơn vị"}
        width={"1400px"}
      >
        <ListUserByUnit setVisible={setIsOpenListEmployeeByUnit} id={id} />
      </ModalContent>
      <Modal
        title="Tải lên tệp tin lên hệ thống"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setOpen(false);
        }}
        okText="Xác nhận thêm"
        cancelText={"Hủy thêm"}
      >
        <Dragger
          multiple={false}
          maxCount={1}
          beforeUpload={(file) => {
            setFile(file);
            return false;
          }}
        >
          {" "}
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấn hoặc kéo thả tệp vào đây để tải tệp tin vào đây</p>
          <p className="ant-upload-hint">
            Chỉ cho phép tải lên một tệp duy nhất. Vui lòng tải đúng tệp biểu mẫu Excel và không được tải lên các tệp
            tin bị cấm.
          </p>
        </Dragger>
      </Modal>

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh sách đơn vị </Typography.Title>
          <Divider />
          <Space
            style={{
              marginBottom: 16
            }}
            wrap
          >
            <Button
              onClick={() => {
                setId(undefined);
                setIsOpenModal(true);
              }}
              icon={<PlusCircleOutlined />}
              type="primary"
            >
              Thêm mới
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
              }}
              icon={<FileExcelOutlined />}
              type="default"
              style={{
                backgroundColor: "green",
                color: "white"
              }}
            >
              Thêm mới bằng biểu mẫu Excel
            </Button>
            <Button
              onClick={async () => {
                await handleGetExampleExcel();
              }}
              icon={<DownloadOutlined />}
              type="default"
              style={{
                backgroundColor: "green",
                color: "white"
              }}
            >
              Lấy biểu mẫu Excel
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              disabled={!(selectedRowKeys.length > 0)}
              cancelText="Không"
              onConfirm={async () => {
                try {
                  await hideListUnit({ idUnit: selectedRowKeys as string[], isHide: false });
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                type="default"
                disabled={!(selectedRowKeys.length > 0)}
                loading={isLoadingHideListUnit}
                icon={<SafetyCertificateOutlined />}
              >
                Kích hoạt {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              disabled={!(selectedRowKeys.length > 0)}
              cancelText="Không"
              onConfirm={async () => {
                try {
                  await hideListUnit({ idUnit: selectedRowKeys as string[], isHide: true });
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="default"
                disabled={!(selectedRowKeys.length > 0)}
                loading={isLoadingHideListUnit}
                icon={<StopOutlined />}
              >
                Khóa {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              disabled={!(selectedRowKeys.length > 0)}
              onConfirm={async () => {
                try {
                  const result = await deleteListUnit({ idUnit: selectedRowKeys as string[] }).unwrap();
                  if (result.success) return setSelectedRowKeys([]);
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="primary"
                loading={isLoadingDeleteListUnit}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<DeleteOutlined />}
              >
                Xóa {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
            <Button icon={<ApartmentOutlined />} onClick={() => setIsOpenDepartmentChart(true)}>
              Xem sơ đồ
            </Button>
          </Space>
          <Card bordered={false} className="criclebox">
            <Table {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export const Unit = WithErrorBoundaryCustom(_Unit);

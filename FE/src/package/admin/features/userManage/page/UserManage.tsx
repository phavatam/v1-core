import {
  AuditOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StopOutlined,
  UserAddOutlined
} from "@ant-design/icons";
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
  TableProps,
  Tag,
  Typography,
  Collapse,
  Panel,
  Form,
  CollapseProps,
  Layout,
  Input
} from "antd";
import { LoginOutlined, MailOutlined, UnlockOutlined, AimOutlined } from "@ant-design/icons";

const { Header, Footer, Content } = Layout;

import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import React, { Children, useState } from "react";
import { UserDTO } from "~/models/userDto";
import WithErrorBoundaryCustom from "~/units/errorBounDary/WithErrorBoundaryCustom";
import { NewAndUpdateUser, RoleUser } from "@admin/features/userManage";
import {
  getExampleExcel,
  useGetListUserQuery,
  useImportUserWithExcelMutation,
  useLockUserAccountByListMutation,
  useRemoveUserByListMutation,
  useRenewPasswordUserByListMutation
} from "@API/services/UserApis.service";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { DrawerContent } from "@admin/components/DrawerContent/DrawerContent";
import Dragger from "antd/es/upload/Dragger";
import { useGetListUserTypeQuery } from "@API/services/UserType.service";

const _UserManage: React.FC = () => {
  const [isOpenModalAuthorization, setIsOpenModalAuthorization] = useState(false);
  const [isOpenModalNewAndUpdateUser, setIsOpenModalNewAndUpdateUser] = useState(false);
  const [idUserSelected, setIdUserSelected] = useState<string | undefined>(undefined);
  const [removeUserByList, { isLoading: isLoadingRemoveUser }] = useRemoveUserByListMutation();
  const [renewPasswordUserByList, { isLoading: isLoadingRenewPasswordUser }] = useRenewPasswordUserByListMutation();
  const [lockUserByList, { isLoading: isLoadingLockUser }] = useLockUserAccountByListMutation();
  const [file, setFile] = useState<File | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openRenewPassword, setOpenPopupRenewPassword] = useState(false);
  const { Panel } = Collapse;

  const { data, isLoading } = useGetListUserQuery({
    pageSize: 20,
    pageNumber: 1
  });

  // const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
  //   pageSize: 0,
  //   pageNumber: 0
  // });

  const [importUserWithExcel] = useImportUserWithExcelMutation();

  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<UserDTO>["onChange"] = (pagination, filters) => {
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
  const menuAction = (record: UserDTO) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<EditOutlined />}
          onClick={() => {
            setIdUserSelected(record.id);
            setIsOpenModalNewAndUpdateUser(true);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<AuditOutlined />}
          onClick={() => {
            setIdUserSelected(record.id);
            setIsOpenModalAuthorization(true);
          }}
        >
          Phân quyền tài khoản
        </Menu.Item>
      </Menu>
    );
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (file !== null) {
      await handleImportWithExcel(file);
    }
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleRenewPassword = async () => {
    setConfirmLoading(true);
    if (selectedRowKeys !== null) {
      try {
        await renewPasswordUserByList({ userIds: selectedRowKeys as string[], newPassword: "12345678" }).unwrap();
      } catch (e: any) {
        await HandleError(e);
      }
    }
    setOpenPopupRenewPassword(false);
    setConfirmLoading(false);
  };

  const handleImportWithExcel = async (file: File) => {
    try {
      await importUserWithExcel({ file: file });
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const handleGetExampleExcel = async () => {
    try {
      const res: any = await getExampleExcel();
      if (res) {
        const data = res?.data as Blob;
        const file = new Blob([data]);
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(file);
        a.download = "Biểu mẫu thêm mới người dùng.xlsx";
        a.click();
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const text = (
    <p style={{ paddingInlineStart: 24 }}>
      A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest
      in many households across the world.
    </p>
  );

  const columns: ColumnsType<UserDTO> = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      // filters: data?.data?.data?.map((item) => ({
      //   text: item.fullName,
      //   value: item.fullName
      // })),
      // filteredValue: filteredInfo?.fullName || null,
      // filterSearch: true,
      // onFilter: (value: any, record) => record.fullName.startsWith(value),
      width: 200,
      render: (text) => (
        <Typography.Text style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {<UserAddOutlined />} {text}
        </Typography.Text>
      )
    },
    // {
    //   title: "Chức vụ",
    //   dataIndex: "userTypeId",
    //   key: "userTypeId",
    //   filters: ListUserType?.listPayload?.map((item) => ({
    //     text: item.typeName,
    //     value: item.id
    //   })),
    //   filteredValue: filteredInfo?.userTypeId || null,
    //   onFilter: (value, record) => record.userTypeId === value,
    //   render: (userTypeId) => {
    //     const userType = ListUserType?.listPayload?.find((item) => item.id === userTypeId);
    //     return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{userType ? userType.typeName : "N/A"}</div>;
    //   }
    // },
    // {
    //   title: "Chức danh",
    //   dataIndex: "positions",
    //   key: "positions",
    //   filters: [...new Set(data?.listPayload?.map((item) => item.positions))].map((positions) => ({
    //     text: positions,
    //     value: positions
    //   })),
    //   filteredValue: filteredInfo?.positions || null,
    //   filterSearch: true,
    //   onFilter: (value: any, record) => (record.positions ? record.positions.startsWith(value) : false)
    // },
    {
      title: "Mã tài khoản",
      dataIndex: "loginName",
      key: "loginName",
      // filters: data?.data?.data?.map((item) => ({
      //   text: item.loginName,
      //   value: item.loginName
      // })),
      // filteredValue: filteredInfo?.loginName || null,
      // filterSearch: true,
      // onFilter: (value: any, record) => record.loginName === value,
      render: (text) => {
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // filters: data?.data?.data?.map((item) => ({
      //   text: item.email,
      //   value: item.email
      // })),
      // filteredValue: filteredInfo?.email || null,
      // filterSearch: true,
      //onFilter: (value: any, record) => record.email.startsWith(value),
      render: (text) => (
        <Typography.Link
          href={`mailto:${text}`}
          target={"_blank"}
          style={{ whiteSpace: "break-spaces", width: "100%" }}
        >
          {text}
        </Typography.Link>
      )
    },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    //   filters: [...new Set(data?.data?.data?.map((item) => item.phone))].map((phone) => ({
    //     text: phone,
    //     value: phone
    //   })),
    //   filteredValue: filteredInfo?.phone || null,
    //   filterSearch: true,
    //   onFilter: (value: any, record) => (record.phone ? record.phone.startsWith(value) : false)
    // },
    {
      title: "Trạng thái",
      dataIndex: "isLocked",
      key: "isLocked",
      render: (text) =>
        !text ? (
          <Tag color={"success"}>
            <CheckCircleOutlined /> Hoạt động
          </Tag>
        ) : (
          <Tag color={"error"}>
            <CloseCircleOutlined /> Không
          </Tag>
        )
    },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]}>
          <SettingOutlined style={{ fontSize: 20 }} />
        </Dropdown>
      ),
      width: "8%"
    }
  ];
  const propsTable: TableProps<UserDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      //ellipsis: true,
      width: 200,
      ...item
    })),
    rowSelection: rowSelection,
    //loading: isLoading && LoadingListUserType,
    loading: isLoading,
    dataSource: data?.data?.data,
    onChange: handleChange,
    pagination: {
      total: data?.data?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };

  return (
    <div className="UserManage">
      <DrawerContent
        onClose={() => setIsOpenModalNewAndUpdateUser(false)}
        open={isOpenModalNewAndUpdateUser}
        title={!idUserSelected ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản"}
        width={"65%"}
      >
        <NewAndUpdateUser setVisible={setIsOpenModalNewAndUpdateUser} idUser={idUserSelected} />
      </DrawerContent>
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
      <Modal
        title="Đặt lại mật khẩu mặc định"
        open={openRenewPassword}
        onOk={handleRenewPassword}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setOpenPopupRenewPassword(false);
        }}
        okText="Xác nhận"
        cancelText={"Hủy"}
      >
        <br></br>
        <p>Bấm xác nhận để thực hiện thay đổi mật khẩu các tài khoản đã cho.</p>
        <p style={{ color: "red" }}>Chú ý: Mật khẩu mặc định sẽ được đặt lại là: 12345678</p>
      </Modal>
      <ModalContent
        visible={isOpenModalAuthorization}
        setVisible={setIsOpenModalAuthorization}
        title={"Phần quyền tài khoản"}
        width={"600px"}
      >
        <RoleUser setVisible={setIsOpenModalAuthorization} id={idUserSelected} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Divider />
          <Typography.Title level={3}> Danh sách tài khoản </Typography.Title>
          <Space
            style={{
              marginBottom: 16
            }}
            wrap
          >
            <Button
              onClick={() => {
                setIsOpenModalNewAndUpdateUser(true);
                setIdUserSelected(undefined);
              }}
              icon={<UserAddOutlined />}
              type="primary"
            >
              Thêm tài khoản mới
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
                  await lockUserByList({ listId: selectedRowKeys as string[], isLock: false });
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                type="default"
                disabled={!(selectedRowKeys.length > 0)}
                loading={isLoadingLockUser}
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
                  await lockUserByList({ listId: selectedRowKeys as string[], isLock: true });
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="default"
                disabled={!(selectedRowKeys.length > 0)}
                loading={isLoadingLockUser}
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
                  const result = await removeUserByList({ listId: selectedRowKeys as string[] }).unwrap();
                  if (result.success) return setSelectedRowKeys([]);
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="primary"
                loading={isLoadingRemoveUser}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<DeleteOutlined />}
              >
                Xóa {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
            <Button
              danger
              type="primary"
              loading={isLoadingRenewPasswordUser}
              disabled={!(selectedRowKeys.length > 0)}
              icon={<DeleteOutlined />}
              onClick={async () => {
                setOpenPopupRenewPassword(true);
              }}
            >
              Thay đổi mật khẩu {selectedRowKeys.length} mục
            </Button>
          </Space>
          <Card bordered={false} className="criclebox">
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export const UserManage = WithErrorBoundaryCustom(_UserManage);

import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useEffect, useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Tag, Typography } from "antd";
import { DeleteOutlined, DownloadOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateElectronicSignature } from "@admin/features/electronicSignature";
import { ElectronicSignatureDTO } from "@models/electronicSignatureDTO";
import {
  useDeleteElectronicSignatureMutation,
  useGetListElectronicSignatureQuery,
  useLazyDownloadFileQuery
} from "@API/services/ElectronicSignatureApis.service";
import { useGetListUserQuery } from "@API/services/UserApis.service";
import { useGetListUnitAvailableQuery, useGetListUnitQuery } from "@API/services/UnitApis.service";
import { useGetListUserTypeQuery } from "~/API/services/UserType.service";

function _ElectronicSignature() {
  const { data: ListElectronicSignature, isLoading: LoadingListElectronicSignature } =
    useGetListElectronicSignatureQuery({
      pageSize: 0,
      pageNumber: 0
    });
  const [deleteListElectronicSignature, { isLoading: isLoadingDeleteListElectronicSignature }] =
    useDeleteElectronicSignatureMutation();

  const { data: ListUser, isLoading: LoadingListUser } = useGetListUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({ pageSize: 0, pageNumber: 0 });

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);

  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<ElectronicSignatureDTO>["onChange"] = (pagination, filters) => {
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
  const [triggerDownloadFile] = useLazyDownloadFileQuery();

  const handleDownload = async (id: string, fullName: string) => {
    try {
      const response = await triggerDownloadFile({ idElectronicSignature: id }).unwrap();

      if (response) {
        const url = window.URL.createObjectURL(new Blob([response]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fullName}.pem`);
        document.body.appendChild(link);
        link.click();

        link?.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const menuAction = (record: ElectronicSignatureDTO) => {
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

  const columns: ColumnsType<ElectronicSignatureDTO> = [
    {
      title: "Họ và tên",
      dataIndex: "idUser",
      key: "idUser",
      render: (idUser: string) => ListUser?.listPayload?.find((item) => item.id === idUser)?.fullname
    },
    {
      title: "Mã tài khoản",
      dataIndex: "idUser",
      key: "idUser",
      render: (idUser: string) => ListUser?.listPayload?.find((item) => item.id === idUser)?.userCode
    },
    {
      title: "Chức vụ",
      dataIndex: "idUser",
      key: "userTypeId",
      filters: ListUserType?.listPayload?.map((item) => ({
        text: item.typeName,
        value: item.id
      })),
      filteredValue: filteredInfo?.userTypeId || null,
      filterSearch: true,
      onFilter: (value: any, record) => {
        const user = ListUser?.listPayload?.find((item) => item.id === record.idUser);
        return user?.userTypeId === value;
      },
      render: (idUser: string) => {
        const userTypeId = ListUser?.listPayload?.find((item) => item.id === idUser)?.userTypeId;
        return (
          <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
            {ListUserType?.listPayload?.find((item) => item.id === userTypeId)?.typeName || "Không có chức vụ"}
          </div>
        );
      }
    },
    {
      title: "Email",
      dataIndex: "idUser",
      key: "idUser",
      render: (idUser: string) => ListUser?.listPayload?.find((item) => item.id === idUser)?.email
    },
    {
      title: "Đơn vị",
      dataIndex: "idUser",
      key: "unitId",
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id
      })),
      filteredValue: filteredInfo?.unitId || null,
      filterSearch: true,
      onFilter: (value: any, record) => {
        const user = ListUser?.listPayload?.find((item) => item.id === record.idUser);
        return user?.unitId === value;
      },
      render: (idUser: string) => {
        const user = ListUser?.listPayload?.find((item) => item.id === idUser);
        const unit = ListUnit?.listPayload?.find((item) => item.id === user?.unitId);
        return unit?.unitName;
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 0:
            return (
              <Tag style={{ width: "100%", textAlign: "center", fontSize: 12, color: "green" }}>Đang hoạt động</Tag>
            );
          case 1:
            return <Tag style={{ width: "100%", textAlign: "center", fontSize: 12, color: "purple" }}>Tạm ngưng</Tag>;
          case 2:
            return <Tag style={{ width: "100%", textAlign: "center", fontSize: 12, color: "red" }}>Thu hồi</Tag>;
          case 3:
            return <Tag style={{ width: "100%", textAlign: "center", fontSize: 12, color: "blueviolet" }}>Thu hồi</Tag>;
          default:
            return "Không xác định";
        }
      }
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: (item, record) => {
        const fullName = ListUser?.listPayload?.find((item) => item.id === record.idUser)?.fullname || "privateKey";
        return (
          <Button
            onClick={async () => handleDownload(record.id, fullName)}
            type="primary"
            size="middle"
            icon={<DownloadOutlined />}
          >
            Tải về
          </Button>
        );
      }
    },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
      align: "center",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
          <SettingOutlined style={{ fontSize: 20, paddingRight: 8 }} />
        </Dropdown>
      ),
      width: "8%"
    }
  ];

  const propsTable: TableProps<ElectronicSignatureDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      ellipsis: true,
      align: "center",
      width: 150,
      ...item
    })),
    rowSelection: rowSelection,
    loading: LoadingListElectronicSignature && LoadingListUser && LoadingListUnit && LoadingListUserType,
    dataSource: ListElectronicSignature?.listPayload,
    onChange: handleChange,
    pagination: {
      total: ListElectronicSignature?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };
  //#endregion
  return (
    <div className={"unit"}>
      <ModalContent
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        title={id ? "Chỉnh sửa" : "Thêm mới"}
        width={"600px"}
      >
        <NewAndUpdateElectronicSignature setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Quản lý chữ ký số </Typography.Title>
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
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              disabled={!(selectedRowKeys.length > 0)}
              onConfirm={async () => {
                try {
                  const result = await deleteListElectronicSignature({
                    idElectronicSignature: selectedRowKeys as string[]
                  }).unwrap();
                  if (result.success) return setSelectedRowKeys([]);
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="primary"
                loading={isLoadingDeleteListElectronicSignature}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<DeleteOutlined />}
              >
                Xóa {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
          </Space>
          <Card bordered={false} className="criclebox">
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const ElectronicSignature = WithErrorBoundaryCustom(_ElectronicSignature);

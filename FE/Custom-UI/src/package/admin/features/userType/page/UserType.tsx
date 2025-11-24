import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";

import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { useDeleteUserTypeMutation, useGetListUserTypeQuery, useGetListQuery } from "@API/services/UserType.service";
import { UserTypeDTO } from "@models/userTypeDto";
import { NewAndUpdateUserType } from "@admin/features/userType";

function _UserType() {
  console.log("Render UserType Page");
  // const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
  //   pageSize: 0,
  //   pageNumber: 0
  // });
  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListQuery({
    pageNumber: 0,
    pageSize: 10
  });

  console.log(ListUserType);
  const [deleteListUserType, { isLoading: isLoadingDeleteListUserType }] = useDeleteUserTypeMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<UserTypeDTO>["onChange"] = (pagination, filters) => {
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
  const menuAction = (record: UserTypeDTO) => {
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

  const columns: ColumnsType<UserTypeDTO> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      render: (_: any, __: UserTypeDTO, index: number) => index + 1,
      width: 30,
      align: "center"
    },
    {
      title: "Tên chức vụ, chức danh",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Typography.Link
          onClick={() => {
            setId(record.id);
            setIsOpenModal(true);
          }}
          style={{ whiteSpace: "break-spaces", width: "100%" }}
        >
          {text}
        </Typography.Link>
      )
    },
    // {
    //   title: "Mã",
    //   dataIndex: "typeCode",
    //   key: "typeCode"
    // },
    {
      title: "Ngày tạo",
      dataIndex: "created",
      key: "created",
      filters: ListUserType?.data?.items?.map((item: UserTypeDTO) => ({
        text: dayjs(item.created).format("DD-MM-YYYY HH:mm"),
        value: dayjs(item.created).format("DD-MM-YYYY HH:mm")
      })),
      filteredValue: filteredInfo?.created || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.created.toString().startsWith(value),
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
          <SettingOutlined style={{ fontSize: 20 }} />
        </Dropdown>
      ),
      width: "8%"
    }
  ];
  const propsTable: TableProps<UserTypeDTO> = {
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
    rowSelection: rowSelection,
    dataSource: ListUserType?.data?.items,
    onChange: handleChange,
    loading: LoadingListUserType,
    pagination: {
      total: ListUserType?.data?.totalRecord,
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
        title={id ? "Chỉnh sửa chức vụ, chức danh" : "Thêm mới chức vụ, chức danh"}
        width={"600px"}
      >
        <NewAndUpdateUserType setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh sách chức vụ, chức danh </Typography.Title>
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
                  const result = await deleteListUserType({ idUserType: selectedRowKeys as string[] }).unwrap();
                  if (result.success) return setSelectedRowKeys([]);
                } catch (e: any) {
                  await HandleError(e);
                }
              }}
            >
              <Button
                danger
                type="primary"
                loading={isLoadingDeleteListUserType}
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
export const UserType = WithErrorBoundaryCustom(_UserType);

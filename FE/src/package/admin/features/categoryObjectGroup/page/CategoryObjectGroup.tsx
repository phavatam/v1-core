import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateCategoryObjectGroup } from "@admin/features/categoryObjectGroup";
import { CategoryObjectGroupDTO } from "@models/categoryObjectGroupDTO";
import {
  useDeleteCategoryObjectGroupMutation,
  useGetListCategoryObjectGroupQuery
} from "@API/services/CategoryObjectGroupApis.service";

function _CategoryObjectGroup() {
  const { data: ListCategoryObjectGroup, isLoading: LoadingListCategoryObjectGroup } =
    useGetListCategoryObjectGroupQuery({
      pageSize: 0,
      pageNumber: 0
    });
  const [deleteListCategoryObjectGroup, { isLoading: isLoadingDeleteListCategoryObjectGroup }] =
    useDeleteCategoryObjectGroupMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  // const handleChange: TableProps<CategoryObjectGroupDTO>["onChange"] = (pagination, filters) => {
  //   // pagination = pagination || {};
  //   setFilteredInfo(filters);
  // };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const { Text } = Typography;

  const menuAction = (record: CategoryObjectGroupDTO) => {
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
  const columns: ColumnsType<CategoryObjectGroupDTO> = [
    {
      title: "Tên nhóm đối tượng",
      dataIndex: "nameObjectGroup",
      key: "nameObjectGroup"
      // filters: ListCategoryObjectGroup?.listPayload?.map((item) => ({
      //   text: item.nameAssessmentType || "",
      //   value: item.nameAssessmentType || ""
      // })),
      // filteredValue: filteredInfo?.nameAssessmentType || null,
      // filterSearch: true,
      // onFilter: (value: string | number | boolean, record) =>
      //   (record.nameAssessmentType ?? "").includes(value as string),
      // render: (text) => text
    },
    {
      title: "Trạng thái Ẩn/Hiện",
      dataIndex: "isHide",
      key: "isHide",
      render: (text: boolean) => (text ? <Text type="success">Đang được bật</Text> : <Text type="danger">Đã ẩn</Text>)
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      // filters: ListCategoryObjectGroup?.listPayload?.map((item) => ({
      //   text: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm"),
      //   value: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm")
      // })),
      // filteredValue: filteredInfo?.createdDate || null,
      // filterSearch: true,
      // onFilter: (value: any, record) => record.createdDate.toString().startsWith(value),
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
  const propsTable: TableProps<CategoryObjectGroupDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      ellipsis: true,
      with: 150,
      ...item
    })),
    rowSelection: rowSelection,
    dataSource: ListCategoryObjectGroup?.listPayload,
    // onChange: handleChange,
    loading: LoadingListCategoryObjectGroup,
    pagination: {
      total: ListCategoryObjectGroup?.totalElement,
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
        <NewAndUpdateCategoryObjectGroup setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh mục nhóm đối tượng </Typography.Title>
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
                  const result = await deleteListCategoryObjectGroup({
                    idCategoryObjectGroup: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryObjectGroup}
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
export const CategoryObjectGroup = WithErrorBoundaryCustom(_CategoryObjectGroup);

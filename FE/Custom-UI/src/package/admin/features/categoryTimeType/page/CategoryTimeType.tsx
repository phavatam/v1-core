import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateCategoryTimeType } from "@admin/features/categoryTimeType";
import { CategoryTimeTypeDTO } from "@models/categoryTimeTypeDTO";
import {
  useDeleteCategoryTimeTypeMutation,
  useGetListCategoryTimeTypeQuery
} from "@API/services/CategoryTimeTypeApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
// import Search from "antd/es/input/Search";

function _CategoryTimeType() {
  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } = useGetListCategoryTimeTypeQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const [deleteListCategoryTimeType, { isLoading: isLoadingDeleteListCategoryTimeType }] =
    useDeleteCategoryTimeTypeMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<CategoryTimeTypeDTO>["onChange"] = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const { Text } = Typography;

  const menuAction = (record: CategoryTimeTypeDTO) => {
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
  const columns: ColumnsType<CategoryTimeTypeDTO> = [
    {
      title: "Tên loại thời gian",
      dataIndex: "timeTypeName",
      key: "timeTypeName",
      filters: ListCategoryTimeType?.listPayload?.map((item) => ({
        text: item.timeTypeName || "",
        value: item.timeTypeName || ""
      })),
      filteredValue: filteredInfo?.timeTypeName || null,
      filterSearch: true,
      width: 200,
      onFilter: (value: any, record) => (record.timeTypeName ? record.timeTypeName.startsWith(value) : false),
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Đơn vị",
      dataIndex: "idUnit",
      key: "idUnit",
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.idUnit || null,
      filterSearch: true,
      width: 200,
      onFilter: (value: any, record) => record.idUnit === value,
      render: (idUnit) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUnit?.listPayload?.find((x) => x.id === idUnit)?.unitName}
        </div>
      )
    },
    {
      title: "Ngày bắt đầu đánh giá",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY")
    },
    {
      title: "Ngày kết thúc đánh giá",
      dataIndex: "toDate",
      key: "toDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY")
    },
    // {
    //   title: "Trạng thái lặp lại",
    //   dataIndex: "isRepeat",
    //   key: "isRepeat",
    //   render: (text: boolean) => (text ? <Text type="success">Lặp lại</Text> : <Text type="danger">Không lặp lại</Text>)
    // },
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
  // const [triggerGetListFindCategoryTimeType, { data: listCategoryTimeTypexxx }] =
  //   useLazyFindCategoryTimeTypeQuery();

  // const onSearch = (value: string) => {
  //   triggerGetListFindCategoryTimeType({
  //     keyword: value || "",
  //     pageNumber: 0,
  //     pageSize: 0
  //   });
  //   console.log(value);
  // };

  const propsTable: TableProps<CategoryTimeTypeDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      width: 150,
      align: "center",
      ...item
    })),
    rowSelection: rowSelection,
    // dataSource: ListCategoryTimeType?.listPayload,
    dataSource: ListCategoryTimeType?.listPayload,

    onChange: handleChange,
    loading: LoadingListCategoryTimeType && LoadingListUnit,
    pagination: {
      total: ListCategoryTimeType?.totalElement,
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
        title={id ? "Chỉnh sửa  " : "Thêm mới"}
        width={"600px"}
      >
        <NewAndUpdateCategoryTimeType setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh mục kỳ đánh giá </Typography.Title>
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
                  const result = await deleteListCategoryTimeType({
                    idCategoryTimeType: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryTimeType}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<DeleteOutlined />}
              >
                Xóa {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>
            {/* <Search placeholder="Tìm kiếm..." onSearch={onSearch} enterButton /> */}
          </Space>
          <Card bordered={false} className="criclebox">
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const CategoryTimeType = WithErrorBoundaryCustom(_CategoryTimeType);

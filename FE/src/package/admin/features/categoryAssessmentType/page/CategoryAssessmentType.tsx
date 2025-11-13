import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateCategoryAssessmentType } from "@admin/features/categoryAssessmentType";
import { CategoryAssessmentTypeDTO } from "@models/categoryAssessmentTypeDTO";
import {
  useDeleteCategoryAssessmentTypeMutation,
  useGetListCategoryAssessmentTypeQuery
} from "@API/services/CategoryAssessmentTypeApis.service";
import { FilterValue } from "antd/es/table/interface";

function _CategoryAssessmentType() {
  const [pageSize, setPageSize] = useState<number>(7);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const { data: ListCategoryAssessmentType, isLoading: LoadingListCategoryAssessmentType } =
    useGetListCategoryAssessmentTypeQuery({
      pageSize,
      pageNumber
    });
  const [deleteListCategoryAssessmentType, { isLoading: isLoadingDeleteListCategoryAssessmentType }] =
    useDeleteCategoryAssessmentTypeMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<CategoryAssessmentTypeDTO>["onChange"] = (pagination, filters) => {
    // pagination = pagination || {};
    setFilteredInfo(filters);
    setPageSize(pagination.pageSize ?? pageSize);
    setPageNumber(pagination.current ?? pageNumber);
  };

  // const [triggerGetListFindCategoryAssessmentType, { data: listCategoryAssessmentTypexxx }] =
  //   useLazyFindCategoryAssessmentTypeQuery();
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const { Text } = Typography;
  // const onSearch = (value: string) => {
  //   triggerGetListFindCategoryAssessmentType({
  //     keyword: value || "",
  //     pageNumber: 0,
  //     pageSize: 0
  //   });
  //   console.log(value);
  // };
  const menuAction = (record: CategoryAssessmentTypeDTO) => {
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
  const columns: ColumnsType<CategoryAssessmentTypeDTO> = [
    {
      title: "Tên loại đánh giá",
      dataIndex: "nameAssessmentType",
      key: "nameAssessmentType",
      filters: ListCategoryAssessmentType?.listPayload?.map((item) => ({
        text: item.nameAssessmentType || "",
        value: item.nameAssessmentType || "" // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.nameAssessmentType || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.nameAssessmentType === value,
      render: (nameAssessmentType) => {
        const text = ListCategoryAssessmentType?.listPayload?.find(
          (x: { nameAssessmentType: any }) => x.nameAssessmentType === nameAssessmentType
        )?.nameAssessmentType;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
      },
      width: 350
      // render: (text: string) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Ưu điểm/Nhược điểm",
      dataIndex: "status",
      key: "status",
      render: (text: number) =>
        text == 1 ? (
          <Text type="success">Ưu điểm</Text>
        ) : text == 2 ? (
          <Text type="danger">Nhược điểm</Text>
        ) : (
          <Text type="danger">Không xác định được</Text>
        )
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
  const propsTable: TableProps<CategoryAssessmentTypeDTO> = {
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
    dataSource: ListCategoryAssessmentType?.listPayload,
    onChange: handleChange,
    loading: LoadingListCategoryAssessmentType,
    pagination: {
      total: ListCategoryAssessmentType?.totalElement,
      pageSize,
      current: pageNumber,
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
        <NewAndUpdateCategoryAssessmentType setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}>Danh mục ưu và nhược điểm đánh giá</Typography.Title>
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
                  const result = await deleteListCategoryAssessmentType({
                    idCategoryAssessmentType: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryAssessmentType}
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
export const CategoryAssessmentType = WithErrorBoundaryCustom(_CategoryAssessmentType);

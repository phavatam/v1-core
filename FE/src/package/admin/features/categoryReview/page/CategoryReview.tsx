import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { CategoryReviewDTO } from "@models/categoryReviewDTO";
import {
  useDeleteCategoryReviewMutation,
  useGetListCategoryReviewQuery
} from "@API/services/CategoryReviewApis.service";
import { FilterValue } from "antd/es/table/interface";
import { NewCategoryReview } from "@admin/features/categoryReview";

function _CategoryReview() {
  const [pageSize, setPageSize] = useState<number>(7);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const { data: ListCategoryReview, isLoading: LoadingListCategoryReview } = useGetListCategoryReviewQuery({
    pageSize,
    pageNumber
  });
  const [deleteListCategoryReview, { isLoading: isLoadingDeleteListCategoryReview }] =
    useDeleteCategoryReviewMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<CategoryReviewDTO>["onChange"] = (pagination, filters) => {
    // pagination = pagination || {};
    setFilteredInfo(filters);
    setPageSize(pagination.pageSize ?? pageSize);
    setPageNumber(pagination.current ?? pageNumber);
  };
  //console.log(ListCategoryReview);
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
  const menuAction = (record: CategoryReviewDTO) => {
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
  const columns: ColumnsType<CategoryReviewDTO> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (title) => {
        const text = ListCategoryReview?.listPayload?.find((x: { title: any }) => x.title === title)?.title;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
      }
    },
    {
      title: "Tên loại đánh giá",
      dataIndex: "nameReview",
      key: "nameReview",
      filters: ListCategoryReview?.listPayload?.map((item) => ({
        text: item.nameReview || "",
        value: item.nameReview || ""
      })),
      filteredValue: filteredInfo?.nameReview || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.nameReview === value,
      render: (nameReview) => {
        const text = ListCategoryReview?.listPayload?.find(
          (x: { nameReview: any }) => x.nameReview === nameReview
        )?.nameReview;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
      },
      width: 350
      // render: (text: string) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Trạng thái Ẩn/Hiện",
      dataIndex: "isHide",
      key: "isHide",
      render: (text: boolean) => (text ? <Text type="success">Đang được bật</Text> : <Text type="danger">Đã ẩn</Text>)
    },
    {
      title: "Số thứ tự",
      dataIndex: "sort",
      key: "sort",
      width: 100,
      render: (sort) => {
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{sort}</div>;
      }
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
      width: 90
    }
  ];
  const propsTable: TableProps<CategoryReviewDTO> = {
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
    dataSource: ListCategoryReview?.listPayload,
    onChange: handleChange,
    loading: LoadingListCategoryReview,
    pagination: {
      total: ListCategoryReview?.totalElement,
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
        <NewCategoryReview setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}>Danh mục nhận xét đánh giá</Typography.Title>
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
                  const result = await deleteListCategoryReview({
                    idCategoryReview: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryReview}
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
export const CategoryReview = WithErrorBoundaryCustom(_CategoryReview);

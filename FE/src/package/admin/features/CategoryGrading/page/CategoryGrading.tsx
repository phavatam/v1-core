import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateCategoryGrading } from "@admin/features/CategoryGrading";
import { CategoryGradingDTO } from "@models/CategoryGradingDTO";
import {
  useDeleteCategoryGradingMutation
  // useLazyFindCategoryGradingQuery
} from "@API/services/CategoryGrading.service";
import { useGetListCategoryGradingQuery } from "@API/services/CategoryGrading.service";
// import Search from "antd/es/input/Search";
// import { formatMoney } from "~/units";

function _CategoryGrading() {
  const { data: ListCategoryGrading, isLoading: LoadingListCategoryGrading } = useGetListCategoryGradingQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const [deleteListCategoryGrading, { isLoading: isLoadingDeleteListCategoryGrading }] =
    useDeleteCategoryGradingMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  // const handleChange: TableProps<CategoryGradingDTO>["onChange"] = (pagination, filters) => {
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
  const menuAction = (record: CategoryGradingDTO) => {
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
  const columns: ColumnsType<CategoryGradingDTO> = [
    {
      title: "Tên loại xếp loại đánh giá",
      dataIndex: "nameGrading",
      key: "nameGrading"
    },
    {
      title: "Từ",
      dataIndex: "fromValue",
      key: "fromValue",
      render: (text) => text + " điểm"
    },
    {
      title: "Đến",
      dataIndex: "toValue",
      key: "toValue",
      render: (text) => text + " điểm"
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (text) => (!text ? <Tag color={"error"}>Không hoạt động</Tag> : <Tag color={"success"}>Hoạt động</Tag>)
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY | HH:mm:ss")
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
  // const [triggerGetListFindCategoryGrading, { data: listCategoryGradingxxx }] =
  //   useLazyFindCategoryGradingQuery();
  const propsTable: TableProps<CategoryGradingDTO> = {
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
    // dataSource: ListCategoryGrading?.listPayload,
    dataSource: ListCategoryGrading?.listPayload,

    // onChange: handleChange,
    loading: LoadingListCategoryGrading,
    pagination: {
      total: ListCategoryGrading?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };

  // const onSearch = (value: string) => {
  //   triggerGetListFindCategoryGrading({
  //     keyword: value || "",
  //     pageNumber: 0,
  //     pageSize: 0
  //   });
  //   console.log(value);
  // };
  /////////////////////
  //#endregion
  return (
    <div className={"unit"}>
      <ModalContent
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        title={id ? "Chỉnh sửa  " : "Thêm mới"}
        width={"600px"}
      >
        <NewAndUpdateCategoryGrading setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh mục xếp loại đánh giá </Typography.Title>
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
                  const result = await deleteListCategoryGrading({
                    idCategoryGrading: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryGrading}
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
export const CategoryGrading = WithErrorBoundaryCustom(_CategoryGrading);

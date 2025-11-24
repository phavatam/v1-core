import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateCategoryCriteria } from "@admin/features/categoryCriteria";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";
import {
  useDeleteCategoryCriteriaMutation,
  useGetListCategoryCriteriaQuery
} from "@API/services/CategoryCriteriaApis.service";
import { useGetListTypeAssessmentQuery } from "@API/services/TypeAssessmentApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";

export function arrayToTreeTable(menuItems: CategoryCriteriaDTO[]) {
  const map = new Map<string, CategoryCriteriaDTO & { children: CategoryCriteriaDTO[] }>();

  // Đầu tiên, tạo một map với Id là khóa
  for (const item of menuItems) {
    map.set(item.id, { ...item, children: [] });
  }

  // Sau đó, duyệt qua các phần tử để xây dựng cây
  const menuTree: (CategoryCriteriaDTO & { children: CategoryCriteriaDTO[] })[] = [];
  for (const item of menuItems) {
    const menuItem = map.get(item.id);
    if (menuItem) {
      if (!item.idParent || !map.has(item.idParent)) {
        // Phần tử cấp cao nhất hoặc không có cha hợp lệ
        menuTree.push(menuItem);
      } else {
        // Phần tử con
        const parentItem = map.get(item.idParent);
        if (parentItem) {
          parentItem.children.push(menuItem);
        }
      }
    }
  }
  return menuTree;
}

export const renderTreeTable = (nodes: CategoryCriteriaDTO[]): any => {
  return nodes.map((node) => {
    const nodeData = {
      title: <Tag> {node.nameCriteria}</Tag>,
      id: node.id,
      sort: node.sort,
      value: node.id,
      key: node.id,
      nameCriteria: node.nameCriteria,
      idUnit: node.idUnit,
      idParent: node.idParent,
      status: node.status,
      idTypeAssessment: node.idTypeAssessment,
      createdDate: node.createdDate,
      isHide: node.isHide,
      isDistinct: node.isDistinct
    };

    if (node.children && node.children.length > 0) {
      return {
        ...nodeData,
        children: renderTreeTable(node.children)
      };
    }

    return nodeData;
  });
};

function _CategoryCriteria() {
  const { data: ListCategoryCriteria, isLoading: LoadingListCategoryCriteria } = useGetListCategoryCriteriaQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListTypeAssessment, isLoading: LoadingListTypeAssessment } = useGetListTypeAssessmentQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [deleteListCategoryCriteria, { isLoading: isLoadingDeleteListCategoryCriteria }] =
    useDeleteCategoryCriteriaMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<CategoryCriteriaDTO>["onChange"] = (pagination, filters) => {
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
  const data = arrayToTreeTable(ListCategoryCriteria?.listPayload ?? []);

  const { Text } = Typography;

  const menuAction = (record: CategoryCriteriaDTO) => {
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
  const columns: ColumnsType<CategoryCriteriaDTO> = [
    {
      title: "Tên tiêu chí",
      dataIndex: "nameCriteria",
      key: "nameCriteria",
      width: 560,
      align: "left",
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Thang điểm đánh giá",
      dataIndex: "idTypeAssessment",
      key: "idTypeAssessment",
      width: 160,
      render: (idTypeAssessment) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListTypeAssessment?.listPayload?.find((x) => x.id === idTypeAssessment)?.nameTypeAssessment}
        </div>
      )
    },
    {
      title: "Trạng thái Ẩn/Hiện",
      dataIndex: "isHide",
      key: "isHide",
      width: 130,
      render: (text: boolean) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {text ? <Text type="success">Đang được bật</Text> : <Text type="danger">Đã ẩn</Text>}
        </div>
      )
    },
    {
      title: "Số thứ tự",
      dataIndex: "sort",
      key: "sort",
      width: 80,
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Thuộc đơn vị",
      dataIndex: "idUnit",
      key: "idUnit",
      width: 80,
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.idUnit || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idUnit === value,
      render: (idUnit) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUnit?.listPayload?.find((x) => x.id === idUnit)?.unitName}
        </div>
      )
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{dayjs(text).format("DD-MM-YYYY HH:mm")}</div>
      )
    },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
          <SettingOutlined style={{ fontSize: 20, paddingRight: 8 }} />
        </Dropdown>
      ),
      width: "8%"
    }
  ];
  const propsTable: TableProps<CategoryCriteriaDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      width: 130,
      align: "center",
      ...item
    })),
    rowSelection: rowSelection,
    onChange: handleChange,
    loading: LoadingListCategoryCriteria && LoadingListTypeAssessment && LoadingListUnit,
    dataSource: renderTreeTable(data),
    pagination: false,
    size: "middle"
  };
  //#endregion
  return (
    <div className={"unit"}>
      <ModalContent
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        title={id ? "Chỉnh sửa  " : "Thêm mới"}
        width={"800px"}
      >
        <NewAndUpdateCategoryCriteria setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh mục tiêu chí đánh giá </Typography.Title>
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
                  const result = await deleteListCategoryCriteria({
                    idCategoryCriteria: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategoryCriteria}
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
export const CategoryCriteria = WithErrorBoundaryCustom(_CategoryCriteria);

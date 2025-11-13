import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateTypeAssessment } from "@admin/features/typeAssessment";
import { TypeAssessmentDTO } from "@models/typeAssessmentDTO";
import {
  useDeleteTypeAssessmentMutation,
  useGetListTypeAssessmentQuery
} from "@API/services/TypeAssessmentApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
// import Search from "antd/es/input/Search";

function _TypeAssessment() {
  const { data: ListTypeAssessment, isLoading: LoadingListTypeAssessment } = useGetListTypeAssessmentQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const [deleteListTypeAssessment, { isLoading: isLoadingDeleteListTypeAssessment }] =
    useDeleteTypeAssessmentMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);

  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<TypeAssessmentDTO>["onChange"] = (pagination, filters) => {
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
  // const [triggerGetListFindTypeAssessment, { data: listTypeAssessmentxxx }] =
  //   useLazyFindTypeAssessmentQuery();

  // const onSearch = (value: string) => {
  //   triggerGetListFindTypeAssessment({
  //     keyword: value || "",
  //     pageNumber: 0,
  //     pageSize: 0
  //   });
  //   console.log(value);
  // };

  const menuAction = (record: TypeAssessmentDTO) => {
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
  const columns: ColumnsType<TypeAssessmentDTO> = [
    {
      title: "Tên thang điểm đánh giá",
      dataIndex: "nameTypeAssessment",
      key: "nameTypeAssessment",
      filters: ListTypeAssessment?.listPayload?.map((item) => ({
        text: item.nameTypeAssessment,
        value: item.nameTypeAssessment // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.nameTypeAssessment || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.nameTypeAssessment === value,
      render: (nameTypeAssessment) =>
        ListTypeAssessment?.listPayload?.find((x) => x.nameTypeAssessment === nameTypeAssessment)?.nameTypeAssessment
    },
    {
      title: "Thuộc đơn vị",
      dataIndex: "idUnit",
      key: "idUnit",
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.idUnit || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idUnit === value,
      render: (idUnit) => ListUnit?.listPayload?.find((x) => x.id === idUnit)?.unitName
    },
    {
      title: "Số điểm tối thiểu",
      dataIndex: "startValue",
      key: "startValue"
    },
    {
      title: "Số điểm tối đa",
      dataIndex: "endValue",
      key: "endValue"
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
  const propsTable: TableProps<TypeAssessmentDTO> = {
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
    dataSource: ListTypeAssessment?.listPayload,
    onChange: handleChange,
    loading: LoadingListTypeAssessment && LoadingListUnit,
    pagination: {
      total: ListTypeAssessment?.totalElement,
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
        <NewAndUpdateTypeAssessment setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh mục thang điểm đánh giá</Typography.Title>
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
                  const result = await deleteListTypeAssessment({
                    idTypeAssessment: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListTypeAssessment}
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
export const TypeAssessment = WithErrorBoundaryCustom(_TypeAssessment);

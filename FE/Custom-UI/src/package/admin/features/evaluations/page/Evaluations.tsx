import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FieldTimeOutlined,
  FundViewOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import {
  AddCategoryTimeTypeToEvaluations,
  DetailsAndSortingEvaluationsCriteria,
  NewAndUpdateCriteriaOfEvaluations,
  NewAndUpdateCriteriaOfListEvaluations,
  NewEvaluations,
  UpdateEvaluations
} from "@admin/features/evaluations";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import { useDeleteEvaluationsMutation, useGetListEvaluationsQuery } from "@API/services/EvaluationsApis.service";
import { useLazyGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery } from "@API/services/EvaluationsCriteriaApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import { NewAndUpdateCategoryTimeType } from "@admin/features/categoryTimeType";
import { useGetListUnitQuery } from "~/API/services/UnitApis.service";

function _Evaluations() {
  const { data: ListEvaluations, isLoading: LoadingListEvaluations } = useGetListEvaluationsQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } =
    useGetListCategoryTimeTypeAvailableQuery({
      pageNumber: 0,
      pageSize: 0
    });
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const [deleteListEvaluations, { isLoading: isLoadingDeleteListEvaluations }] = useDeleteEvaluationsMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState<boolean>(false);
  const [isOpenNewAndUpdateCriteriaOfEvaluations, setIsOpenNewAndUpdateCriteriaOfEvaluations] =
    useState<boolean>(false);
  const [isOpenNewAndUpdateCriteriaOfListEvaluations, setIsOpenNewAndUpdateCriteriaOfListEvaluations] =
    useState<boolean>(false);
  const [isOpenModalNewAndUpdateCategoryTimeType, setIsOpenModalNewAndUpdateCategoryTimeType] =
    useState<boolean>(false);
  const [isOpenDetailsAndSortingEvaluationsCriteria, setIsOpenDetailsAndSortingEvaluationsCriteria] =
    useState<boolean>(false);
  const [isOpenModalAddCategoryTimeTypeToEvaluations, setIsOpenModalAddCategoryTimeTypeToEvaluations] =
    useState<boolean>(false);

  const [id, setId] = useState<string | undefined>(undefined);
  const [ids, setIds] = useState<string[] | []>([]);

  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<EvaluationsDTO>["onChange"] = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const [refetchListCriteriaOfEvaluationsCriteriaByIdEvaluations] =
    useLazyGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery();

  const onConfirmOpenModalNewCriteria = (listIdEvaluations: string[]) => {
    setIds(listIdEvaluations);
    setIsOpenNewAndUpdateCriteriaOfListEvaluations(true);
    setSelectedRowKeys([]);
  };

  const onConfirmOpenModalAddCategoryTimeTypeToEvaluations = (listIdEvaluations: string[]) => {
    setIds(listIdEvaluations);
    setIsOpenModalAddCategoryTimeTypeToEvaluations(true);
    setSelectedRowKeys([]);
  };

  const menuAction = (record: EvaluationsDTO) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<EditOutlined />}
          onClick={() => {
            setId(record.id);
            setIsOpenModalUpdate(true);
          }}
        >
          Chỉnh sửa
        </Menu.Item>

        <Menu.Item
          key="2"
          icon={<PlusCircleOutlined />}
          onClick={() => {
            setId(record.id);
            setIsOpenNewAndUpdateCriteriaOfEvaluations(true);
          }}
        >
          Quản lý tiêu chí
        </Menu.Item>
      </Menu>
    );
  };
  const columns: ColumnsType<EvaluationsDTO> = [
    {
      title: "Tên phiếu đánh giá",
      dataIndex: "nameEvaluations",
      key: "nameEvaluations",
      width: 250,
      fixed: "left",
      filters: ListEvaluations?.listPayload?.map((item) => ({
        text: item.nameEvaluations || "",
        value: item.nameEvaluations || "" // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.nameEvaluations || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.nameEvaluations === value,
      render: (nameAssessmentType) => {
        const text = ListEvaluations?.listPayload?.find(
          (x) => x.nameEvaluations === nameAssessmentType
        )?.nameEvaluations;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
      }
    },
    {
      title: "Đơn vị sử dụng",
      dataIndex: "idUnit",
      key: "idUnit",
      width: 250,
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.idUnit || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idUnit === value,
      render: (idUnit) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUnit?.listPayload?.find((item) => item.id === idUnit)?.unitName}
        </div>
      )
    },
    {
      title: "Tên loại thời gian đánh giá",
      dataIndex: "idCategoryTimeType",
      key: "idCategoryTimeType",
      filters: ListCategoryTimeType?.listPayload?.map((item) => ({
        text: item.timeTypeName || "",
        value: item.id || "" // sử dụng id thay vì unitName
      })),
      filteredValue: filteredInfo?.idCategoryTimeType || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idCategoryTimeType === value,
      render: (idCategoryTimeType) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {idCategoryTimeType === null
            ? null
            : ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.timeTypeName}
        </div>
      ),
      width: 200
    },
    {
      title: "Ngày bắt đầu đánh giá",
      dataIndex: "idCategoryTimeType",
      key: "idCategoryTimeType",
      width: 200,
      render: (idCategoryTimeType) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {idCategoryTimeType === null
            ? null
            : dayjs(ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.fromDate).format(
                "DD-MM-YYYY"
              )}
        </div>
      )
    },
    {
      title: "Ngày kết thúc đánh giá",
      dataIndex: "idCategoryTimeType",
      key: "idCategoryTimeType",
      width: 200,
      render: (idCategoryTimeType) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {idCategoryTimeType === null
            ? null
            : dayjs(ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.toDate).format(
                "DD-MM-YYYY"
              )}
        </div>
      )
    },
    {
      title: "Chi tiết",
      render: (_, record) => (
        <Button
          type="link"
          icon={<FundViewOutlined />}
          onClick={() => {
            setId(record.id);
            setIsOpenDetailsAndSortingEvaluationsCriteria(true);
          }}
        >
          Xem chi tiết Tiêu chí
        </Button>
      ),
      width: 250
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdDate",
    //   key: "createdDate",
    //   render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    // },
    {
      title: "Hiệu chỉnh",
      dataIndex: "Action",
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
  const propsTable: TableProps<EvaluationsDTO> = {
    scroll: {
      x: 1500
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      width: 150,
      align: "center",
      ...item
    })),
    onChange: handleChange,
    rowSelection: rowSelection,
    dataSource: ListEvaluations?.listPayload,
    loading: LoadingListEvaluations && LoadingListCategoryTimeType && LoadingListUnit,
    pagination: {
      total: ListEvaluations?.totalElement,
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
        title={id ? "Chỉnh sửa" : "Thêm mới phiếu đánh giá"}
        width={"800px"}
      >
        <NewEvaluations setVisible={setIsOpenModal} id={id} />
      </ModalContent>

      <ModalContent
        visible={isOpenModalUpdate}
        setVisible={setIsOpenModalUpdate}
        title={id ? "Chỉnh sửa phiếu đánh giá" : "Thêm mới"}
        width={"800px"}
      >
        <UpdateEvaluations setVisible={setIsOpenModalUpdate} id={id} />
      </ModalContent>

      <ModalContent
        visible={isOpenNewAndUpdateCriteriaOfEvaluations}
        setVisible={setIsOpenNewAndUpdateCriteriaOfEvaluations}
        title={id ? "Thêm và sửa Tiêu chí" : "Thêm mới Tiêu chí"}
        width={"1500px"}
      >
        <NewAndUpdateCriteriaOfEvaluations
          setVisible={setIsOpenNewAndUpdateCriteriaOfEvaluations}
          idEvaluations={id}
          refetchDetailsAndSortingEvaluationsCriteria={(idEvaluations) => {
            refetchListCriteriaOfEvaluationsCriteriaByIdEvaluations({ idEvaluations });
          }}
        />
      </ModalContent>

      <ModalContent
        visible={isOpenNewAndUpdateCriteriaOfListEvaluations}
        setVisible={setIsOpenNewAndUpdateCriteriaOfListEvaluations}
        title={
          id ? "Thêm và sửa Tiêu chí theo danh sách Phiếu đánh giá" : "Thêm mới Tiêu chí cho danh sách Phiếu đánh giá"
        }
        width={"1500px"}
      >
        <NewAndUpdateCriteriaOfListEvaluations
          setVisible={setIsOpenNewAndUpdateCriteriaOfListEvaluations}
          idsEvaluations={ids}
        />
      </ModalContent>

      <ModalContent
        visible={isOpenDetailsAndSortingEvaluationsCriteria}
        setVisible={setIsOpenDetailsAndSortingEvaluationsCriteria}
        title={"Xem chi tiết và sắp xếp tiêu chí"}
        width={"1500px"}
      >
        <DetailsAndSortingEvaluationsCriteria
          setVisible={setIsOpenDetailsAndSortingEvaluationsCriteria}
          idEvaluations={id}
        />
      </ModalContent>

      <ModalContent
        visible={isOpenModalNewAndUpdateCategoryTimeType}
        setVisible={setIsOpenModalNewAndUpdateCategoryTimeType}
        title={id ? "Chỉnh sửa kỳ đánh giá" : "Thêm mới kỳ đánh giá"}
        width={"600px"}
      >
        <NewAndUpdateCategoryTimeType setVisible={setIsOpenModalNewAndUpdateCategoryTimeType} id={undefined} />
      </ModalContent>

      <ModalContent
        visible={isOpenModalAddCategoryTimeTypeToEvaluations}
        setVisible={setIsOpenModalAddCategoryTimeTypeToEvaluations}
        title={id ? "Chỉnh sửa kỳ đánh giá" : "Thêm mới kỳ đánh giá"}
        width={"800px"}
      >
        <AddCategoryTimeTypeToEvaluations
          setVisible={setIsOpenModalAddCategoryTimeTypeToEvaluations}
          listIdEvaluations={ids}
        />
      </ModalContent>

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Quản lý Phiếu đánh giá </Typography.Title>
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
              Thêm mới phiếu đánh giá
            </Button>
            <Button
              onClick={() => {
                setIsOpenModalNewAndUpdateCategoryTimeType(true);
              }}
              icon={<FieldTimeOutlined />}
              type="primary"
            >
              Thêm mới Kỳ đánh giá
            </Button>

            <Popconfirm
              title="Bạn có chắc chắn muốn thêm tiêu chí cho các mục này không ?"
              okText="Có"
              cancelText="Không"
              disabled={!(selectedRowKeys.length > 0)}
              onConfirm={() => {
                onConfirmOpenModalNewCriteria(selectedRowKeys as string[]);
              }}
            >
              <Button
                style={selectedRowKeys.length > 0 ? { backgroundColor: "#4CAF50", color: "#fff" } : undefined} // Thay đổi màu nền và màu chữ
                type="primary"
                loading={isLoadingDeleteListEvaluations}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<SettingOutlined />}
              >
                Thiết lập tiêu chí cho {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Bạn có chắc chắn muốn thêm kỳ đánh giá cho các mục này không ?"
              okText="Có"
              cancelText="Không"
              disabled={!(selectedRowKeys.length > 0)}
              onConfirm={() => {
                onConfirmOpenModalAddCategoryTimeTypeToEvaluations(selectedRowKeys as string[]);
              }}
            >
              <Button
                style={selectedRowKeys.length > 0 ? { backgroundColor: "#4c8caf", color: "#fff" } : undefined} // Thay đổi màu nền và màu chữ
                type="primary"
                loading={isLoadingDeleteListEvaluations}
                disabled={!(selectedRowKeys.length > 0)}
                icon={<SettingOutlined />}
              >
                Thiết lập kỳ đánh giá cho {selectedRowKeys.length} mục
              </Button>
            </Popconfirm>

            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              disabled={!(selectedRowKeys.length > 0)}
              onConfirm={async () => {
                try {
                  const result = await deleteListEvaluations({
                    idEvaluations: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListEvaluations}
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
export const Evaluations = WithErrorBoundaryCustom(_Evaluations);

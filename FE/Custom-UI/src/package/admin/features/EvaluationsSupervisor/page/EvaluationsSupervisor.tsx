import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { HandleError, ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { NewAndUpdateEvaluationsSupervisor } from "@admin/features/EvaluationsSupervisor";
import {
  useDeleteEvaluationsSupervisorMutation,
  useGetListEvaluationsSupervisorQuery
} from "@API/services/EvaluationsSupervisorApis.service";
import { useGetListEvaluationsQuery } from "@API/services/EvaluationsApis.service";
import { useGetListCategoryTimeTypeQuery } from "@API/services/CategoryTimeTypeApis.service";
import { useGetListUnitQuery } from "@API/services/UnitApis.service";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import { FilterValue } from "antd/es/table/interface";

function _EvaluationsSupervisor() {
  const { data: ListEvaluationsSupervisor, isLoading: LoadingListEvaluationsSupervisor } =
    useGetListEvaluationsSupervisorQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const [deleteListEvaluationsSupervisor, { isLoading: isLoadingDeleteListEvaluationsSupervisor }] =
    useDeleteEvaluationsSupervisorMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [idEvaluations, setIdEvaluations] = useState<string | undefined>(undefined);

  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<EvaluationsDTO>["onChange"] = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
  };

  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data: ListEvaluations } = useGetListEvaluationsQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } = useGetListCategoryTimeTypeQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const handleOpenNewAndUpdateEvaluationsSupervisor = (idEvaluations: string) => {
    setIdEvaluations(idEvaluations);
    setIsOpenModal(true);
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

  const columns: ColumnsType<EvaluationsDTO> = [
    {
      title: "Tên phiếu đánh giá",
      dataIndex: "nameEvaluations",
      key: "nameEvaluations",
      width: 250,
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
          {ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.timeTypeName}
        </div>
      ),
      width: 350
    },
    {
      title: "Ngày bắt đầu đánh giá",
      dataIndex: "idCategoryTimeType",
      key: "idCategoryTimeType",
      render: (idCategoryTimeType) =>
        dayjs(ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.fromDate).format(
          "DD-MM-YYYY"
        )
    },
    {
      title: "Ngày kết thúc đánh giá",
      dataIndex: "idCategoryTimeType",
      key: "idCategoryTimeType",
      render: (idCategoryTimeType) =>
        dayjs(ListCategoryTimeType?.listPayload?.find((x) => x.id === idCategoryTimeType)?.toDate).format("DD-MM-YYYY")
    },
    {
      title: "Tổng số giám sát viên",
      dataIndex: "id",
      key: "id",
      render: (idEvaluations) => {
        const evaluationsSupervisor = ListEvaluationsSupervisor?.listPayload?.filter(
          (x) => x.idEvaluations === idEvaluations
        );
        return evaluationsSupervisor?.length;
      }
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: (item, record) => (
        <Button
          type="primary"
          size="middle"
          icon={<PlusCircleOutlined />}
          onClick={() => handleOpenNewAndUpdateEvaluationsSupervisor(record.id)}
        >
          Quản lý giám sát viên
        </Button>
      )
    }
  ];

  const propsTable: TableProps<EvaluationsDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      align: "center",
      width: 150,
      ...item
    })),
    rowSelection: rowSelection,
    onChange: handleChange,
    loading: LoadingListEvaluationsSupervisor && LoadingListCategoryTimeType && LoadingListUnit,
    dataSource: ListEvaluations?.listPayload,
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
        title={id ? "Chỉnh sửa" : "Thêm mới"}
        width={"1400px"}
      >
        <NewAndUpdateEvaluationsSupervisor setVisible={setIsOpenModal} idEvaluations={idEvaluations} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}>Quản lý cấp phê duyệt đánh giá </Typography.Title>
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
                  const result = await deleteListEvaluationsSupervisor({
                    idEvaluationsSupervisor: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListEvaluationsSupervisor}
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
export const EvaluationsSupervisor = WithErrorBoundaryCustom(_EvaluationsSupervisor);

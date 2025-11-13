import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Row, Space, TableProps, Typography } from "antd";
import { FundViewOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { DetailReviewHistory } from "@admin/features/reviewHistory";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import { useGetListEvaluationsQuery,useGetEvaluationsByIdQuery } from "@API/services/EvaluationsApis.service";
// import { useLazyGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery } from "@API/services/EvaluationsCriteriaApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import { NewAndUpdateCategoryTimeType } from "@admin/features/categoryTimeType";

function _ReviewHistory() {
  const { data: ListEvaluations, isLoading: LoadingListEvaluations } = useGetListEvaluationsQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } =
    useGetListCategoryTimeTypeAvailableQuery({
      pageNumber: 0,
      pageSize: 0
    });
    //const { data: ListEvaluationsId, isLoading: LoadingListEvaluationsId } = useGetEvaluationsByIdQuery();
  // const [deleteListEvaluations, { isLoading: isLoadingDeleteListEvaluations }] = useDeleteEvaluationsMutation();
  useState<boolean>(false);
  const [isOpenModalNewAndUpdateCategoryTimeType, setIsOpenModalNewAndUpdateCategoryTimeType] =
    useState<boolean>(false);
  const [isOpenDetailsAndSortingEvaluationsCriteria, setIsOpenDetailsAndSortingEvaluationsCriteria] =
    useState<boolean>(false);

  const [id, setId] = useState<string | undefined>(undefined);
  const [nameById, setNameById] = useState<string | null>("");

  //#region Table config
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<EvaluationsDTO>["onChange"] = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
  };

  // const menuAction = (record: EvaluationsDTO) => {
  //   return (
  //     <Menu>
  //       <Menu.Item
  //         key="1"
  //         icon={<EditOutlined />}
  //         onClick={() => {
  //           setId(record.id);
  //           setIsOpenModalUpdate(true);
  //         }}
  //       >
  //         Chỉnh sửa
  //       </Menu.Item>
  //
  //       <Menu.Item
  //         key="2"
  //         icon={<PlusCircleOutlined />}
  //         onClick={() => {
  //           setId(record.id);
  //           setIsOpenNewAndUpdateCriteriaOfEvaluations(true);
  //         }}
  //       >
  //         Quản lý tiêu chí
  //       </Menu.Item>
  //     </Menu>
  //   );
  // };
  const columns: ColumnsType<EvaluationsDTO> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 50
    },
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
            setNameById(record.nameEvaluations);
            setIsOpenDetailsAndSortingEvaluationsCriteria(true);
          }}
        >
          Xem chi tiết phiếu
        </Button>
      ),
      width: 250
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    }
    // {
    //   title: "Hiệu chỉnh",
    //   dataIndex: "Action",
    //   key: "Action",
    //   fixed: "right",
    //   render: (_, record) => (
    //     <Dropdown overlay={menuAction(record)} trigger={["click"]} placement={"bottomCenter"}>
    //       <SettingOutlined style={{ fontSize: 20, paddingRight: 8 }} />
    //     </Dropdown>
    //   ),
    //   width: "8%"
    // }
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
    //rowSelection: rowSelection,
    dataSource: ListEvaluations?.listPayload,
    loading: LoadingListEvaluations && LoadingListCategoryTimeType,
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
        visible={isOpenDetailsAndSortingEvaluationsCriteria}
        setVisible={setIsOpenDetailsAndSortingEvaluationsCriteria}
        title={nameById ? nameById : ""}
        width={"1500px"}
      >
        <DetailReviewHistory setVisible={setIsOpenDetailsAndSortingEvaluationsCriteria} idEvaluations={id} />
      </ModalContent>

      <ModalContent
        visible={isOpenModalNewAndUpdateCategoryTimeType}
        setVisible={setIsOpenModalNewAndUpdateCategoryTimeType}
        title={id ? "Chỉnh sửa kỳ đánh giá" : "Thêm mới kỳ đánh giá"}
        width={"600px"}
      >
        <NewAndUpdateCategoryTimeType setVisible={setIsOpenModalNewAndUpdateCategoryTimeType} id={undefined} />
      </ModalContent>

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Lịch sử phiếu đánh giá </Typography.Title>
          <Divider />
          <Space
            style={{
              marginBottom: 16
            }}
            wrap
          ></Space>
          <Card bordered={false} className="criclebox">
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const ReviewHistory = WithErrorBoundaryCustom(_ReviewHistory);

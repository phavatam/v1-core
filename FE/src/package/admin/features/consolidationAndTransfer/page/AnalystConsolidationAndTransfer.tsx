import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Modal, Row, Spin, TableProps, Tabs, Typography } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import { downloadAnalystExportFileAPI, useGetListEvaluationsQuery } from "@API/services/EvaluationsApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import TabPane from "antd/lib/tabs/TabPane";
import { useGetListUnitQuery } from "@API/services/UnitApis.service";
import { HandleError } from "@admin/components";

function _AnalystConsolidationAndTransfer() {
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

  const [id, setId] = useState<string | undefined>(undefined);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isOpenModalConsolidationAndTransfer, setIsOpenModalConsolidationAndTransfer] = useState(false);
  const buttonData: any = {
    word: [{ id: 1, numberTemplate: 1, label: "Word - Báo cáo xếp loại tổng hợp" }],
    pdf: [{ id: 6, numberTemplate: 2, label: "PDF - Báo cáo xếp loại tổng hợp" }],
    excel: [{ id: 12, numberTemplate: 3, label: "Excel - Tổng hợp kết quả đơn vị" }]
  };

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

  const handleOpenModalConsolidationAndTransfer = (id: string) => {
    setIsOpenModalConsolidationAndTransfer(true);
    setId(id);
  };

  const filteredDataSource = ListEvaluations?.listPayload?.filter((item) => item.status === 1) || [];

  const renderButtons = (type: string, downloadFunction: any) => {
    return buttonData[type].map((button: any) => (
      <Button
        key={button.id}
        type="link"
        icon={<DownloadOutlined />}
        style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
        onClick={() => downloadFunction(button.numberTemplate)}
      >
        {button.label}
      </Button>
    ));
  };

  const downloadAnalystExportFile = async (numberTemplate: number) => {
    setLoadingButton(true);
    try {
      const res = await downloadAnalystExportFileAPI({
        idEvaluations: id!,
        numberTemplate: numberTemplate!
      });

      if (res.data.size === 0) {
        alert("Mẫu đánh giá phải gửi cấp phê duyệt mới được in ấn.");
        setLoadingButton(false);
        return;
      }

      if (numberTemplate === 2) {
        const data = res?.data as Blob;
        const file = new Blob([data], { type: "application/pdf" });
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        window.URL.revokeObjectURL(fileURL);
      } else {
        const data = res?.data as Blob;
        const file = new Blob([data]);
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(file);
        if (numberTemplate === 1) {
          a.download = `Report.docx`;
        } else if (numberTemplate === 3) {
          a.download = `Report.xlsx`;
        }
        a.click();
      }
      setLoadingButton(false);
    } catch (e: any) {
      setLoadingButton(false);
      await HandleError(e);
    }
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
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName,
        value: item.id
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
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      width: 200,
      render: (item, record) => (
        <>
          <Button
            onClick={() => handleOpenModalConsolidationAndTransfer(record.id)}
            type="primary"
            size="middle"
            icon={<EyeOutlined />}
          >
            Xem thống kê
          </Button>
        </>
      )
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
    dataSource: filteredDataSource,
    loading: LoadingListEvaluations && LoadingListCategoryTimeType && LoadingListUnit,
    pagination: {
      total: filteredDataSource?.length,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };

  return (
    <div className={"analystConsolidationAndTransfer"}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}>Thống kê tổng hợp và chuyển </Typography.Title>
          <Divider />

          <Card bordered={false} className="criclebox">
            {/*<Search
              placeholder="Tìm kiếm phiếu đánh giá"
              enterButton
              style={{
                width: "30%",
                marginBottom: 15
              }}
              size={"middle"}
            />*/}
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>

        <Modal
          title="Thống kê tổng hợp"
          open={isOpenModalConsolidationAndTransfer}
          onCancel={() => {
            setIsOpenModalConsolidationAndTransfer(false);
          }}
          cancelText={"Hủy"}
          footer={null}
        >
          <p>Chọn mẫu xem thích hợp</p>
          <Tabs defaultActiveKey="1">
            {/* Tab Word */}
            <TabPane tab="Word" key="1">
              {loadingButton ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <div>{renderButtons("word", downloadAnalystExportFile)}</div>
              )}
            </TabPane>

            {/* Tab PDF */}
            <TabPane tab="PDF" key="2">
              {loadingButton ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <div>{renderButtons("pdf", downloadAnalystExportFile)}</div>
              )}
            </TabPane>

            {/* Tab Excel */}
            <TabPane tab="Excel" key="3">
              {loadingButton ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <div>{renderButtons("excel", downloadAnalystExportFile)}</div>
              )}
            </TabPane>
          </Tabs>
        </Modal>
      </Row>
    </div>
  );
}
export const AnalystConsolidationAndTransfer = WithErrorBoundaryCustom(_AnalystConsolidationAndTransfer);

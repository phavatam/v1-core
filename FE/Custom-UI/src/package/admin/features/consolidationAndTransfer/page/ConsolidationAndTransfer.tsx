import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import React, { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Alert, Button, Card, Col, Divider, Modal, Row, Space, Spin, TableProps, Tabs, Tag, Typography } from "antd";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  FileWordOutlined,
  InboxOutlined,
  RetweetOutlined,
  RightCircleFilled
} from "@ant-design/icons";
import dayjs from "dayjs";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { EvaluationsDTO } from "@models/evaluationsDTO";
import {
  ExportWordSample,
  useConfirmConsolidationAndTransferEvaluationsMutation,
  useGetListEvaluationsConsolidationAndTransferQuery
} from "@API/services/EvaluationsApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import TabPane from "antd/lib/tabs/TabPane";
import Dragger from "antd/es/upload/Dragger";
import { listItemBeforeStyle, listItemStyle, listStyle } from "@admin/features/evaluations";
import { HandleError } from "@admin/components";
import { useGetListUnitQuery } from "@API/services/UnitApis.service";

function _ConsolidationAndTransfer() {
  const { data: ListEvaluations, isLoading: LoadingListEvaluations } =
    useGetListEvaluationsConsolidationAndTransferQuery({
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

  const [confirmConsolidationAndTransferEvaluations, { isLoading: LoadingConfirmConsolidationAndTransferEvaluations }] =
    useConfirmConsolidationAndTransferEvaluationsMutation();

  const [id, setId] = useState<string | undefined>(undefined);
  const [loadingButton, setLoadingButton] = useState(false);
  const [isOpenModalConsolidationAndTransfer, setIsOpenModalConsolidationAndTransfer] = useState(false);
  const [fileWordUpload, setFileWordUpload] = useState<File | null>(null);
  const [fileElectronicSignature, setFileElectronicSignature] = useState<File | null>(null);

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

  const handleOpenModalConsolidationAndTransfer = (id: string) => {
    setIsOpenModalConsolidationAndTransfer(true);
    setId(id);
  };

  const handleShowMessageStatus = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="red">Chưa tổng hợp và chuyển</Tag>;
      case 1:
        return <Tag color="yellow">Đã tổng hợp và chuyển </Tag>;
      default:
        return <Tag color="red">Chưa tổng hợp và chuyển</Tag>;
    }
  };

  const handleDownloadWordSample = async () => {
    setLoadingButton(true);
    try {
      const res = await ExportWordSample({
        idEvaluations: id!
      });
      if (res.data.size === 0) {
        alert("Phiếu này hiện tại chưa thể Tổng hợp và chuyển.");
        setLoadingButton(false);
        return;
      }
      const data = res?.data as Blob;
      const file = new Blob([data]);

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(file);

      a.download = `BaoCaoMau.docx`;

      a.click();

      setLoadingButton(false);
    } catch (e: any) {
      setLoadingButton(false);

      await HandleError(e);
    }
  };

  const handleConfirm = async () => {
    setLoadingButton(true);

    if (fileWordUpload === null || fileWordUpload === undefined) {
      alert("Vui lòng chọn file Báo Cáo Word cần tổng hợp và chuyển.");
      setLoadingButton(false);
      return false;
    } else if (fileElectronicSignature === null || fileElectronicSignature === undefined) {
      alert("Vui lòng chọn file Chữ Chữ Số cần tổng hợp và chuyển.");
      setLoadingButton(false);
      return false;
    }

    const fileWordUploadSizeMB = fileWordUpload.size / (1024 * 1024);
    const fileESUploadSizeMB = fileElectronicSignature.size / (1024 * 1024);

    if (fileWordUploadSizeMB > 10 || fileESUploadSizeMB > 10) {
      alert("Dung lượng tệp tin quá lớn, vui lòng chọn tệp tin khác");
      setLoadingButton(false);
      return false;
    }

    try {
      const result = await confirmConsolidationAndTransferEvaluations({
        idEvaluations: id || "",
        fileWord: fileWordUpload,
        fileES: fileElectronicSignature
      }).unwrap();
      if (result.success) {
        setIsOpenModalConsolidationAndTransfer(false);
        setLoadingButton(false);
      } else {
        setLoadingButton(false);
      }
    } catch (error: any) {
      setLoadingButton(false);
      await HandleError(error);
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
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      render: (status: number, record) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{handleShowMessageStatus(status)}</div>
      )
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      width: 200,
      render: (item, record) => (
        <Button
          onClick={() => handleOpenModalConsolidationAndTransfer(record.id)}
          type="primary"
          size="middle"
          icon={<RightCircleFilled />}
          disabled={record.status !== 0}
        >
          Tổng hợp và chuyển
        </Button>
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
    dataSource: ListEvaluations?.listPayload,
    loading:
      LoadingListEvaluations &&
      LoadingListCategoryTimeType &&
      LoadingConfirmConsolidationAndTransferEvaluations &&
      LoadingListUnit,
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
    <div className={"consolidationAndTransfer"}>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Tổng hợp và chuyển </Typography.Title>
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
          open={isOpenModalConsolidationAndTransfer}
          onCancel={() => {
            setIsOpenModalConsolidationAndTransfer(false);
          }}
          cancelText={"Hủy"}
          footer={null}
          width={800}
        >
          <Tabs defaultActiveKey="1">
            {/* Tab Word */}
            <TabPane tab="Tổng hợp và chuyển" key="1">
              <Alert
                message="Lưu ý"
                description={
                  <ul style={listStyle}>
                    <li style={listItemStyle}>
                      <span style={listItemBeforeStyle}>- </span>Vui lòng tải &quot;Tệp báo cáo word mẫu&quot; để điền
                      dữ liệu cần thiết trước khi tải Báo cáo lên hệ thống.
                    </li>
                  </ul>
                }
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />
              {loadingButton ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <Row gutter={16}>
                    <Col
                      span={12}
                      style={{
                        marginBottom: 20
                      }}
                    >
                      <Dragger
                        multiple={false}
                        maxCount={1}
                        accept=".doc,.docx"
                        beforeUpload={(fileWord) => {
                          setFileWordUpload(fileWord);
                          return false;
                        }}
                      >
                        {" "}
                        <p className="ant-upload-drag-icon">
                          <FileWordOutlined />
                        </p>
                        <p className="ant-upload-text">Nhấn hoặc kéo thả tệp BÁO CÁO WORD vào đây</p>
                        <p className="ant-upload-hint">
                          Chỉ cho phép tải lên một tệp duy nhất. Không được phép tải lên các tệp tin bị cấm.
                        </p>
                      </Dragger>
                    </Col>
                    <Col
                      span={12}
                      style={{
                        marginBottom: 20
                      }}
                    >
                      <Dragger
                        multiple={false}
                        accept=".pem"
                        maxCount={1}
                        beforeUpload={(fileES) => {
                          setFileElectronicSignature(fileES);
                          return false;
                        }}
                      >
                        {" "}
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Nhấn hoặc kéo thả tệp CHỮ KÝ SỐ vào đây</p>
                        <p className="ant-upload-hint">
                          Chỉ cho phép tải lên một tệp duy nhất. Không được phép tải lên các tệp tin bị cấm.
                        </p>
                      </Dragger>
                    </Col>

                    <Divider />
                    <Col span={24}>
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "flex-end"
                        }}
                      >
                        <Button
                          type="default"
                          htmlType="reset"
                          icon={<RetweetOutlined />}
                          loading={loadingButton}
                          onClick={() => {
                            setIsOpenModalConsolidationAndTransfer(false);
                          }}
                        >
                          Hủy bỏ thao tác
                        </Button>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<CheckCircleOutlined />}
                          style={{
                            float: "right"
                          }}
                          onClick={handleConfirm}
                          loading={loadingButton}
                        >
                          Xác nhận tổng hợp và chuyển
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </>
              )}
            </TabPane>

            {/* Tab PDF */}
            <TabPane tab="Tệp báo cáo word mẫu" key="2">
              {loadingButton ? (
                <div style={{ textAlign: "center" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <div>
                  <Button
                    key={1}
                    type="link"
                    icon={<DownloadOutlined />}
                    style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
                    onClick={() => handleDownloadWordSample()}
                  >
                    Word mẫu 1 - Tải tệp báo cáo word mẫu
                  </Button>
                </div>
              )}
            </TabPane>
          </Tabs>
        </Modal>
      </Row>
    </div>
  );
}
export const ConsolidationAndTransfer = WithErrorBoundaryCustom(_ConsolidationAndTransfer);

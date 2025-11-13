import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Row, Space, TableProps, Tag, Typography } from "antd";
import { EditOutlined, EyeOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { DetailsEvaluationsOfUser, NewEvaluations } from "@admin/features/evaluations";
import { EvaluationsOfUserDTO } from "@models/evaluationsDTO";
import { useGetListEvaluationsOfUserQuery } from "@API/services/EvaluationsApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import { useGetListUnitAvailableQuery } from "~/API/services/UnitApis.service";

function _EvaluationsOfUser() {
  const {
    data: ListEvaluationsOfUser,
    isLoading: LoadingListEvaluationsOfUser,
    refetch
  } = useGetListEvaluationsOfUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } =
    useGetListCategoryTimeTypeAvailableQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(0);

  const openDrawer = (id: string, status: number) => {
    setIsOpenDrawer(true);
    setStatus(status);
    setId(id);
  };

  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<EvaluationsOfUserDTO>["onChange"] = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
  };

  const handleButtonStatus = (id: string, status: number) => {
    switch (status) {
      case 0:
        return (
          <Button
            onClick={() => {
              openDrawer(id, 0);
            }}
            type="primary"
            size="middle"
            icon={<SwapOutlined />}
          >
            Thực hiện
          </Button>
        );
      case 1:
        return (
          <Button
            onClick={() => {
              openDrawer(id, 1);
            }}
            type="default"
            size="middle"
            icon={<EditOutlined />}
          >
            Chỉnh sửa đánh giá
          </Button>
        );
      case 2:
      case 3:
      case 4:
        return (
          <Button
            onClick={() => {
              openDrawer(id, 2);
            }}
            type="default"
            size="middle"
            icon={<EyeOutlined />}
          >
            Xem lại đánh giá
          </Button>
        );
      default:
        return (
          <Button
            onClick={() => {
              openDrawer(id, 2);
            }}
            type="primary"
            size="middle"
            icon={<SwapOutlined />}
          >
            Thực hiện đánh giá
          </Button>
        );
    }
  };

  const handleShowMessageStatus = (status: number, statusMessage: string) => {
    switch (status) {
      case 0:
        return <Tag color="red">Chưa đánh giá</Tag>;
      case 1:
        return <Tag color="yellow">Đã lưu đánh giá</Tag>;
      case 2:
        return <Tag color="purple">Đã thực hiện đánh giá - Chờ cấp trên đánh giá</Tag>;
      case 3:
        return <Tag color="green">{statusMessage}</Tag>;
      case 4:
        return <Tag color="magenta">{statusMessage}</Tag>;
      default:
        return <Tag color="red">Chưa đánh giá</Tag>;
    }
  };

  const columns: ColumnsType<EvaluationsOfUserDTO> = [
    {
      title: "STT",
      key: "index",
      width: 40,
      render: (text, record, index) => index + 1
    },
    {
      title: "Tên phiếu đánh giá",
      dataIndex: "nameEvaluations",
      key: "nameEvaluations",
      width: 200,
      render: (nameEvaluations) => {
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{nameEvaluations}</div>;
      }
    },
    {
      title: "Đơn vị",
      dataIndex: "idUnit",
      key: "idUnit",
      width: 200,
      filters: ListUnit?.listPayload?.map((item) => ({
        text: item.unitName || "",
        value: item.id || ""
      })),
      filteredValue: filteredInfo?.idUnit || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idUnit === value,
      render: (idUnit) => {
        const unit = ListUnit?.listPayload?.find((x) => x.id === idUnit)?.unitName;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{unit}</div>;
      }
    },
    {
      title: "Giai đoạn đánh giá",
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
      width: 200
    },
    {
      title: "Ngày bắt đầu đánh giá",
      dataIndex: "fromDate",
      key: "fromDate",
      render: (fromDate: Date) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{dayjs(fromDate).format("DD-MM-YYYY")}</div>
      )
    },
    {
      title: "Ngày kết thúc đánh giá",
      dataIndex: "toDate",
      key: "toDate",
      render: (toDate: Date) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{dayjs(toDate).format("DD-MM-YYYY")}</div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status, record) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {handleShowMessageStatus(status, record.messageStatus || "")}
        </div>
      )
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      render: (item, record) => handleButtonStatus(record.id, record.status || 0)
    }
  ];

  const propsTable: TableProps<EvaluationsOfUserDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      width: 150,
      align: "center",
      ...item
    })),
    // rowSelection: rowSelection,
    onChange: handleChange,
    loading: LoadingListEvaluationsOfUser && LoadingListCategoryTimeType && LoadingListUnit,
    dataSource: ListEvaluationsOfUser?.listPayload,
    pagination: {
      total: ListEvaluationsOfUser?.totalElement,
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
        <NewEvaluations setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <DetailsEvaluationsOfUser
        setIsOpen={setIsOpenDrawer}
        isOpen={isOpenDrawer}
        id={id}
        status={status}
        refetchListMain={refetch}
        detail={propsTable.dataSource ? propsTable.dataSource.find((x) => x.id == id) || null : null}
      />

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh sách phiếu đánh giá </Typography.Title>
          <Divider />
          <Card bordered={false} className="criclebox">
            <Space
              style={{
                marginBottom: 16,
                justifyContent: "space-between",
                width: "100%"
              }}
              wrap
            ></Space>
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const EvaluationsOfUser = WithErrorBoundaryCustom(_EvaluationsOfUser);

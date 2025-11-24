import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { useState } from "react";
import { ColumnsType } from "antd/lib/table/interface";
import { Button, Card, Col, Divider, Row, Space, TableProps, Tag, Typography } from "antd";
import { EditOutlined, EyeOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { ModalContent } from "@admin/components";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { DetailsEvaluationsOfSupervisor, NewEvaluations } from "@admin/features/evaluations";
import { EvaluationsOfSupervisorDTO } from "@models/evaluationsDTO";
import {
  useGetListEvaluationsOfSupervisorQuery,
  useGetListEvaluationsQuery
} from "@API/services/EvaluationsApis.service";
import { useGetListUserQuery } from "@API/services/UserApis.service";
import { useGetListCategoryTimeTypeAvailableQuery } from "@API/services/CategoryTimeTypeApis.service";
import { FilterValue } from "antd/es/table/interface";
import { useGetListUnitAvailableQuery } from "~/API/services/UnitApis.service";

function _EvaluationsOfSupervisor() {
  const {
    data: ListEvaluationsOfSupervisor,
    isLoading: LoadingListEvaluationsOfSupervisor,
    refetch
  } = useGetListEvaluationsOfSupervisorQuery(
    {
      pageSize: 0,
      pageNumber: 0
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data: ListUser, isLoading: LoadingListUser } = useGetListUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListCategoryTimeType, isLoading: LoadingListCategoryTimeType } =
    useGetListCategoryTimeTypeAvailableQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const { data: ListEvaluations, isLoading: LoadingListEvaluations } = useGetListEvaluationsQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [idUser, setIdUser] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(0);

  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<EvaluationsOfSupervisorDTO>["onChange"] = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
  };

  const openDrawer = (id: string, idUser: string, status: number) => {
    setIsOpenDrawer(true);
    setId(id);
    setIdUser(idUser);
    setStatus(status);
  };

  const columns: ColumnsType<EvaluationsOfSupervisorDTO> = [
    {
      title: "STT",
      key: "index",
      width: 40,
      render: (text, record, index) => index + 1
    },
    {
      title: "Tên phiếu đánh giá",
      dataIndex: "id",
      key: "id",
      width: 200,
      filters: ListEvaluations?.listPayload?.map((item) => ({
        text: item.nameEvaluations || "",
        value: item.id || ""
      })),
      filteredValue: filteredInfo?.id || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.id === value,
      render: (id) => {
        const text = ListEvaluations?.listPayload?.find((x) => x.id === id)?.nameEvaluations;
        return <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>;
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
      title: "Họ và tên",
      dataIndex: "idUser",
      key: "idUser",
      width: 200,
      filters: ListUser?.listPayload?.map((item) => ({
        text: item.fullname || "",
        value: item.id || ""
      })),
      filteredValue: filteredInfo?.idUser || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.idUser === value,
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUser?.listPayload?.find((item) => item.id === text)?.fullname}
        </div>
      )
    },
    {
      title: "Mã tài khoản",
      dataIndex: "idUser",
      key: "idUser",
      width: 200,
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUser?.listPayload?.find((item) => item.id === text)?.userCode}
        </div>
      )
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
      width: 350
    },
    {
      title: "Ngày bắt đầu đánh giá",
      dataIndex: "fromDate",
      key: "fromDate",
      width: 100,
      render: (fromDate: Date) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{dayjs(fromDate).format("DD-MM-YYYY")}</div>
      )
    },
    {
      title: "Ngày kết thúc đánh giá",
      dataIndex: "toDate",
      key: "toDate",
      width: 100,
      render: (toDate: Date) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{dayjs(toDate).format("DD-MM-YYYY")}</div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {text === null ? (
            <Tag color="red">Chưa đánh giá</Tag>
          ) : text === 1 ? (
            <Tag color="yellow">Đã lưu đánh giá</Tag>
          ) : text === 2 ? (
            <Tag color="purple">Đã thực hiện đánh giá</Tag>
          ) : text === 3 ? (
            <Tag color="green">Đã đánh giá</Tag>
          ) : (
            <Tag color="red">Chưa đánh giá</Tag>
          )}
        </div>
      )
    },
    {
      title: "Hành động",
      dataIndex: "Action",
      key: "Action",
      render: (item, record) =>
        record.status === null ? (
          <Button
            onClick={() => {
              openDrawer(record.id, record.idUser, 0);
            }}
            type="primary"
            size="middle"
            icon={<SwapOutlined />}
          >
            Thực hiện đánh giá
          </Button>
        ) : record.status === 1 ? (
          <Button
            onClick={() => {
              openDrawer(record.id, record.idUser, 1);
            }}
            type="default"
            size="middle"
            icon={<EditOutlined />}
          >
            Chỉnh sửa đánh giá
          </Button>
        ) : record.status === 2 ? (
          <Button
            onClick={() => {
              openDrawer(record.id, record.idUser, 2);
            }}
            type="default"
            size="middle"
            icon={<EyeOutlined />}
          >
            Xem lại đánh giá
          </Button>
        ) : record.status === 3 ? (
          <Tag color="green">Đã đánh giá</Tag>
        ) : (
          <Button
            onClick={() => {
              openDrawer(record.id, record.idUser, 0);
            }}
            type="primary"
            size="middle"
            icon={<SwapOutlined />}
          >
            Thực hiện đánh giá
          </Button>
        )
    }
  ];
  const propsTable: TableProps<EvaluationsOfSupervisorDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record, index) => `${record.id}-${index}`,
    columns: columns.map((item) => ({
      width: 150,
      align: "center",
      ...item
    })),
    //rowSelection: rowSelection,
    onChange: handleChange,
    loading:
      LoadingListEvaluationsOfSupervisor &&
      LoadingListUser &&
      LoadingListCategoryTimeType &&
      LoadingListEvaluations &&
      LoadingListUnit,
    dataSource: ListEvaluationsOfSupervisor?.listPayload,
    pagination: {
      total: ListEvaluationsOfSupervisor?.totalElement,
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
      <DetailsEvaluationsOfSupervisor
        setIsOpen={setIsOpenDrawer}
        isOpen={isOpenDrawer}
        id={id}
        idUser={idUser}
        refetchListMain={refetch}
        status={status}
      />

      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh sách phiếu chờ đánh giá </Typography.Title>
          <Divider />
          <Card bordered={false} className="criclebox">
            <Space
              style={{
                marginBottom: 16,
                justifyContent: "space-between",
                width: "100%"
              }}
              wrap
            >
              {/*<Form layout="vertical">*/}
              {/*  <Space>*/}
              {/*    <Form.Item name="nameAssessmentType" label="Tên phiếu đánh giá">*/}
              {/*      <Input placeholder={"Nhập tên loại đánh giá"} style={{ height: 40, width: "100%" }} />*/}
              {/*    </Form.Item>*/}
              {/*    <Form.Item name="isHide" label="Trạng thái">*/}
              {/*      <Select allowClear showSearch placeholder={"Chọn trạng thái"} style={{ height: 40, width: "100%" }}>*/}
              {/*        <Select.Option value={0}>Chưa đánh giá</Select.Option>*/}
              {/*        <Select.Option value={1}>Đã lưu đánh giá</Select.Option>*/}
              {/*        <Select.Option value={2}>Đã thực hiện đánh giá</Select.Option>*/}
              {/*        <Select.Option value={3}>Đã đánh giá</Select.Option>*/}
              {/*      </Select>*/}
              {/*    </Form.Item>*/}
              {/*    <Form.Item>*/}
              {/*      <Button*/}
              {/*        type="primary"*/}
              {/*        htmlType="submit"*/}
              {/*        icon={<SearchOutlined />}*/}
              {/*        style={{ height: 40, marginTop: 30 }}*/}
              {/*      >*/}
              {/*        Tìm kiếm*/}
              {/*      </Button>*/}
              {/*    </Form.Item>*/}
              {/*  </Space>*/}
              {/*</Form>*/}
            </Space>
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export const EvaluationsOfSupervisor = WithErrorBoundaryCustom(_EvaluationsOfSupervisor);

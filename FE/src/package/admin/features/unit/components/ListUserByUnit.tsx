import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Card, Col, Row, Space, Spin, TableProps, Tag, Typography } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { UserDTO } from "@models/userDto";
import { useGetListUserByIdUnitQuery } from "@API/services/UserApis.service";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { useGetListUserTypeQuery } from "@API/services/UserType.service";

interface IProps {
  setVisible: (value: boolean) => void;
  id?: string;
}

function _ListUserByUnit(props: IProps) {
  const { id } = props;

  const { data: ListUserByIdUnit, isLoading: LoadingListUserByIdUnit } = useGetListUserByIdUnitQuery({
    idUnit: id!,
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<UserDTO>["onChange"] = (pagination, filters) => {
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

  const columns: ColumnsType<UserDTO> = [
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.fullname,
        value: item.fullname
      })),
      filteredValue: filteredInfo?.fullname || null,
      filterSearch: true,
      width: 200,
      onFilter: (value: any, record) => record.fullname.startsWith(value),
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Mã tài khoản",
      dataIndex: "userCode",
      key: "userCode",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.userCode,
        value: item.userCode
      })),
      filteredValue: filteredInfo?.userCode || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.userCode.startsWith(value)
    },
    {
      title: "Loại người dùng",
      dataIndex: "userTypeId",
      key: "userTypeId",
      filters: ListUserType?.listPayload?.map((item) => ({
        text: item.typeName,
        value: item.id
      })),
      filteredValue: filteredInfo?.userTypeId || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.userTypeId.startsWith(value),
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUserType?.listPayload?.find((x) => x.id === text)?.typeName}
        </div>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.email,
        value: item.email
      })),
      filteredValue: filteredInfo?.email || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.email.startsWith(value),
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          <Typography.Link href={`mailto:${text}`} target={"_blank"}>
            {text}
          </Typography.Link>
        </div>
      )
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.phone,
        value: item.phone
      })),
      filteredValue: filteredInfo?.phone || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.phone.startsWith(value),
      render: (text) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          <Typography.Link href={`tel:${text}`} target={"_blank"}>
            {text}
          </Typography.Link>
        </div>
      )
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.address,
        value: item.address
      })),
      filteredValue: filteredInfo?.address || null,
      filterSearch: true,
      onFilter: (value: any, record) => record?.address?.startsWith(value),
      render: (text) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{text}</div>
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm"),
        value: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm")
      })),
      filteredValue: filteredInfo?.createdDate || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.createdDate.toString().startsWith(value),
      render: (text) => dayjs(text).format("DD-MM-YYYY HH:mm")
    },
    {
      title: "Trạng thái",
      dataIndex: "isLocked",
      key: "isLocked",
      render: (text) =>
        !text ? (
          <Tag color={"success"}>
            <CheckCircleOutlined /> Hoạt động
          </Tag>
        ) : (
          <Tag color={"error"}>
            <CloseCircleOutlined /> Không
          </Tag>
        )
    }
  ];
  const propsTable: TableProps<UserDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      ellipsis: true,
      width: 150,
      ...item
    })),
    rowSelection: rowSelection,
    dataSource: ListUserByIdUnit?.listPayload,
    onChange: handleChange,
    loading: LoadingListUserByIdUnit && LoadingListUserType,
    pagination: {
      total: ListUserByIdUnit?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };
  return (
    <div className="LoadingListUserByIdUnit">
      <Spin spinning={LoadingListUserByIdUnit}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
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
      </Spin>
    </div>
  );
}

export const ListUserByUnit = WithErrorBoundaryCustom(_ListUserByUnit);

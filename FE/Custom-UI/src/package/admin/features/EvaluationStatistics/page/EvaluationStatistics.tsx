import { DownloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, TableProps, Typography } from "antd";
import { ColumnsType, FilterValue } from "antd/lib/table/interface";
import React, { useState } from "react";
import { UserDTO } from "~/models/userDto";
import WithErrorBoundaryCustom from "~/units/errorBounDary/WithErrorBoundaryCustom";
import { useGetListUserParentAndChildrenQuery } from "@API/services/UserApis.service";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import { getStatisticByIdUser } from "@API/services/EvaluationStatistics";

const _EvaluationStatistics: React.FC = () => {
  const { data, isLoading } = useGetListUserParentAndChildrenQuery({
    pageSize: 0,
    pageNumber: 0
  });
  //#region Table config
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const handleChange: TableProps<UserDTO>["onChange"] = (pagination, filters) => {
    // pagination = pagination || {};
    setFilteredInfo(filters);
  };
  const columns: ColumnsType<UserDTO> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
      width: 20
    },
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      filters: data?.listPayload?.map((item) => ({
        text: item.fullname,
        value: item.fullname
      })),
      filteredValue: filteredInfo?.fullname || null,
      filterSearch: true,
      width: 200,
      onFilter: (value: any, record) => record.fullname.startsWith(value),
      render: (text) => (
        <Typography.Text style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {<UserAddOutlined />} {text}
        </Typography.Text>
      )
    },
    {
      title: "Mã tài khoản",
      dataIndex: "userCode",
      key: "userCode",
      filters: data?.listPayload?.map((item) => ({
        text: item.userCode,
        value: item.userCode
      })),
      filteredValue: filteredInfo?.userCode || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.userCode.startsWith(value)
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: data?.listPayload?.map((item) => ({
        text: item.email,
        value: item.email
      })),
      filteredValue: filteredInfo?.email || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.email.startsWith(value),
      render: (text) => (
        <Typography.Link
          href={`mailto:${text}`}
          target={"_blank"}
          style={{ whiteSpace: "break-spaces", width: "100%" }}
        >
          {text}
        </Typography.Link>
      )
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      filters: data?.listPayload?.map((item) => ({
        text: item.phone,
        value: item.phone
      })),
      filteredValue: filteredInfo?.phone || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.phone.startsWith(value)
    },
    {
      title: "Thống kê",
      dataIndex: "fileAttachments",
      key: "fileAttachments",
      render: (item, record) => (
        <Button
          type="link"
          href={getStatisticByIdUser(record.id)}
          target="_blank"
          rel="noopener noreferrer"
          download
          icon={<DownloadOutlined />}
        >
          Tải xuống
        </Button>
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
      //ellipsis: true,
      width: 200,
      ...item
    })),
    dataSource: data?.listPayload,
    onChange: handleChange,
    loading: isLoading,
    pagination: {
      total: data?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };
  //#endregion
  return (
    <div className="UserManage">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}>Thống kê đánh giá theo người dùng trong hệ thống </Typography.Title>
          <Divider />

          <Card bordered={false} className="criclebox">
            <DragAndDropTable {...propsTable} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export const EvaluationStatistics = WithErrorBoundaryCustom(_EvaluationStatistics);

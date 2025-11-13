import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { HandleError, ModalContent } from "@admin/components";
import { NewAndUpdateCategorySalaryLevel } from "@admin/features/CategorySalaryLevel";
import { Button, Card, Col, Divider, Dropdown, Menu, Popconfirm, Row, Space, TableProps, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import React, { useState } from "react";
import { useDeleteCategorySalaryLevelMutation } from "@API/services/CategorySalaryLevel.service";
import { ColumnsType } from "antd/lib/table/interface";
import { formatMoney } from "~/units";
import dayjs from "dayjs";
import { useGetListCurriculumVitaeQuery } from "@API/services/CurriculumVitae.service";
import CurriculumVitaeDTO from "@models/CurriculumVitaeDTO";
import { useGetListEmployeeQuery } from "@API/services/Employee.service";

function _CurriculumVitae() {
  const { data: ListCurriculumVitae, isLoading: LoadingListCurriculumVitae } = useGetListCurriculumVitaeQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const { data: ListEmployee } = useGetListEmployeeQuery({
    pageNumber: 0,
    pageSize: 0
  });
  const [deleteListCategorySalaryLevel, { isLoading: isLoadingDeleteListCategorySalaryLevel }] =
    useDeleteCategorySalaryLevelMutation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [id, setId] = useState<string | undefined>(undefined);
  //#region Table config
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const columns: ColumnsType<CurriculumVitaeDTO> = [
    {
      title: "Nhân viên",
      dataIndex: "idEmployee",
      key: "idEmployee",
      render: (text) => ListEmployee?.listPayload?.find((x) => x.id === text)?.name
    },
    {
      title: "Số bảo hiểm xã hội",
      dataIndex: "socialSecurityNumber",
      key: "socialSecurityNumber",
      render: (text: number) => formatMoney(text)
    },
    {
      title: "Loại bậc lương",
      dataIndex: "isCoefficient",
      key: "isCoefficient",
      render: (text) => (text ? "Theo hệ số" : "Không theo hệ số")
    },
    {
      title: "Hệ số đóng BHXH",
      dataIndex: "socialSecurityContributionRate",
      key: "socialSecurityContributionRate"
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      // filters: ListCategoryNationality?.listPayload?.map((item) => ({
      //   text: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm"),
      //   value: dayjs(item.createdDate).format("DD-MM-YYYY HH:mm")
      // })),
      // filteredValue: filteredInfo?.createdDate || null,
      // filterSearch: true,
      // onFilter: (value: any, record) => record.createdDate.toString().startsWith(value),
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
  const menuAction = (record: CurriculumVitaeDTO) => {
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
  const propsTable: TableProps<CurriculumVitaeDTO> = {
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
    dataSource: ListCurriculumVitae?.listPayload,
    // onChange: handleChange,
    loading: LoadingListCurriculumVitae,
    pagination: {
      total: ListCurriculumVitae?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "middle"
  };
  return (
    <div className={"unit"}>
      <ModalContent
        visible={isOpenModal}
        setVisible={setIsOpenModal}
        title={id ? "Chỉnh sửa  " : "Thêm mới"}
        width={"600px"}
      >
        <NewAndUpdateCategorySalaryLevel setVisible={setIsOpenModal} id={id} />
      </ModalContent>
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Typography.Title level={2}> Danh sách sơ yếu lí lịch nhân viên </Typography.Title>
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
                  const result = await deleteListCategorySalaryLevel({
                    idCategorySalaryLevel: selectedRowKeys as string[]
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
                loading={isLoadingDeleteListCategorySalaryLevel}
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
export const CurriculumVitae = WithErrorBoundaryCustom(_CurriculumVitae);

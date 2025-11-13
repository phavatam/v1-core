import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Spin, Table, TableColumnsType, TableProps, Row, Form, Space, Divider, Alert,Tag } from "antd";
import { UserDTO } from "@models/userDto";
import { UserTypeDTO } from "@models/userTypeDto";
import {
  useUpdateSortMutation
} from "@API/services/EvaluationsCriteriaApis.service";
import React, { useEffect, useState } from "react";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
import { listItemBeforeStyle, listItemStyle, listStyle } from "@admin/features/evaluations";
import {useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircleOutlined, EditOutlined, EyeOutlined, SwapOutlined } from "@ant-design/icons";
import { HandleError } from "@admin/components";

import { useGetListUserByIdUnitQuery } from "@API/services/UserApis.service";

import {
  useGetEvaluationsByIdQuery,
} from "@API/services/EvaluationsApis.service";

import {
  useGetListUserTypeQuery 
} from "@API/services/UserType.service";

interface IProps {
  setVisible: (value: boolean) => void;
  idEvaluations?: string;
  idUnit?: string;
  id?: string;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

function _DetailReviewHistory(props: IProps) {
  const { setVisible, idEvaluations } = props;
  const { data: Evaluations, isLoading: LoadingEvaluations } = useGetEvaluationsByIdQuery(
    { idEvaluations: idEvaluations! },
    { skip: !idEvaluations }
  );
  
  const idUnit = Evaluations?.payload?.idUnit;

const { data: ListUserByIdUnit, isLoading: LoadingListUserByIdUnit } = useGetListUserByIdUnitQuery(
  {
    idUnit : idUnit!, 
    pageSize: 0, 
    pageNumber: 0  
  },
  {skip: !idUnit }
);

// const userId = ListUserByIdUnit?.listPayload?.map((user) => user.userTypeId) || [];

const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery(
 { pageSize: 0,
  pageNumber: 0}
);
// const useGetAllUserTypes = (userIds: string[]) => {
//   const [allUserTypes, setAllUserTypes] = useState<UserTypeDTO[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     const fetchUserTypes = async () => {
//       if (userIds.length === 0) return;

//       setIsLoading(true);

//       try {
//         const results = await Promise.all(
//           userIds.map((id) =>
//             fetch(`/userType/getUserTypeById?idUserType=${id}`)
//               .then((response) => response.json())
//               .then((data) => data as UserTypeDTO)
//           )
//         );
       
//         setAllUserTypes(results);
//       } catch (error) {
//         console.error("Error fetching user types:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserTypes();
//   }, [userIds, useGetUserTypeByIdQuery]);

//   return { allUserTypes, isLoading };
// };
  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [updateSort, { isLoading: LoadingUpdateSort }] = useUpdateSortMutation();

  const [data, setData] = useState<UserDTO[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [id, setId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(0);


  const RowDrag = (props: RowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: props["data-row-key"]
    });
    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: "move",
      ...(isDragging ? { position: "relative", zIndex: 9999 } : {})
    };

    return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
  };

  
  useEffect(() => {
    if (ListUserByIdUnit?.listPayload) {
      const categoryCriteriaPayload = ListUserByIdUnit.listPayload ?? [];
      setData(categoryCriteriaPayload);
    }
  }, [ListUserByIdUnit, Evaluations?.payload.idUnit]);

  const handleSubmit = async () => {
    const getFlatData = (nodes: UserDTO[], result: UserDTO[] = []): UserDTO[] => {
      for (const node of nodes) {
        result.push(node);
      }
      return result;
    };

    const flatData = getFlatData(data);
    const order = flatData.map((item, index) => ({
      idCategoryCriteria: item.id,
      sort: index + 1
    }));

    try {
      const result = await updateSort({
        listCategoryCriteria: {
          idEvaluations: idEvaluations,
          listCategoryCriteria: order
        }
      }).unwrap();
      if (result.success) {
        setVisible(false);
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const openDrawer = (id: string, status: number) => {
    setIsOpenDrawer(true);
    setStatus(status);
    setId(id);
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
            Nhắc nhở
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
        return <Tag color="red">Chưa đánh duyệt</Tag>;
      case 1:
        return <Tag color="yellow">Đã duyệt</Tag>;
    }
  };
  
  const columns: TableColumnsType<UserDTO> = [
    {
      title: "Tên người đánh giá",
      dataIndex: "fullname",
      key: "fullname",
      filters: ListUserByIdUnit?.listPayload?.map((item) => ({
        text: item.fullname || "",
        value: item.fullname || "" 
      })),
      //filteredValue: filteredInfo?.nameEvaluations || null,
      filterSearch: true,
      onFilter: (value: any, record) => record.fullname === value,
      render: (fullname) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {fullname}
        </div>
      )
    },
    {
      title: "Thuộc đơn vị",
      dataIndex: "unitId",
      key: "unitId",
      filters: ListUserByIdUnit?.listPayload?.reduce((acc, item) => {
        const statusText = ListUnit?.listPayload?.find((x) => x.id === Evaluations?.payload.idUnit)?.unitName || "";
        const statusValue = item.unitId;
        if (!acc.some(filter => filter.value === statusValue)) {
          acc.push({
            text: statusText,
            value: statusValue
          });
        }

        return acc;
      }, [] as { text: string | ""; value: string }[]) || [],

     filterSearch: true,
      onFilter: (value: any, record) => record.unitId === value,
      render: (unitId) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUnit?.listPayload?.find((x) => x.id === unitId)?.unitName}
        </div>
      )
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "status",
      key: "status",
      filters: ListUserByIdUnit?.listPayload?.reduce((acc, item) => {
        const statusText = handleShowMessageStatus(item.status, "") || "Unknown Status";
        const statusValue = item.status;
        if (!acc.some(filter => filter.value === statusValue)) {
          acc.push({
            text: statusText,
            value: statusValue
          });
        }

        return acc;
      }, [] as { text: any | ""; value: number }[]) || [],

     filterSearch: true,
      onFilter: (value: any, record) => record.status === value,
      render: (status) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {handleShowMessageStatus(status, "")}
        </div>
      )
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "userTypeId",
      key: "userTypeId",
      render: (userTypeId?: string) => {
        const typename = ListUserType?.listPayload?.find((userType) => userType.id === userTypeId && userType.typeName =="Hiệu trưởng")?.typeName;
        if (!typename) return null;
    
        return (
          <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {handleShowMessageStatus(status, "")}
          </div>
        );
      }
    },
    {
      title: "Nhắc đánh giá/duyệt",
      dataIndex: "idUnit",
      key: "idUnit",
      render: (item, record) => handleButtonStatus(record.id, record.status || 0)
    }
  ];

  const propsTable: TableProps<UserDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: "id",
    columns: columns.map((item) => ({
      ellipsis: true,
      width: 150,
      ...item
    })),
    loading: LoadingListUserByIdUnit,
    dataSource: data,
    pagination: false,
    size: "middle",
    components: {
      body: {
        row: RowDrag
      }
    }
  };

  return (
    <Spin
      spinning={ LoadingListUnit && LoadingListUserByIdUnit && LoadingEvaluations && LoadingListUserType}
    >
      <Row gutter={16}>
        <Col span={24}>
         
              <Table
                {...propsTable}
                expandIconColumnIndex={1}
                title={() => (
                  <Alert
                    message="Mô tả"
                    description={
                      <ul style={listStyle}>
                        <li style={listItemStyle}>
                          <span style={listItemBeforeStyle}>- </span>Bạn có thể đánh giá các phiếu bằng cách di chuyển
                          chúng và nhấn nút &quot;Lưu thao tác&quot; để hoàn tất việc đánh giá.
                        </li>
                      </ul>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
              />
        
        </Col>

        <Divider />

        <Col span={24}>
          <Form.Item>
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end"
              }}
            >
              {/* <Button
                type="default"
                htmlType="reset"
                loading={LoadingUpdateSort}
                icon={<ReloadOutlined />}
                onClick={onReload}
              >
                Tải lại
              </Button> */}
              <Button
                type="primary"
                htmlType="submit"
                loading={LoadingUpdateSort}
                icon={<CheckCircleOutlined />}
                style={{
                  float: "right"
                }}
                onClick={handleSubmit}
              >
                Lưu thao tác
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Spin>
  );
}

export const DetailReviewHistory = WithErrorBoundaryCustom(_DetailReviewHistory);
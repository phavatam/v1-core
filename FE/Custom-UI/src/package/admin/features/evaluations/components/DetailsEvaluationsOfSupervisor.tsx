/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Drawer,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Spin,
  Tag,
  TableProps,
  InputNumber,
  Form,
  Table,
  Modal,
  Upload,
  Card,
  Tabs,
  Dropdown,
  Menu
} from "antd";
import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  ExportExcelOfSupervisor,
  ExportPdfOfSupervisor,
  useGetListCriteriaInEvaluationsOfSupervisorQuery,
  useInsertAndUpdateListCriteriaInEvaluationsOfSupervisorMutation
} from "@API/services/EvaluationsCriteriaApis.service";
import {
  CriteriaInEvaluationsOfSupervisorDTO,
  CustomListCriteriasDTO,
  CustomListSupervisorEvaluationDTO,
  ListCriteriaInEvaluationsOfSupervisorDTO
} from "@models/evaluationsCriteriaDTO";
import { ColumnsType } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  DownloadOutlined,
  InboxOutlined,
  SaveOutlined,
  SendOutlined,
  RightCircleFilled
} from "@ant-design/icons";
import { DownloadButton, HandleError } from "@admin/components";
import {
  calculateTotalAssessmentValue,
  calculateTotalAssessmentValueDynamic,
  getTotalAssessmentValueSupervisorDynamic
} from "~/units";
import { useGetListUserQuery, useGetUserQuery } from "@API/services/UserApis.service";
import { useGetListCategoryGradingQuery } from "@API/services/CategoryGrading.service";
import {
  getFileExplaintEvaluation2ndway,
  useGetExplaintEvaluationByIdEvaluationQuery
} from "@API/services/ExplaintEvaluation.service";
import dayjs from "dayjs";
import { ExplaintEvaluationDTO } from "@models/ExplaintEvaluationDTO";
import DragAndDropTable from "@admin/components/DragAndDropTable/DragAndDropTable";
import TextArea from "antd/es/input/TextArea";
import { useGetListUserTypeQuery } from "~/API/services/UserType.service";

const { Text } = Typography;
const { Dragger } = Upload;

interface IProps {
  refetchListMain: () => void;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  id?: string;
  idUser?: string;
  status?: number;
}

const _DetailsEvaluationsOfSupervisor = (props: IProps) => {
  const { isOpen, setIsOpen, id, refetchListMain, idUser, status } = props;
  const [data, setData] = useState<CustomListCriteriasDTO[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [countSumary, setCountSumary] = useState<number>(3);
  const [activeTabKey, setActiveTabKey] = useState("2");
  const [isPrincipal, setIsPrincipal] = useState(false);
  const [bindingNhanXetUuKhuyetDiem, setBindingNhanXetUuKhuyetDiem] = useState<string>("");
  const [bindingNhanDinhChieuHuongPhatTrien, setBindingNhanDinhChieuHuongPhatTrien] = useState<string>("");
  const { TabPane } = Tabs;
  const buttonData: any = {
    /*word: [
      { id: 1, numberTemplate: 1, label: "Word - Mẫu 1 - Cán Bộ" },
      { id: 2, numberTemplate: 2, label: "Word Mẫu 2 - Word Công Chức - không phải là lãnh đạo" },
      { id: 3, numberTemplate: 3, label: "Word Mẫu 3 - Công Chức - Là lãnh đạo" },
      { id: 4, numberTemplate: 4, label: "Word Mẫu 4 - Viên Chức - không phải là lãnh đạo" },
      { id: 5, numberTemplate: 5, label: "Word Mẫu 5 - Viên Chức - Là lãnh đạo" }
    ],*/
    pdf: [
      { id: 6, numberTemplate: 6, label: "PDF - Bảng điểm cá nhân - Có ký số" }
      /*{ id: 7, numberTemplate: 1, label: "PDF - Mẫu 1 - Cán Bộ - Có ký số" },
      { id: 8, numberTemplate: 2, label: "PDF - Mẫu 2 - Word Công Chức - Không phải là lãnh đạo - Có ký số" },
      { id: 9, numberTemplate: 3, label: "PDF - Mẫu 3 - Công Chức - Là lãnh đạo - Có ký số" },
      { id: 10, numberTemplate: 4, label: "PDF - Mẫu 4 - Viên Chức - không phải là lãnh đạo - Có ký số" },
      { id: 11, numberTemplate: 5, label: "PDF - Mẫu 5 - Viên Chức - Là lãnh đạo - Có ký số" }*/
    ],
    excel: [{ id: 12, numberTemplate: 1, label: "Excel - Bảng điểm cá nhân - Có ký số" }]
  };

  const {
    data: ListCriteriaInEvaluationsOfSupervisor,
    isLoading: LoadingListCriteriaInEvaluationsOfSupervisor,
    refetch
  } = useGetListCriteriaInEvaluationsOfSupervisorQuery(
    {
      idEvaluations: id!,
      idUser: idUser!
    },
    {
      skip: !id
    }
  );

  const { data: ListExplaintEvaluations, isLoading: LoadingListExplaintEvaluations } =
    useGetExplaintEvaluationByIdEvaluationQuery(
      { idEvaluation: id!, pagination: { pageSize: 0, pageNumber: 0 } },
      {
        skip: !id
      }
    );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePrint, setIsModalVisiblePrint] = useState(false);

  const showModalPrint = () => {
    setIsModalVisiblePrint(true);
  };

  const handleCancelPrint = () => {
    setIsModalVisiblePrint(false);
  };

  const showModalx = () => {
    setIsModalVisible(true);
  };

  const handleOkx = async () => {
    setIsModalVisible(false);
  };

  const handleCancelx = () => {
    setIsModalVisible(false);
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const { data: ListCategoryGrading } = useGetListCategoryGradingQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [insertAndUpdateCriteriaOfSupervisor, { isLoading: LoadingInsertAndUpdateCriteriaOfSupervisor }] =
    useInsertAndUpdateListCriteriaInEvaluationsOfSupervisorMutation();

  const [formRef] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const [dataSupervisors, setDataOfSupervisors] = useState<CustomListSupervisorEvaluationDTO[]>([]); // Default value

  const { data: ListUser, isLoading: LoadingListUser } = useGetListUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const handleOk = async () => {
    setConfirmLoading(true);
    if (file !== null) {
      await onSend(file);
    } else if (isPrincipal === true && (!bindingNhanXetUuKhuyetDiem || !bindingNhanDinhChieuHuongPhatTrien)) {
      setConfirmLoading(false);
      alert("Vui lòng điền đầy đủ thông tin Kết quả đánh giá, xếp loại chất lượng cán bộ viên chức!");
      return;
    }
    setOpen(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const calculateTotalAssessmentValueSupervisor = (children: CustomListCriteriasDTO[]) => {
    let total = 0;
    children.forEach((child) => {
      if (child.children && child.children.length > 0) {
        total += calculateTotalAssessmentValueSupervisor(child.children);
      } else {
        total += child.assessmentValueSupervisor || child.startValue!;
      }
    });
    return total;
  };

  const calculateTotalEndValue = (children: CustomListCriteriasDTO[]): number => {
    let total = 0;

    children.forEach((child) => {
      if (child.children && child.children.length > 0) {
        if (child.isDistinct) {
          // Khi isDistinct = true, tính giá trị endValue lớn nhất trong các phần tử con
          const maxEndValue = child.children.reduce((maxValue, currentItem) => {
            const currentEndValue = currentItem.endValue ?? 0;
            return currentEndValue > maxValue ? currentEndValue : maxValue;
          }, 0);

          // Thêm giá trị endValue lớn nhất vào tổng
          total += maxEndValue;
        } else {
          // Khi isDistinct = false, tính tổng endValue của tất cả các children
          total += calculateTotalEndValue(child.children);
        }
      } else {
        // Nếu không có children, thêm endValue của child vào tổng
        total += child.endValue ?? 0;
      }
    });

    return total;
  };

  const getTotalAssessmentValue = (data: CustomListCriteriasDTO[]) => {
    let total = 0;
    data.forEach((item) => {
      if (item.children && item.children.length > 0) {
        total += calculateTotalAssessmentValueSupervisor(item.children);
      } else {
        total += item.assessmentValueSupervisor || item.startValue!;
      }
    });
    return total;
  };

  const totalAssessmentValue = getTotalAssessmentValue(data);

  const checkDistinct = (arr: CustomListCriteriasDTO[], id: string | null): boolean | null => {
    for (const item of arr) {
      if (item.idCategoryCriteria === id) {
        return item.isDistinct;
      }
      if (item.children) {
        const found = checkDistinct(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const handleInputChange = (value: number, idEvaluationsDetailsPersonal: string, parentId: string | null) => {
    const listCategoryCriteria = [...data]; // Sử dụng bản sao sâu của dữ liệu

    const isDistinct = checkDistinct(listCategoryCriteria, parentId);

    // Hàm đệ quy để set assessmentValue = 0 cho tất cả các item con
    const resetChildrenAssessment = (children: CustomListCriteriasDTO[]): CustomListCriteriasDTO[] => {
      return children.map((child) => ({
        ...child,
        assessmentValue: 0,
        children: child.children?.length ? resetChildrenAssessment(child.children) : []
      }));
    };

    // Hàm để reset giá trị assessmentValue = 0 cho tất cả các item có cùng parentId
    const resetOtherAssessments = (
      data: CustomListCriteriasDTO[],
      parentIdToReset: string | null
    ): CustomListCriteriasDTO[] => {
      return data.map((item) => {
        if (item.idParent === parentIdToReset && item.idEvaluationsDetailsPersonal !== idEvaluationsDetailsPersonal) {
          return {
            ...item,
            assessmentValue: 0,
            children: item.children?.length ? resetOtherAssessments(item.children, parentIdToReset) : []
          };
        }

        if (item.children?.length) {
          return { ...item, children: resetOtherAssessments(item.children, parentIdToReset) };
        }

        return item;
      });
    };

    const updateData: any = (data: CustomListCriteriasDTO[]) => {
      return data.map((item) => {
        if (item.idEvaluationsDetailsPersonal === idEvaluationsDetailsPersonal) {
          return { ...item, assessmentValueSupervisor: value || 0 };
        }

        if (item.idParent === parentId && isDistinct) {
          return {
            ...item,
            assessmentValueSupervisor: 0,
            children: item.children?.length ? resetChildrenAssessment(item.children) : []
          };
        }

        if (item.children) {
          return { ...item, children: updateData(item.children) };
        }
        return item;
      });
    };

    // Xác định parentId của item đang thay đổi
    const parentIdToReset =
      data.find((item) => item.idEvaluationsDetailsPersonal === idEvaluationsDetailsPersonal)?.idParent || null;

    // Cập nhật dữ liệu với các giá trị mới
    const updatedData = updateData(resetOtherAssessments(listCategoryCriteria, parentIdToReset));

    // Cập nhật lại state với dữ liệu mới
    setData(updatedData);
  };

  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const { data: User, isLoading: LoadingUser } = useGetUserQuery({
    fetch: true
  });

  useEffect(() => {
    if (ListCriteriaInEvaluationsOfSupervisor?.payload && id) {
      setData(ListCriteriaInEvaluationsOfSupervisor?.payload?.listCriterias);
      setDataOfSupervisors(ListCriteriaInEvaluationsOfSupervisor?.payload?.listSupervisors || []);
      setLoadingData(false);
    }
  }, [ListCriteriaInEvaluationsOfSupervisor, id, formRef]);

  useEffect(() => {
    if (User && ListUserType) {
      const userTypeName = ListUserType?.listPayload?.find((item) => {
        return item.id === User?.payload.data.userTypeId;
      })?.typeName;
      if (
        userTypeName?.toLowerCase() === "hiệu trưởng" ||
        userTypeName?.toLowerCase() === "phó hiệu trưởng" ||
        userTypeName?.toLowerCase() === "chuyên viên - phòng giáo dục và đào tạo"
      ) {
        setIsPrincipal(true);
      }
    }
  }, [User, ListUserType]);

  function getGradingName(percentage: number): string {
    if (!ListCategoryGrading?.listPayload) {
      return "Chưa xác định";
    }
    const grading = ListCategoryGrading.listPayload.find(
      (category) =>
        category.fromValue !== null &&
        category.toValue !== null &&
        percentage >= category.fromValue &&
        percentage <= category.toValue &&
        category.isActive
    );
    return grading ? grading.nameGrading : "Chưa xác định";
  }

  const columns: ColumnsType<CustomListCriteriasDTO> = [
    {
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>STT</div>,
      dataIndex: "stt",
      key: "stt",
      width: 80,
      render: (text) => (
        <div
          style={{
            whiteSpace: "break-spaces",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            display: "grid",
            fontSize: 16
          }}
        >
          {text}
        </div>
      )
    },
    {
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>Tiêu chí</div>,
      dataIndex: "nameCriteria",
      key: "nameCriteria",
      align: "left",
      render: (text, record) => {
        const fontWeight = record.children && record.children.length > 0 ? "bold" : "normal";
        const fontSize = record.children && record.children.length > 0 ? 18 : 17;
        return <div style={{ whiteSpace: "break-spaces", width: "100%", fontWeight, fontSize: fontSize }}>{text}</div>;
      }
    },
    {
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>Điểm tối đa</div>,
      dataIndex: "endValue",
      key: "endValue",
      width: 200,
      render: (endValue: number, record) => {
        if (record.children && record.children.length > 0) {
          let total = 0;
          if (record.isDistinct) {
            total = record.endValue || 0;
          } else {
            total = calculateTotalEndValue(record.children);
          }
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                    fontSize: 16,
                    alignContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {total}
                </Tag>
              }
            </div>
          );
        } else {
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}>
                  {endValue}
                </Tag>
              }
            </div>
          );
        }
      }
    },
    {
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>Điểm cá nhân tự đánh giá</div>,
      dataIndex: "assessmentValue",
      key: "assessmentValue",
      width: 200,
      render: (assessmentValue: number, record) => {
        if (record.children && record.children.length > 0) {
          const total = calculateTotalAssessmentValue(record.children);
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                    fontSize: 16,
                    alignContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {total}
                </Tag>
              }
            </div>
          );
        } else {
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}>
                  {assessmentValue}
                </Tag>
              }
            </div>
          );
        }
      }
    },
    ...dataSupervisors.map((item, index) => ({
      title: (
        <div style={{ fontSize: 16, fontWeight: "bold" }}>{`${
          ListUser?.listPayload?.find((user) => user.id === item.idUser)?.fullname
        }`}</div>
      ),
      dataIndex: `assessmentValue_${item.idUser}`,
      key: `assessmentValue_${item.idUser}`,
      width: 200,
      render: (assessmentValue: number, record: any) => {
        if (record.children && record.children.length > 0) {
          const total = calculateTotalAssessmentValueDynamic(record.children, index);
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                    fontSize: 16,
                    alignContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {total}
                </Tag>
              }
            </div>
          );
        } else {
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}>
                  {record.supervisorEvaluations[index]?.assessmentValueSupervisor}
                </Tag>
              }
            </div>
          );
        }
      }
    })),
    {
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>Điểm cấp trên đánh giá</div>,
      dataIndex: "assessmentValueSupervisor",
      key: "assessmentValueSupervisor",
      width: 200,
      render: (assessmentValueSupervisor: number, record) => {
        if (record.children && record.children.length > 0) {
          const total = calculateTotalAssessmentValueSupervisor(record.children);
          return (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                    fontSize: 16,
                    alignContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {total}
                </Tag>
              }
            </div>
          );
        } else {
          return (status ?? 0) >= 2 ? (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}>
                  {record.assessmentValueSupervisor}
                </Tag>
              }
            </div>
          ) : (
            <InputNumber
              style={{
                color: "black",
                width: "100%",
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                display: "inline-flex",
                textAlign: "center"
              }}
              min={record.startValue !== null ? record.startValue : 0}
              max={record.endValue !== null ? record.endValue : 0}
              value={record.assessmentValueSupervisor ? record.assessmentValueSupervisor : record.startValue}
              onChange={(value) => handleInputChange(value || 0, record.idEvaluationsDetailsPersonal, record?.idParent)}
              formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
              parser={(value) => parseInt(value!.replace(/[^\d]/g, ""), 10) || 0} // Parse and ensure integer
            />
          );
        }
      }
    }
  ];

  const propsTable: TableProps<CustomListCriteriasDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.idEvaluationsDetailsPersonal,
    columns: columns.map((item) => ({
      align: "center",
      ...item
    })),
    // rowSelection: rowSelection,
    // onChange: handleChange,
    loading: loadingData && LoadingListUser,
    dataSource: data,
    expandedRowKeys: data?.flatMap((item) => {
      const keys = [item.idEvaluationsDetailsPersonal];
      if (item.children) {
        keys.push(...item.children.map((child) => child.idEvaluationsDetailsPersonal));
      }
      return keys;
    }),
    pagination: false,
    expandable: {
      defaultExpandAllRows: true,
      expandIcon: () => null
    },
    size: "middle",
    summary: () => (
      <>
        <Table.Summary.Row
          style={{
            height: 40
          }}
        >
          <Table.Summary.Cell index={0} colSpan={2}>
            <div style={{ fontWeight: "bold", textAlign: "right", fontSize: 16 }}>Tổng điểm: </div>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={1}>
            <Tag
              color="green"
              style={{
                width: "100%",
                textAlign: "center",
                height: 40,
                fontSize: 16,
                alignContent: "center",
                fontWeight: "bold"
              }}
            >
              {calculateTotalEndValue(data)}
            </Tag>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} colSpan={1}>
            <Tag
              color="green"
              style={{
                width: "100%",
                textAlign: "center",
                height: 40,
                fontSize: 16,
                alignContent: "center",
                fontWeight: "bold"
              }}
            >
              {calculateTotalAssessmentValue(data)}
            </Tag>
          </Table.Summary.Cell>
          {dataSupervisors.map((item, index) => {
            const total = getTotalAssessmentValueSupervisorDynamic(data, index);
            setCountSumary(3 + index);
            return (
              <Table.Summary.Cell key={index} index={3 + index} colSpan={1}>
                <Tag
                  color="green"
                  style={{
                    width: "100%",
                    textAlign: "center",
                    height: 40,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {total}
                </Tag>
              </Table.Summary.Cell>
            );
          })}
          <Table.Summary.Cell index={countSumary} colSpan={1}>
            <Tag
              color="green"
              style={{
                width: "100%",
                textAlign: "center",
                height: 40,
                fontSize: 16,
                alignContent: "center",
                fontWeight: "bold"
              }}
            >
              {totalAssessmentValue}
            </Tag>
          </Table.Summary.Cell>
        </Table.Summary.Row>

        <Table.Summary.Row style={{ height: 40 }}>
          <Table.Summary.Cell index={0} colSpan={2}>
            <div style={{ fontWeight: "bold", textAlign: "right", fontSize: 16 }}>Xếp loại: </div>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={0} colSpan={2}>
            <Tag
              color="pink"
              style={{
                width: "100%",
                textAlign: "center",
                height: 40,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {getGradingName(calculateTotalAssessmentValue(data))}
            </Tag>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={0} colSpan={2}>
            <Tag
              color="gold"
              style={{
                width: "100%",
                textAlign: "center",
                height: 40,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {getGradingName(totalAssessmentValue)}
            </Tag>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    )
  };

  const onFinish = async (statusAddOrEdit: number, file: File) => {
    const values: CriteriaInEvaluationsOfSupervisorDTO[] = [];

    const getValues = (data: CustomListCriteriasDTO[]) => {
      data.forEach((item) => {
        if (!item.children || item.children.length === 0) {
          if (item.assessmentValueSupervisor !== undefined) {
            values.push({
              idEvaluationsDetailsPersonal: item.idEvaluationsDetailsPersonal,
              assessmentValueSupervisor: item.assessmentValueSupervisor
            });
          }
        } else if (item.children && item.children.length > 0) {
          getValues(item.children);
        }
      });
    };

    getValues(data);

    const formattedValues: ListCriteriaInEvaluationsOfSupervisorDTO = {
      idEvaluations: id!,
      idUser: idUser!,
      status: statusAddOrEdit,
      listCriteriaInEvaluationsOfSupervisor: values,
      listEvaluationsAAE: {
        nhanXetUuKhuyetDiem: bindingNhanXetUuKhuyetDiem,
        nhanDinhChieuHuongPhatTrien: bindingNhanDinhChieuHuongPhatTrien
      }
    };

    try {
      const result = await insertAndUpdateCriteriaOfSupervisor({
        listCriteriaInEvaluationsOfSupervisor: formattedValues,
        file
      }).unwrap();
      if (result.success) {
        setIsOpen(false);
        refetchListMain();
        refetch();
      }
    } catch (error: any) {
      await HandleError(error);
    }
  };

  const onSave = async () => {
    await onFinish(1, new File([], ""));
  };

  const onSend = async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      return false;
    }
    await onFinish(2, file);
  };

  const handleExcelReport = async () => {
    setLoadingButton(true);
    try {
      const res = await ExportExcelOfSupervisor({
        idEvaluations: id!,
        idUser: idUser!
      });
      if (res.data.size === 0) {
        alert("Vui lòng ký duyệt trước khi xuất báo cáo. Hoặc báo cáo chưa có dữ liệu.");
        setLoadingButton(false);
        return;
      }
      const data = res?.data as Blob;
      const file = new Blob([data]);

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(file);

      a.download = "Excel_BangDiemCaNhan.xlsx";

      a.click();
      setLoadingButton(false);
    } catch (e: any) {
      setLoadingButton(false);
      await HandleError(e);
    }
  };

  const handlePdfReport = async () => {
    setLoadingButton(true);
    try {
      const res = await ExportPdfOfSupervisor({
        idEvaluations: id!,
        idUser: idUser!
      });
      if (res.data.size === 0) {
        alert("Vui lòng ký duyệt trước khi xuất báo cáo. Hoặc báo cáo chưa có dữ liệu.");
        setLoadingButton(false);
        return;
      }
      const data = res?.data as Blob;
      const file = new Blob([data], { type: "application/pdf" });

      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, "_blank");

      // Giải phóng bộ nhớ
      window.URL.revokeObjectURL(fileURL);
      setLoadingButton(false);
    } catch (e: any) {
      await HandleError(e);
      setLoadingButton(false);
    }
  };

  const columnsx: ColumnsType<ExplaintEvaluationDTO> = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (_, __, index) => index + 1 // Sequential number starting from 1
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note"
    },
    {
      title: "Tệp minh chứng đính kèm",
      dataIndex: "fileAttachments",
      key: "fileAttachments",
      render: (item, record) => <DownloadButton downloadUrl={getFileExplaintEvaluation2ndway(record.fileAttachments)} />
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text: string) => dayjs(text).format("DD-MM-YYYY HH:mm")
    }
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };

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

  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      copyValues(1);
    } else if (e.key === "2") {
      copyValues(2);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Sao chép theo điểm cá nhân tự đánh giá</Menu.Item>
      <Menu.Item key="2">Sao chép theo điểm giám sát viên gần nhất</Menu.Item>
    </Menu>
  );

  const copyValues = (type: number) => {
    const updateData = (child: CustomListCriteriasDTO[]): CustomListCriteriasDTO[] => {
      return child.map((criteria) => {
        const updatedCriteria = { ...criteria };

        if (type === 1) {
          updatedCriteria.assessmentValueSupervisor = criteria.assessmentValue;
        } else if (type === 2 && criteria.supervisorEvaluations?.length > 0) {
          const lastEvaluation = criteria.supervisorEvaluations[criteria.supervisorEvaluations.length - 1];
          updatedCriteria.assessmentValueSupervisor = lastEvaluation?.assessmentValueSupervisor || 0;
        }

        // Nếu có tiêu chí con, tiếp tục đệ quy
        if (updatedCriteria.children?.length > 0) {
          updatedCriteria.children = updateData(updatedCriteria.children);
        }

        return updatedCriteria;
      });
    };

    // Cập nhật dữ liệu
    setData((prevData) => updateData(prevData));
  };

  const propsTablex: TableProps<ExplaintEvaluationDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columnsx.map((item) => ({
      ellipsis: true,
      with: 1500,
      ...item
    })),
    rowSelection: rowSelection,
    dataSource: ListExplaintEvaluations?.listPayload,
    // onChange: handleChange,
    loading: LoadingListExplaintEvaluations,
    pagination: {
      total: ListExplaintEvaluations?.totalElement,
      pageSize: 10,
      showSizeChanger: false,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    },
    size: "large"
  };

  return (
    <>
      <Spin
        spinning={
          LoadingListCriteriaInEvaluationsOfSupervisor &&
          loadingData &&
          LoadingListUser &&
          LoadingListUserType &&
          LoadingUser
        }
      >
        <Modal
          title={
            <Typography.Title level={5} style={{ marginBottom: 10 }}>
              Thực hiện Gửi đánh giá
            </Typography.Title>
          }
          open={open}
          onOk={activeTabKey === "2" ? handleOk : () => {}}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Xác nhận ký duyệt"
          cancelText={"Hủy ký duyệt"}
          width={1200}
          footer={activeTabKey === "2" ? undefined : null}
        >
          <Tabs defaultActiveKey={isPrincipal ? "1" : "2"} onChange={handleTabChange}>
            <TabPane tab="KẾT QUẢ ĐÁNH GIÁ, XẾP LOẠI CHẤT LƯỢNG CÁN BỘ VIÊN CHỨC" key="1" disabled={!isPrincipal}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="Nhận xét ưu, khuyết điểm: " name={"nhanXetUuKhuyetDiem"} wrapperCol={{ span: 24 }}>
                    <TextArea
                      defaultValue={bindingNhanXetUuKhuyetDiem}
                      onBlur={(e) => {
                        setBindingNhanXetUuKhuyetDiem(e.target.value);
                      }}
                      className="evaluation-addReviews"
                      placeholder="Nhận xét ưu, khuyết điểm"
                      rows={4}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Nhận định chiều hướng, triển vọng phát triển của cán bộ viên chức: "
                    name={"nhanDinhChieuHuongPhatTrien"}
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea
                      defaultValue={bindingNhanDinhChieuHuongPhatTrien}
                      onBlur={(e) => {
                        setBindingNhanDinhChieuHuongPhatTrien(e.target.value);
                      }}
                      className="evaluation-addReviews"
                      placeholder="Nhận định chiều hướng, triển vọng phát triển của cán bộ viên chức"
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="XÁC NHẬN GỬI ĐÁNH GIÁ" key="2">
              <Row gutter={16}>
                <Col span={24}>
                  <Dragger
                    multiple={false}
                    maxCount={1}
                    beforeUpload={(file) => {
                      setFile(file);
                      return false;
                    }}
                  >
                    {" "}
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Nhấn hoặc kéo thả tệp vào đây để tải tệp tin chữ ký số lên</p>
                    <p className="ant-upload-hint">
                      Chỉ cho phép tải lên một tệp duy nhất. Không được phép tải lên dữ liệu công ty hoặc các tệp tin bị
                      cấm.
                    </p>
                  </Dragger>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Modal>

        <Drawer
          headerStyle={{
            height: 60,
            backgroundColor: "#1890ff"
          }}
          closeIcon={false}
          title={
            <Row
              justify="space-between"
              style={{
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <Col>
                <Text
                  style={{
                    fontSize: 18,
                    color: "white"
                  }}
                >
                  Thực hiện đánh giá
                </Text>
              </Col>
              <Col>
                <CloseOutlined style={{ fontSize: 20 }} onClick={() => setIsOpen(false)} />
              </Col>
            </Row>
          }
          placement="right"
          width="100%"
          height="100%"
          onClose={() => setIsOpen(false)}
          open={isOpen}
          footerStyle={{
            backgroundColor: JSON.parse(localStorage.getItem("setting")!).darkMode ? "#303030" : "#E9E9E9"
          }}
          footer={
            <Space
              style={{
                width: "100%",
                height: 50,
                justifyContent: "flex-end"
              }}
            >
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfSupervisor}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 130, height: 40, color: "white", backgroundColor: "#1890ff" }}
                onClick={showModalPrint}
              >
                Mẫu in ấn
              </Button>
              <Button
                loading={LoadingListExplaintEvaluations}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 150, height: 40, color: "white", backgroundColor: "goldenrod" }}
                onClick={showModalx}
              >
                Xem giải trình
              </Button>
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfSupervisor}
                icon={<SendOutlined />}
                style={{
                  fontSize: 14,
                  width: 150,
                  height: 40,
                  color: "white",
                  backgroundColor: "#1890ff",
                  background: "blueviolet",
                  borderColor: "1890ff"
                }}
                onClick={showModal}
              >
                Ký duyệt
              </Button>
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  icon={<RightCircleFilled />}
                  style={{ fontSize: 14, width: 160, height: 40, color: "white", backgroundColor: "#01643c" }}
                >
                  Sao chép điểm
                </Button>
              </Dropdown>
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfSupervisor}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 130, height: 40, color: "white", backgroundColor: "#ff1846" }}
                onClick={onSave}
              >
                Lưu lại
              </Button>
              <Button
                icon={<CloseOutlined />}
                style={{
                  fontSize: 14,
                  width: 100,
                  height: 40,
                  color: "white",
                  background: "cornflowerblue",
                  borderColor: "1890ff"
                }}
                onClick={() => setIsOpen(false)}
              >
                Đóng
              </Button>
            </Space>
          }
        >
          <Table {...propsTable} />
        </Drawer>
      </Spin>
      <Modal
        title="Thông tin minh chứng, giải trình"
        open={isModalVisible}
        onOk={handleOkx}
        onCancel={handleCancelx}
        okText="Gửi"
        cancelText={"Hủy"}
        width="100vw" // Set the width of the modal
      >
        <Card bordered={false} className="criclebox">
          <DragAndDropTable {...propsTablex} />
        </Card>
      </Modal>
      <Modal title="Mẫu in ấn" open={isModalVisiblePrint} onCancel={handleCancelPrint} cancelText={"Hủy"} footer={null}>
        <p>Chọn mẫu xuất thích hợp</p>
        <Tabs defaultActiveKey="1">
          {/*Tab Word
          <TabPane tab="Word" key="1">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("word", downloadWordFile)}</div>
            )}
          </TabPane>*/}

          {/* Tab PDF */}
          <TabPane tab="PDF" key="2">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("pdf", handlePdfReport)}</div>
            )}
          </TabPane>

          {/* Tab Excel */}
          <TabPane tab="Excel" key="3">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("excel", handleExcelReport)}</div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export const DetailsEvaluationsOfSupervisor = WithErrorBoundaryCustom(_DetailsEvaluationsOfSupervisor);

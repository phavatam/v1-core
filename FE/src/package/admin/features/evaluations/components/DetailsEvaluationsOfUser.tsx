/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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
  Table,
  Modal,
  notification,
  Form,
  Tabs
} from "antd";
import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import {
  ExportExcelOfUser,
  ExportPdfOfUser,
  useGetListCriteriaInEvaluationsOfUserQuery,
  useInsertAndUpdateListCriteriaInEvaluationsOfUserMutation
} from "@API/services/EvaluationsCriteriaApis.service";
import {
  CriteriaInEvaluationsOfUserDTO,
  CustomListCriteriasDTO,
  CustomListSupervisorEvaluationDTO,
  ListCriteriaInEvaluationsOfUserDTO
} from "@models/evaluationsCriteriaDTO";
import { ColumnsType } from "antd/lib/table/interface";
import React, { useEffect, useRef, useState } from "react";
import { CloseOutlined, DownloadOutlined, InboxOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import { HandleError } from "@admin/components";
import {
  calculateTotalAssessmentValue,
  calculateTotalAssessmentValueDynamic,
  getTotalAssessmentValueSupervisorDynamic
} from "~/units";
import { useGetListUserQuery, useGetUserQuery } from "@API/services/UserApis.service";
import Dragger from "antd/es/upload/Dragger";
import { useGetListCategoryGradingQuery } from "@API/services/CategoryGrading.service";
import TextArea from "antd/es/input/TextArea";
import {
  downloadWordOrPDFStatisticOfUser,
  useInsertExplaintEvaluationWithFileMutation
} from "@API/services/ExplaintEvaluation.service";
import { useGetListCategoryAssessmentTypeQuery } from "@API/services/CategoryAssessmentTypeApis.service";
import { useGetListCategoryReviewQuery } from "@API/services/CategoryReviewApis.service";
import { SignByUsbTokenParams, Suggestion } from "~/models/common";
import { EvaluationsOfUserDTO } from "~/models/evaluationsDTO";
import { useGetListUserTypeQuery } from "~/API/services/UserType.service";
import { signByUsbToken } from "~/API/services/SignByUsbToken.service";
const { Text } = Typography;

interface IProps {
  refetchListMain: () => void;
  setIsOpen: (value: boolean) => void;
  isOpen: boolean;
  id?: string | null;
  status?: number | null;
  detail: EvaluationsOfUserDTO | null;
}

const _DetailsEvaluationsOfUser = (props: IProps) => {
  const { isOpen, setIsOpen, id, status, refetchListMain, detail } = props;
  const [data, setData] = useState<CustomListCriteriasDTO[]>([]);
  const [dataSupervisors, setDataOfSupervisors] = useState<CustomListSupervisorEvaluationDTO[]>([]); // Default value
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [filex, setFilex] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedAdvantages, setSelectedAdvantages] = useState<string>("");
  const [selectedDisadvantages, setSelectedDisadvantages] = useState<string>("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [bindingAdvantage, setBindingAdvantage] = useState<string>("");
  const [bindingDisAdvantage, setBindingDisAdvantage] = useState<string>("");
  const [bindingAddReview, setBindingAddReview] = useState<string>("");
  const [bindingKetQuaHoatDongCoQuan, setBindingKetQuaHoatDongCoQuan] = useState<string>("");
  const [bindingNangLucLanhDaoQuanLy, setBindingNangLucLanhDaoQuanLy] = useState<string>("");
  const [bindingNangLucTapHopDoanKet, setBindingNangLucTapHopDoanKet] = useState<string>("");
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [isPrincipal, setIsPrincipal] = useState(false);

  const { TabPane } = Tabs;
  const buttonData: any = {
    word: [
      { id: 1, numberTemplate: 1, label: "Word - Mẫu 1 - Cán Bộ" },
      { id: 2, numberTemplate: 2, label: "Word Mẫu 2 - Word Công Chức - không phải là lãnh đạo" },
      { id: 3, numberTemplate: 3, label: "Word Mẫu 3 - Công Chức - Là lãnh đạo" },
      { id: 4, numberTemplate: 4, label: "Word Mẫu 4 - Viên Chức - không phải là lãnh đạo" },
      { id: 5, numberTemplate: 5, label: "Word Mẫu 5 - Viên Chức - Là lãnh đạo" }
    ],
    pdf: [
      { id: 6, numberTemplate: 6, label: "PDF - Bảng điểm cá nhân - Có ký số" },
      { id: 7, numberTemplate: 1, label: "PDF - Mẫu 1 - Cán Bộ - Có ký số" },
      { id: 8, numberTemplate: 2, label: "PDF - Mẫu 2 - Word Công Chức - Không phải là lãnh đạo - Có ký số" },
      { id: 9, numberTemplate: 3, label: "PDF - Mẫu 3 - Công Chức - Là lãnh đạo - Có ký số" },
      { id: 10, numberTemplate: 4, label: "PDF - Mẫu 4 - Viên Chức - không phải là lãnh đạo - Có ký số" },
      { id: 11, numberTemplate: 5, label: "PDF - Mẫu 5 - Viên Chức - Là lãnh đạo - Có ký số" }
    ],
    excel: [{ id: 12, numberTemplate: 1, label: "Excel - Bảng điểm cá nhân - Có ký số" }]
  };

  useEffect(() => {
    setSelectedAdvantages(detail?.advantages || "");
    setSelectedDisadvantages(detail?.disAdvantages || "");
    setBindingAdvantage(detail?.advantages || "");
    setBindingDisAdvantage(detail?.disAdvantages || "");
  }, [detail]);

  const { data: ListCategoryGrading } = useGetListCategoryGradingQuery({
    pageSize: 0,
    pageNumber: 0
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblex, setIsModalVisiblex] = useState(false);

  const showModalx = () => {
    setIsModalVisible(true);
  };
  const showModalxx = () => {
    setIsModalVisiblex(true);
  };
  const handleCancelxx = () => {
    setIsModalVisiblex(false);
  };
  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };
  const handleChangeAddReview = (text: string) => {
    setBindingAddReview(text);
  };
  const [insertExplaintEvaluationWithFile] = useInsertExplaintEvaluationWithFileMutation();

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

  const handleOkx = async () => {
    const formData = new FormData();
    if (filex) {
      formData.append("FileAttachments", filex);
    }
    formData.append("Note", note);
    formData.append("IdEvaluations", id ?? "00000000-0000-0000-0000-000000000000");
    //console.log(formData);
    try {
      const response = await insertExplaintEvaluationWithFile({ formData }).unwrap();
      notification.success({ message: "Đã gửi giải trình" });
      //console.log("Success:", response);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error:", error);
    }

    setIsModalVisible(false);
  };

  const handleCancelx = () => {
    setIsModalVisible(false);
  };

  const {
    data: ListCriteriaInEvaluationsOfUser,
    isLoading: LoadingListCriteriaInEvaluationsOfUser,
    refetch
  } = useGetListCriteriaInEvaluationsOfUserQuery(
    {
      idEvaluations: id!
    },
    {
      skip: !id
    }
  );

  const { data: ListUserType, isLoading: LoadingListUserType } = useGetListUserTypeQuery({
    pageNumber: 0,
    pageSize: 0
  });

  const { data: ListUser, isLoading: LoadingListUser } = useGetListUserQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListCategoryReview, isLoading: LoadingListCategoryReview } = useGetListCategoryReviewQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: User, isLoading: LoadingUser } = useGetUserQuery({
    fetch: true
  });

  const { data: ListCategoryAssessmentType, isLoading: LoadingListCategoryAssessmentType } =
    useGetListCategoryAssessmentTypeQuery({
      pageSize: 0,
      pageNumber: 0
    });

  const [insertAndUpdateCriteriaOfPersonal, { isLoading: LoadingInsertAndUpdateCriteriaOfPersonal }] =
    useInsertAndUpdateListCriteriaInEvaluationsOfUserMutation();

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
        total += calculateTotalAssessmentValue(item.children);
      } else {
        total += item.assessmentValue || item.startValue!;
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

  const handleInputChange = (value: number, idEvaluationsCriteria: string, parentId: string | null) => {
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
        if (item.idParent === parentIdToReset && item.idEvaluationsCriteria !== idEvaluationsCriteria) {
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

    // Hàm đệ quy để set assessmentValue cho node hiện tại và reset các node con
    const updateData = (data: CustomListCriteriasDTO[]): CustomListCriteriasDTO[] => {
      return data.map((item) => {
        if (item.idEvaluationsCriteria === idEvaluationsCriteria) {
          return { ...item, assessmentValue: value || 0 };
        }

        if (item.idParent === parentId && isDistinct) {
          return {
            ...item,
            assessmentValue: 0,
            children: item.children?.length ? resetChildrenAssessment(item.children) : []
          };
        }

        if (item.children?.length) {
          return { ...item, children: updateData(item.children) };
        }

        return item;
      });
    };

    // Xác định parentId của item đang thay đổi
    const parentIdToReset = data.find((item) => item.idEvaluationsCriteria === idEvaluationsCriteria)?.idParent || null;

    // Cập nhật dữ liệu với các giá trị mới
    const updatedData = updateData(resetOtherAssessments(listCategoryCriteria, parentIdToReset));

    // Cập nhật lại state với dữ liệu mới
    setData(updatedData);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    if (!selectedAdvantages || !selectedDisadvantages) {
      setConfirmLoading(false);
      alert("Vui lòng điền đầy đủ thông tin ưu, nhược điểm!");
      return;
    } else if (!bindingAddReview) {
      setConfirmLoading(false);
      alert("Vui lòng điền đầy đủ thông tin kết quả tự nhận xét đánh giá!");
      return;
    } else if (
      isPrincipal === true &&
      (!bindingKetQuaHoatDongCoQuan || !bindingNangLucLanhDaoQuanLy || !bindingNangLucTapHopDoanKet)
    ) {
      setConfirmLoading(false);
      alert("Vui lòng điền đầy đủ thông tin Phần dành riêng cho Viên chức quản lý!");
      return;
    }
    if (file !== null) {
      await onSend(file);
      setOpen(false);
    } else {
      alert("Vui lòng tải tệp tin ký số lên");
    }
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    //console.log("Clicked cancel button");
    setOpen(false);
  };

  const showModal = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (ListCriteriaInEvaluationsOfUser?.payload && id) {
      setData(ListCriteriaInEvaluationsOfUser?.payload?.listCriterias);
      setDataOfSupervisors(ListCriteriaInEvaluationsOfUser?.payload?.listSupervisors || []);
      setLoadingData(false);
    }
  }, [ListCriteriaInEvaluationsOfUser, id, status]);

  const handleExportReport = async () => {
    setLoadingButton(true);
    try {
      const res = await ExportExcelOfUser({
        idEvaluations: id!
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

  const downloadPDFFile = async (numberTemplate: number) => {
    setLoadingButton(true);
    try {
      let res: any;

      if (numberTemplate >= 6) {
        res = await ExportPdfOfUser({
          idEvaluations: id!
        });
        if (!res || res.data.size === 0) {
          alert("Vui lòng ký duyệt trước khi xuất báo cáo. Hoặc báo cáo chưa có dữ liệu.");
          setLoadingButton(false);
          return;
        }
      } else {
        res = await downloadWordOrPDFStatisticOfUser({
          idEvaluations: id!,
          numberTemplate: numberTemplate!,
          type: 2 // Loại PDF
        });
        if (!res || res.data.size === 0) {
          alert("Mẫu đánh giá phải gửi cấp phê duyệt mới được in ấn.");
          setLoadingButton(false);
          return;
        }
      }
      debugger
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

  const downloadWordFile = async (numberTemplate: number) => {
    setLoadingButton(true);
    try {
      const res = await downloadWordOrPDFStatisticOfUser({
        idEvaluations: id!,
        numberTemplate: numberTemplate!,
        type: 1 // Loại WORD
      });
      if (res.data.size === 0) {
        alert("Mẫu đánh giá phải gửi cấp phê duyệt mới được in ấn.");
        setLoadingButton(false);
        return;
      }

      const data = res?.data as Blob;
      const file = new Blob([data]);

      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(file);

      a.download = `Word_MauInAn_${numberTemplate}.docx`;
      a.click();
      setLoadingButton(false);
    } catch (e: any) {
      setLoadingButton(false);
      await HandleError(e);
    }
  };

  function getGradingName(current: number): string {
    if (!ListCategoryGrading?.listPayload) {
      return "Chưa xác định";
    }
    const grading = ListCategoryGrading.listPayload.find(
      (category) =>
        category.fromValue !== null &&
        category.toValue !== null &&
        current >= category.fromValue &&
        current <= category.toValue &&
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
      title: <div style={{ fontSize: 16, fontWeight: "bold" }}>Điểm tự đánh giá</div>,
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
          return (status ?? 0) >= 2 ? (
            <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
              {
                <Tag style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}>
                  {record.assessmentValue}
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
              value={record.assessmentValue ? record.assessmentValue : record.startValue}
              onChange={(value) => handleInputChange(value || 0, record.idEvaluationsCriteria, record?.idParent)}
              formatter={(value) => `${value}`.replace(/\.\d*$/, "")} // Remove decimal part
              parser={(value) => parseInt(value!.replace(/[^0-9]/g, ""), 10) || 0} // Parse and ensure integer
            />
          );
        }
      }
    },
    ...(status === 2
      ? dataSupervisors.map((item, index) => ({
        title: (
          <div style={{ fontSize: 16, fontWeight: "bold" }}>{`${ListUser?.listPayload?.find((user) => user.id === item.idUser)?.fullname
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
                  <Tag
                    style={{ width: "100%", textAlign: "center", height: 40, fontSize: 16, alignContent: "center" }}
                  >
                    {record.supervisorEvaluations[index]?.assessmentValueSupervisor}
                  </Tag>
                }
              </div>
            );
          }
        }
      }))
      : [])
  ];

  const propsTable: TableProps<CustomListCriteriasDTO> = {
    scroll: {
      x: 800
    },
    bordered: true,
    rowKey: (record) => record.idCategoryCriteria,
    columns: columns.map((item) => ({
      align: "center",
      ...item
    })),
    // rowSelection: rowSelection,
    // onChange: handleChange,
    loading:
      loadingData &&
      LoadingListUser &&
      LoadingListCriteriaInEvaluationsOfUser &&
      LoadingListCategoryAssessmentType &&
      LoadingListCategoryReview,
    dataSource: data,
    expandedRowKeys: data?.flatMap((item) => {
      const keys = [item.idCategoryCriteria];
      if (item.children) {
        keys.push(...item.children.map((child) => child.idCategoryCriteria));
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
        <Table.Summary.Row style={{ height: 40 }}>
          <Table.Summary.Cell index={0} colSpan={2}>
            <div style={{ fontWeight: "bold", textAlign: "right", fontSize: 16 }}>Tổng điểm:</div>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={1}>
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}
            >
              {totalAssessmentValue}
            </Tag>
          </Table.Summary.Cell>
          {status === 2
            ? dataSupervisors.map((item, index) => {
              const total = getTotalAssessmentValueSupervisorDynamic(data, index);
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
            })
            : null}
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
              {getGradingName(totalAssessmentValue)}

              {/*Phần trăm: {totalAssessmentValue > 0*/}
              {/*? ((totalAssessmentValue/calculateTotalEndValue(data)) * 100).toFixed(2)*/}
              {/*: 0}%*/}
            </Tag>
          </Table.Summary.Cell>
          {status === 2
            ? dataSupervisors.map((item, index) => {
              const total = getTotalAssessmentValueSupervisorDynamic(data, index);
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
                    {getGradingName((total / calculateTotalEndValue(data)) * 100)}
                  </Tag>
                </Table.Summary.Cell>
              );
            })
            : null}
        </Table.Summary.Row>
      </>
    )
  };

  const onFinish = async (statusAddOrEdit: number, file: File) => {
    const values: CriteriaInEvaluationsOfUserDTO[] = [];

    const getValues = (data: CustomListCriteriasDTO[]) => {
      data.forEach((item) => {
        if (!item.children || item.children.length === 0) {
          if (item.assessmentValue !== undefined) {
            values.push({
              idEvaluationsCriteria: item.idEvaluationsCriteria,
              idCategoryCriteria: item.idCategoryCriteria,
              assessmentValue: item.assessmentValue
            });
          }
        } else if (item.children && item.children.length > 0) {
          getValues(item.children);
        }
      });
    };

    getValues(data);

    const formattedValues: ListCriteriaInEvaluationsOfUserDTO = {
      idEvaluations: id!,
      status: statusAddOrEdit,
      listCriteriaInEvaluationsOfUser: values,
      listEvaluationsAAE: {
        advantages: selectedAdvantages,
        disAdvantages: selectedDisadvantages,
        addReviews: bindingAddReview,
        ketQuaHoatDongCoQuan: bindingKetQuaHoatDongCoQuan,
        nangLucLanhDaoQuanLy: bindingNangLucLanhDaoQuanLy,
        nangLucTapHopDoanKet: bindingNangLucTapHopDoanKet
      }
    };
    //console.log(formattedValues);
    try {
      const result = await insertAndUpdateCriteriaOfPersonal({
        listCriteriaInEvaluationsOfUser: formattedValues,
        file
      }).unwrap();
      debugger
      if (result.success) {
        const data: SignByUsbTokenParams = {
          File: result.content,
          UsbType: 0,
          EvaluationId: id
        }

        const resultSign = await signByUsbToken(data);

        setIsOpen(false);
        setConfirmLoading(false);
        refetchListMain();
        refetch();
      } else {
        setConfirmLoading(false);
        console.error("Error updating criteria:", result.message);
      }
    } catch (error: any) {
      setConfirmLoading(false);
      await HandleError(error);
    }
  };

  const onSave = async () => {
    await onFinish(1, new File([], ""));
  };

  const onSend = async (file: File) => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 10) {
      alert("Dung lượng tệp tin quá lớn, vui lòng chọn tệp tin khác");
      return false;
    }
    await onFinish(2, file);
  };

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSuggestAdvantageOpen, setIsSuggestAdvantageOpen] = useState<boolean>(false);
  const [isSuggestDisAdvantageOpen, setIsSuggestDisAdvantageOpen] = useState<boolean>(false);
  const advantageRef = useRef<HTMLTextAreaElement>(null);
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: string) => {
    const inputValue = e.target.value;
    const listLine = inputValue.split("\n").filter((x) => x != "");
    const filterSuggestion = listLine.length > 0 ? listLine[listLine.length - 1] : inputValue;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (type == "advantages") {
        setSelectedAdvantages(inputValue);
        const newSuggestions = getSuggestions(filterSuggestion.trim().replace("-", ""), type);
        if (newSuggestions.length > 0) {
          setSuggestions(newSuggestions);
          setIsSuggestAdvantageOpen(true);
          setIsSuggestDisAdvantageOpen(false);
        } else {
          setIsSuggestAdvantageOpen(false);
          setIsSuggestDisAdvantageOpen(false);
        }
      } else {
        setSelectedDisadvantages(inputValue);
        const newSuggestions = getSuggestions(filterSuggestion.trim().replace("-", ""), type);
        setSuggestions(newSuggestions);

        setIsSuggestDisAdvantageOpen(newSuggestions.length > 0);
        setIsSuggestAdvantageOpen(false);
      }
    }, 500);
  };

  const getSuggestions = (inputValue: string, type: string): Suggestion[] => {
    const allSuggestions =
      ListCategoryAssessmentType?.listPayload?.filter((item) => item.status === (type == "advantages" ? 1 : 2)) || [];
    return allSuggestions
      .filter(
        (item) => item.nameAssessmentType && item.nameAssessmentType.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((item) => ({
        value: item.nameAssessmentType || "",
        label: item.nameAssessmentType || ""
      }));
  };

  const handleSelectSuggestion = (option: Suggestion, type: string) => {
    if (type == "advantages") {
      setSelectedAdvantages((prev) => {
        const listLine = prev
          .split("\n")
          .filter((x) => x != "")
          .slice(0, -1);
        prev = listLine.join("\n");
        const newValue = prev ? `${prev}\n - ${option.label}\n` : ` - ${option.label}\n`;
        return newValue;
      });
      setIsSuggestAdvantageOpen(false);
    } else {
      setSelectedDisadvantages((prev) => {
        const listLine = prev
          .split("\n")
          .filter((x) => x != "")
          .slice(0, -1);
        prev = listLine.join("\n");
        const newValue = prev ? `${prev}\n - ${option.label}\n` : ` - ${option.label}\n`;
        return newValue;
      });
      setIsSuggestDisAdvantageOpen(false);
    }
  };

  useEffect(() => {
    const getReview = (): string => {
      const allSuggestions = ListCategoryReview?.listPayload || [];
      const combinedReviews = allSuggestions.map((item) => {
        const sortTitle = item.sort + ". " + item.title || "";
        const nameReview = item.nameReview || "";
        return `${sortTitle}\n${nameReview}`;
      });
      return combinedReviews.join("\n");
    };
    setBindingAddReview(getReview());
  }, [ListCategoryReview]);

  useEffect(() => {
    if (User && ListUserType) {
      const userTypeName = ListUserType?.listPayload?.find((item) => {
        return item.id === User?.payload.data.userTypeId;
      })?.typeName;
      if (userTypeName?.toLowerCase() === "hiệu trưởng" || userTypeName?.toLowerCase() === "phó hiệu trưởng") {
        setIsPrincipal(true);
      }
    }
  }, [User, ListUserType]);

  return (
    <>
      <Spin
        spinning={
          LoadingListCriteriaInEvaluationsOfUser && LoadingListCategoryReview && LoadingUser && LoadingListUserType
        }
      >
        <Modal
          title={
            <Typography.Title level={5} style={{ marginBottom: 10 }}>
              Thực hiện Gửi đánh giá
            </Typography.Title>
          }
          open={open}
          onOk={activeTabKey === "4" ? handleOk : () => {}}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Xác nhận gửi đánh giá"
          cancelText={"Hủy đánh giá"}
          width={1200}
          footer={activeTabKey === "4" ? undefined : null}
        >
          <Tabs defaultActiveKey="1" onChange={handleTabChange}>
            {/* Tab I. KẾT QUẢ TỰ ĐÁNH GIÁ */}
            <TabPane tab="KẾT QUẢ TỰ ĐÁNH GIÁ" key="1">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Kết quả tự nhận xét đánh giá: "
                    name={"addReviews"}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn nhận xét đánh giá"
                      }
                    ]}
                  >
                    <>
                      <TextArea
                        className="evaluation-addReviews"
                        placeholder="Nhận xét đánh giá"
                        rows={14}
                        defaultValue={bindingAddReview}
                        onChange={(e) => {
                          handleChangeAddReview(e.target.value);
                        }}
                      />
                    </>
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="TỰ NHẬN XÉT, XẾP LOẠI CHẤT LƯỢNG" key="2">
              <Col span={24}>
                <Form.Item
                  label="Ưu điểm: "
                  name={"advantages"}
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 22 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn Ưu điểm"
                    }
                  ]}
                >
                  <>
                    <TextArea
                      key={bindingAdvantage}
                      className="evaluation-advantages"
                      defaultValue={selectedAdvantages}
                      onChange={(e) => handleTextAreaChange(e, "advantages")}
                      placeholder="Đánh giá ưu điểm"
                      rows={7}
                      ref={advantageRef}
                    />
                    {suggestions && isSuggestAdvantageOpen && (
                      <ul className="evaluation-suggestions">
                        {suggestions.map((item, index) => (
                          <li key={index} onClick={() => handleSelectSuggestion(item, "advantages")}>
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Nhược điểm: "
                  name={"disAdvantages"}
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 22 }}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn nhược điểm"
                    }
                  ]}
                >
                  <>
                    <TextArea
                      key={bindingDisAdvantage}
                      className="evaluation-disAdvantages"
                      defaultValue={selectedDisadvantages}
                      onChange={(e) => handleTextAreaChange(e, "disAdvantages")}
                      placeholder="Đánh giá nhược điểm"
                      rows={7}
                    />
                    {suggestions && isSuggestDisAdvantageOpen && (
                      <ul className="evaluation-suggestions">
                        {suggestions.map((item, index) => (
                          <li key={index} onClick={() => handleSelectSuggestion(item, "disAdvantages")}>
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                </Form.Item>
              </Col>
            </TabPane>

            <TabPane tab="PHẦN DÀNH RIÊNG CHO VIÊN CHỨC QUẢN LÝ" key="3" disabled={!isPrincipal}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Kết quả hoạt động của cơ quan, tổ chức, đơn vị được giao quản lý, phụ trách: "
                    name={"KetQuaHoatDongCoQuan"}
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea
                      defaultValue={bindingKetQuaHoatDongCoQuan}
                      onChange={(e) => {
                        setBindingKetQuaHoatDongCoQuan(e.target.value);
                      }}
                      className="evaluation-addReviews"
                      placeholder="Kết quả hoạt động của cơ quan, tổ chức, đơn vị được giao quản lý, phụ trách"
                      rows={4}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Năng lực lãnh đạo, quản lý: "
                    name={"NangLucLanhDaoQuanLy"}
                    wrapperCol={{ span: 24 }}
                  >
                    <TextArea
                      defaultValue={bindingNangLucLanhDaoQuanLy}
                      onChange={(e) => {
                        setBindingNangLucLanhDaoQuanLy(e.target.value);
                      }}
                      className="evaluation-addReviews"
                      placeholder="Năng lực lãnh đạo, quản lý"
                      rows={4}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Năng lực tập hợp, đoàn kết: "
                    name={"NangLucTapHopDoanKet"}
                    wrapperCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Năng lực tập hợp, đoàn kết"
                      }
                    ]}
                  >
                    <TextArea
                      defaultValue={bindingNangLucTapHopDoanKet}
                      onChange={(e) => {
                        setBindingNangLucTapHopDoanKet(e.target.value);
                      }}
                      className="evaluation-addReviews"
                      placeholder="Năng lực tập hợp, đoàn kết"
                      rows={4}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="XÁC NHẬN GỬI ĐÁNH GIÁ" key="4">
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
                loading={LoadingInsertAndUpdateCriteriaOfPersonal}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 130, height: 40, color: "white", backgroundColor: "#1890ff" }}
                onClick={showModalxx}
              >
                Mẫu in ấn
              </Button>
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfPersonal}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 130, height: 40, color: "white", backgroundColor: "goldenrod" }}
                onClick={showModalx}
              >
                Giải trình
              </Button>
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfPersonal}
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
                Gửi đánh giá
              </Button>
              <Button
                loading={LoadingInsertAndUpdateCriteriaOfPersonal}
                icon={<SaveOutlined />}
                style={{ fontSize: 14, width: 130, height: 40, color: "white", backgroundColor: "#ff1346" }}
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
                  backgroundColor: "#1890ff",
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
        title="Gửi thông tin minh chứng, giải trình"
        open={isModalVisible}
        onOk={handleOkx}
        onCancel={handleCancelx}
        okText="Gửi"
        cancelText={"Hủy"}
      >
        <Dragger
          multiple={false}
          maxCount={1}
          beforeUpload={(filex) => {
            setFilex(filex);
            return false;
          }}
        >
          {" "}
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấn hoặc kéo thả tệp vào đây để tải lên tài liệu minh chứng</p>
          <p className="ant-upload-hint">
            Chỉ cho phép tải lên một tệp duy nhất. Không được phép tải lên dữ liệu công ty hoặc các tệp tin bị cấm.
          </p>
        </Dragger>
        <div style={{ marginTop: 16 }}>
          <TextArea
            rows={4}
            placeholder="Nhập giải trình vào đây nếu có"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </Modal>

      <Modal title="Mẫu in ấn" open={isModalVisiblex} onCancel={handleCancelxx} cancelText={"Hủy"} footer={null}>
        <p>Chọn mẫu xuất thích hợp</p>
        <Tabs defaultActiveKey="1">
          {/* Tab Word */}
          <TabPane tab="Word" key="1">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("word", downloadWordFile)}</div>
            )}
          </TabPane>

          {/* Tab PDF */}
          <TabPane tab="PDF" key="2">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("pdf", downloadPDFFile)}</div>
            )}
          </TabPane>

          {/* Tab Excel */}
          <TabPane tab="Excel" key="3">
            {loadingButton ? (
              <div style={{ textAlign: "center" }}>
                <Spin size="large" />
              </div>
            ) : (
              <div>{renderButtons("excel", handleExportReport)}</div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};

export const DetailsEvaluationsOfUser = WithErrorBoundaryCustom(_DetailsEvaluationsOfUser);

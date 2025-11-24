import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Button, Col, Spin, Table, TableColumnsType, TableProps, Row, Form, Space, Divider, Alert } from "antd";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";
import {
  useGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery,
  useUpdateSortMutation
} from "@API/services/EvaluationsCriteriaApis.service";
import React, { useContext, useEffect, useState } from "react";
import { useGetListTypeAssessmentQuery } from "@API/services/TypeAssessmentApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
import { arrayToTree, listItemBeforeStyle, listItemStyle, listStyle } from "@admin/features/evaluations";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CheckCircleOutlined, HolderOutlined, ReloadOutlined } from "@ant-design/icons";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { HandleError } from "@admin/components";

interface IProps {
  setVisible: (value: boolean) => void;
  idEvaluations?: string;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

function _DetailsAndSortingEvaluationsCriteria(props: IProps) {
  const { setVisible, idEvaluations } = props;
  const RowContext = React.createContext<RowContextProps>({});

  const DragHandle: React.FC = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);
    return (
      <Button
        type="text"
        size="small"
        icon={<HolderOutlined />}
        style={{ cursor: "move" }}
        ref={setActivatorNodeRef}
        {...listeners}
      />
    );
  };

  const {
    data: ListCriteriaOfEvaluationsCriteriaByIdEvaluations,
    isLoading: LoadingListCriteriaOfEvaluationsCriteriaByIdEvaluations,
    refetch: refetchListCriteriaOfEvaluationsCriteriaByIdEvaluations
  } = useGetListCriteriaOfEvaluationsCriteriaByIdEvaluationsQuery(
    {
      idEvaluations: idEvaluations!
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data: ListTypeAssessment, isLoading: LoadingListTypeAssessment } = useGetListTypeAssessmentQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [updateSort, { isLoading: LoadingUpdateSort }] = useUpdateSortMutation();

  const [data, setData] = useState<CategoryCriteriaDTO[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1
      }
    })
  );

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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setData((prev) => {
        // Helper function to find and update node children
        const updateNodeChildren: any = (nodes: CategoryCriteriaDTO[], activeId: string, overId: string) => {
          return nodes.map((node) => {
            if (node.children) {
              const activeIndex = node.children.findIndex((c) => c.id === activeId);
              const overIndex = node.children.findIndex((c) => c.id === overId);
              if (activeIndex >= 0 && overIndex >= 0) {
                const updatedChildren = arrayMove(node.children, activeIndex, overIndex);
                return { ...node, children: updatedChildren };
              }
              return { ...node, children: updateNodeChildren(node.children, activeId, overId) };
            }
            return node;
          });
        };

        // Update root level
        const activeRootIndex = prev.findIndex((i) => i.id === active.id);
        const overRootIndex = prev.findIndex((i) => i.id === over?.id);
        if (activeRootIndex >= 0 && overRootIndex >= 0) {
          return arrayMove(prev, activeRootIndex, overRootIndex);
        }

        return updateNodeChildren(prev, active.id, over?.id ?? "");
      });
    }
  };

  useEffect(() => {
    if (ListCriteriaOfEvaluationsCriteriaByIdEvaluations?.listPayload) {
      const categoryCriteriaPayload = ListCriteriaOfEvaluationsCriteriaByIdEvaluations.listPayload ?? [];
      const arrayTreeCategoryCriteria = arrayToTree(categoryCriteriaPayload);
      setData(arrayTreeCategoryCriteria);
    }
  }, [ListCriteriaOfEvaluationsCriteriaByIdEvaluations, idEvaluations]);

  const handleSubmit = async () => {
    const getFlatData = (nodes: CategoryCriteriaDTO[], result: CategoryCriteriaDTO[] = []): CategoryCriteriaDTO[] => {
      for (const node of nodes) {
        result.push(node);
        if (node.children) {
          getFlatData(node.children, result);
        }
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

  const onReload = async () => {
    try {
      const result = await refetchListCriteriaOfEvaluationsCriteriaByIdEvaluations().unwrap();
      if (result.success) {
        const categoryCriteriaPayload = result?.listPayload ?? [];
        const arrayTreeCategoryCriteria = arrayToTree(categoryCriteriaPayload);
        setData(arrayTreeCategoryCriteria);
      }
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  };

  const columns: TableColumnsType<CategoryCriteriaDTO> = [
    {
      key: "sort",
      dataIndex: "sort",
      align: "center",
      width: 80,
      render: () => <DragHandle />
    },
    {
      title: "Tên tiêu chí",
      dataIndex: "nameCriteria",
      key: "nameCriteria",
      render: (nameCriteria) => <div style={{ whiteSpace: "break-spaces", width: "100%" }}>{nameCriteria}</div>
    },
    {
      title: "Thang điểm đánh giá",
      dataIndex: "idTypeAssessment",
      key: "idTypeAssessment",
      render: (idTypeAssessment) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListTypeAssessment?.listPayload?.find((x) => x.id === idTypeAssessment)?.nameTypeAssessment}
        </div>
      )
    },
    {
      title: "Thuộc đơn vị",
      dataIndex: "idUnit",
      key: "idUnit",
      render: (idUnit) => (
        <div style={{ whiteSpace: "break-spaces", width: "100%" }}>
          {ListUnit?.listPayload?.find((x) => x.id === idUnit)?.unitName}
        </div>
      )
    }
  ];

  const propsTable: TableProps<CategoryCriteriaDTO> = {
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
    loading: LoadingListCriteriaOfEvaluationsCriteriaByIdEvaluations,
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
      spinning={LoadingListCriteriaOfEvaluationsCriteriaByIdEvaluations && LoadingListTypeAssessment && LoadingListUnit}
    >
      <Row gutter={16}>
        <Col span={24}>
          <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
            <SortableContext
              items={data.flatMap((node) => [node.id, ...node.children.map((child) => child.id)])}
              strategy={verticalListSortingStrategy}
            >
              <Table
                {...propsTable}
                expandIconColumnIndex={1}
                title={() => (
                  <Alert
                    message="Mô tả"
                    description={
                      <ul style={listStyle}>
                        <li style={listItemStyle}>
                          <span style={listItemBeforeStyle}>- </span>Bạn có thể sắp xếp các tiêu chí bằng cách di chuyển
                          chúng và nhấn nút &quot;Lưu thao tác&quot; để hoàn tất việc sắp xếp.
                        </li>
                      </ul>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
              />
            </SortableContext>
          </DndContext>
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
              <Button
                type="default"
                htmlType="reset"
                loading={LoadingUpdateSort}
                icon={<ReloadOutlined />}
                onClick={onReload}
              >
                Tải lại
              </Button>
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

export const DetailsAndSortingEvaluationsCriteria = WithErrorBoundaryCustom(_DetailsAndSortingEvaluationsCriteria);

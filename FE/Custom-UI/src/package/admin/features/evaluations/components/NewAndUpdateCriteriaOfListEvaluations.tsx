import WithErrorBoundaryCustom from "@units/errorBounDary/WithErrorBoundaryCustom";
import { Alert, Button, Col, Divider, Form, Row, Space, Spin, Switch, Table, TableProps } from "antd";
import { CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { CategoryCriteriaDTO } from "@models/categoryCriteriaDTO";
import { useGetListCategoryCriteriaAvailableQuery } from "@API/services/CategoryCriteriaApis.service";
import { useInsertAndUpdateListEvaluationsCriteriaMultiMutation } from "@API/services/EvaluationsCriteriaApis.service";
import React, { useEffect, useState } from "react";
import { HandleError } from "@admin/components";
import { ColumnsType, Key } from "antd/lib/table/interface";
import { useGetListTypeAssessmentQuery } from "@API/services/TypeAssessmentApis.service";
import { useGetListUnitAvailableQuery } from "@API/services/UnitApis.service";
import { listItemBeforeStyle, listItemStyle, listStyle } from "@admin/features/evaluations";

interface IProps {
  setVisible: (value: boolean) => void;
  idsEvaluations?: string[];
}

function arrayToTree(menuItems: CategoryCriteriaDTO[]) {
  const map = new Map<string, CategoryCriteriaDTO & { children: CategoryCriteriaDTO[] }>();

  for (const item of menuItems) {
    map.set(item.id, { ...item, children: [] });
  }

  const menuTree: (CategoryCriteriaDTO & { children: CategoryCriteriaDTO[] })[] = [];
  for (const item of menuItems) {
    const menuItem = map.get(item.id);
    if (menuItem) {
      if (!item.idParent || !map.has(item.idParent)) {
        menuTree.push(menuItem);
      } else {
        const parentItem = map.get(item.idParent);
        if (parentItem) {
          parentItem.children.push(menuItem);
        }
      }
    }
  }
  return menuTree;
}

function _NewAndUpdateCriteriaOfListEvaluations(props: IProps) {
  const { setVisible, idsEvaluations } = props;
  const [checkStrictly, setCheckStrictly] = useState(true);

  const {
    data: ListCategoryCriteria,
    isLoading: LoadingListCategoryCriteria,
    refetch: refetchListCategoryCriteria
  } = useGetListCategoryCriteriaAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListTypeAssessment, isLoading: LoadingListTypeAssessment } = useGetListTypeAssessmentQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const { data: ListUnit, isLoading: LoadingListUnit } = useGetListUnitAvailableQuery({
    pageSize: 0,
    pageNumber: 0
  });

  const [newEvaluationsCriteria, { isLoading: LoadingInsertEvaluationsCriteria }] =
    useInsertAndUpdateListEvaluationsCriteriaMultiMutation();

  const [data, setData] = useState<CategoryCriteriaDTO[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: Key[]) => {
      setSelectedRowKeys(selectedKeys);
    }
  };

  useEffect(() => {
    if (ListCategoryCriteria?.listPayload) {
      const categoryCriteriaPayload = ListCategoryCriteria.listPayload ?? [];
      const arrayTreeCategoryCriteria = arrayToTree(categoryCriteriaPayload);
      setData(arrayTreeCategoryCriteria);
    }
  }, [ListCategoryCriteria, idsEvaluations]);

  const onfinish = async () => {
    try {
      const result = await newEvaluationsCriteria({
        EvaluationsCriteria: {
          listIdCategoryCriteria: selectedRowKeys as string[],
          listIdEvaluations: idsEvaluations
        }
      }).unwrap();
      if (result.success) {
        setVisible(false);
        setCheckStrictly(true);
        setSelectedRowKeys([]);
      }
    } catch (e: any) {
      await HandleError(e);
    }
  };

  const onReload = async () => {
    await refetchListCategoryCriteria();
    setCheckStrictly(true);
    setSelectedRowKeys([]);
  };

  const columns: ColumnsType<CategoryCriteriaDTO> = [
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
      x: "max-content",
      y: window.innerHeight - 300
    },
    bordered: true,
    rowKey: (record) => record.id,
    columns: columns.map((item) => ({
      ellipsis: true,
      width: 150,
      ...item
    })),
    rowSelection: {
      ...rowSelection,
      checkStrictly: checkStrictly
    },
    loading: LoadingListCategoryCriteria,
    dataSource: data,
    pagination: false,
    size: "middle"
  };

  return (
    <div className="NewAndUpdateCriteriaOfEvaluations">
      <Spin spinning={LoadingListCategoryCriteria || LoadingListTypeAssessment || LoadingListUnit}>
        <Row gutter={16}>
          <Col span={24}>
            <Table
              {...propsTable}
              title={() => (
                <div>
                  <Alert
                    message="Mô tả"
                    description={
                      <ul style={listStyle}>
                        <li style={listItemStyle}>
                          <span style={listItemBeforeStyle}>- </span>Bạn có thể thêm các tiêu chí vào phiếu đánh giá
                          bằng cách chọn tiêu chí và nhấn nút &quot;Lưu thao tác&quot;.
                        </li>
                        <li style={listItemStyle}>
                          <span style={listItemBeforeStyle}>- </span>Bạn có thể xóa tiêu chí khỏi phiếu đánh giá bằng
                          cách bỏ chọn tiêu chí và nhấn nút &quot;Lưu thao tác&quot;.
                        </li>
                        <li style={listItemStyle}>
                          <span style={listItemBeforeStyle}>- </span>Lưu ý: Khi người dùng đã thực hiện đánh giá thì bạn
                          không thể thêm hoặc chỉnh sửa phiếu đánh giá này được nữa.
                        </li>
                      </ul>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />

                  <Space align="center" style={{ marginBottom: 8 }}>
                    Bật chế độ chọn từng hàng: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
                  </Space>
                </div>
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
                <Button
                  type="default"
                  htmlType="reset"
                  loading={LoadingInsertEvaluationsCriteria}
                  icon={<ReloadOutlined />}
                  onClick={onReload}
                >
                  Tải lại
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={LoadingInsertEvaluationsCriteria}
                  icon={<CheckCircleOutlined />}
                  style={{
                    float: "right"
                  }}
                  onClick={onfinish}
                >
                  Lưu thao tác
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export const NewAndUpdateCriteriaOfListEvaluations = WithErrorBoundaryCustom(_NewAndUpdateCriteriaOfListEvaluations);

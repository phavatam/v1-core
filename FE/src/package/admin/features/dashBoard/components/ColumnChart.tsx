import React from "react";
import { Column, ColumnConfig } from "@ant-design/plots";

interface DataItem {
  type: string;
  value: number;
}

interface ColumnChartProps {
  data: DataItem[];
}

export function ColumnChart({ data }: ColumnChartProps) {
  const config: ColumnConfig = {
    data,
    xField: "type",
    yField: "value",
    label: {
      position: "middle" as const,
      style: {
        fill: "#000",
        opacity: 0.6
      }
    },
    meta: {
      type: {
        alias: "type",
        formatter: (v: string) => `${v.split("/")[0]}`
      },
      value: {
        alias: "value"
      }
    },
    seriesField: "type",
    legend: {
      position: "top-left"
    }
  };

  return <Column {...config} />;
}

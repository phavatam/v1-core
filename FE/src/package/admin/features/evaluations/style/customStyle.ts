import React from "react";

export const listStyle: React.CSSProperties = {
  listStyle: "none",
  paddingLeft: 0,
  margin: 0
};

export const listItemStyle: React.CSSProperties = {
  position: "relative",
  paddingLeft: "1.5em",
  marginBottom: "8px"
};

export const listItemBeforeStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  fontWeight: "bold"
};

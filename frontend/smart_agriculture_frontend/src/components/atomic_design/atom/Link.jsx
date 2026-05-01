import React from "react";

const Link = ({ className = "", href = "#", children, ...liProps }) => {
  return (
    <li {...liProps}>
      <a href={href} className={className}>
        {children}
      </a>
    </li>
  );
};
export default Link;
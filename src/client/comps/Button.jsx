import React from "react";
import "../css/Button.css";

export default function Button(props) {
  const {children} = props;
  return (
    <>
      <div id="button-dark">
        <button>{children}</button>
      </div>
    </>
  );
}

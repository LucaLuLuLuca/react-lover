import React from "react";
import { FormControl, MenuItem, OutlinedInput, Select } from "@mui/material";
import { useState } from "react";
import { categorys } from "../../constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function TableCategory() {
  const [cateTitle, setCateTitle] = useState([]);
  const handleChange = (e) => {
    const {
      target: { value },
    } = e;
    setCateTitle(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <FormControl sx={{ margin: 1, width: 300, marginTop: 3 }}>
        <Select
          displayEmpty
          value={cateTitle}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            /* Render the selected value. You can only use it when the native prop is false (default). */
            if (selected.length === 0) {
              return <strong>Category</strong>;
            }
            return selected.join(", ");
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without Label" }}
        >
          <MenuItem disabled value="">
            <strong>Category</strong>
          </MenuItem>
          {categorys.map((category) => (
            <MenuItem key={category.id} value={category.title}>
              {category.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
export default TableCategory;

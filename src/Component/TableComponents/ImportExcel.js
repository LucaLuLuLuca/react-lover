import * as XLSX from "xlsx";
import UploadIcon from "@mui/icons-material/Upload";
import { Icon } from "@mui/material";

const ImportExcel = ({ Products, setProducts }) => {
  const handleOnImport = (e) => {
    const importFile = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(importFile);
    fileReader.onload = (e) => {
      const bufferArray = e.target.result;
      const workbook = XLSX.read(bufferArray, { type: "buffer" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const SliceRows = data.slice(1).map((r) =>
        r.reduce((acc, x, i) => {
          acc[data[0][i]] = x;
          return acc;
        }, {})
      );
      console.log("SliceRows", SliceRows);
      setProducts([...SliceRows, ...Products]);
    };
  };
  return (
    <Icon sx={{ Display: "flex" }} color="primary" component="label">
      <input
        hidden
        type="file"
        onChange={(e) => {
          handleOnImport(e);
        }}
      />

      <UploadIcon />
    </Icon>
  );
};

export default ImportExcel;

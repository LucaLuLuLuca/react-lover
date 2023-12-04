import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import { Icon } from "@mui/material";

const ExportExcel = ({ rows, handleSuccess, handleFail }) => {
  const handleOnExport = (rows) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "MyExcel.xlsx");

    !workbook
      ? handleFail("Fail! Try Harder")
      : handleSuccess("Exported, you did It");
  };

  return (
    <Icon
      sx={{ Display: "flex" }}
      color="primary"
      onClick={() => handleOnExport(rows)}
    >
      <DownloadIcon />
    </Icon>
  );
};
export default ExportExcel;

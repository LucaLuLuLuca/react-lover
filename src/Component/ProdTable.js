import React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Alert, Tooltip, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddRow from "./TableComponents/AddRow";
import ImportExcel from "./TableComponents/ImportExcel";
import ExportExcel from "./TableComponents/ExportExcel";
import EnhancedTableHead from "./TableComponents/TableHead";
import { apiGet, apiPost, apiDelete } from "../services";
import Notification from "./TableComponents/Notification";
import { Snackbar } from "@mui/material";
import EditRow from "./TableComponents/EditRow.js";
import { BaseStorageUrl } from "../environment";
import TableCategory from "./TableComponents/TableCategory.js";
import { categorys } from "../constants.js";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function ProdTable({ keyWord }) {
  const [editFormData, setEditFormData] = useState({
    category_id: null,
    id: "",
    title: "",
    description: "",
    price: "",
  });

  const [rows, setRows] = useState([]);
  const [originalData, setOriginalData] = useState([]); //Backup data.
  const [searchProds, setSearchProds] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [disable, setDisable] = useState(true);
  // const [selected, setSelected] = useState([]);
  const [onAddRow, setOnAddRow] = useState(false);
  const [image, setImage] = useState("");
  const [snackContent, setSnackContent] = useState("");
  const [openSn, setOpenSn] = useState(false);
  const [severity, setSeverity] = useState("success");
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState();
  const [editProductId, setEditProductId] = useState(null);

  const avatarStyle = {
    backgroundColor: "#2149e4",
    color: "white",
    margin: "0 10px",
  };

  //Snackbar
  const SnackAlert = React.forwardRef(function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const getCategoryTitleById = (id) =>
    categorys.find((category) => category.id === id)?.title || null;

  const handleSuccess = (content) => {
    setSnackContent(content);
    setOpenSn(true);
    setSeverity("success");
  };

  const handleFail = (content) => {
    setSnackContent(content);
    setOpenSn(true);
    setSeverity("error");
  };

  const handleCloseBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSn(false);
  };

  //Get Prods
  useEffect(() => {
    apiGet("products")
      // axios
      //   .get("https://app.spiritx.co.nz/api/products")
      .then((res) => {
        const data = res.data;
        data.map((prod) => (prod.price = parseInt(prod.price)));
        setOriginalData(res.data);
        setRows(res.data);
        handleSuccess("Log in successfully");
      })
      .catch((error) => {
        handleFail(error.message);
      });
  }, []);

  // Filter Prods
  useEffect(() => {
    setRows(
      originalData.filter((product) => {
        if (keyWord === "") {
          return product;
        }
      })
    );
  }, [keyWord, originalData]);

  //Search Prods
  useEffect(() => {
    setSearchProds(
      originalData.filter((product) => {
        if (
          product.title.toLowerCase().includes(keyWord) ||
          (product.description &&
            product.description.toLowerCase().includes(keyWord))
        )
          return product;
      })
    );
    setPage(0);
  }, [keyWord, originalData]);

  // Edit Data match
  useEffect(() => {
    rows.map((product) => {
      if (
        editFormData &&
        editFormData.id &&
        editFormData.category_id &&
        editFormData.title &&
        editFormData.description &&
        editFormData.price &&
        product.category_id === editFormData.category_id &&
        product.id === editFormData.id &&
        product.title === editFormData.title &&
        product.description === editFormData.description &&
        product.price === editFormData.price
      ) {
        setDisable(true);
      }
    });
  }, [rows, editFormData]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const addText = () => setOnAddRow(!onAddRow);

  const handleImageChange = (file) => {
    setImage(file);
  };

  const handleEditClick = (e, product) => {
    e.preventDefault();
    setEditProductId(product.id);
    const formValues = {
      category_id: product.category_id,
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      product_image: product.image,
    };
    setEditFormData(formValues);
  };

  const handleEditFormChange = (e, products) => {
    e.preventDefault();
    setEditFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => console.log(editFormData), [editFormData]);

  const handleEditFormSubmit = (e) => {
    let formData = new FormData();
    editFormData.title && formData.append("title", editFormData.title);
    console.log("form title", formData.get("title"));

    editFormData.description &&
      formData.append("description", editFormData.description);

    editFormData.price && formData.append("price", editFormData.price);

    editFormData.category_id &&
      formData.append("category_id", editFormData.category_id);

    image && formData.append("product_image", editFormData.image);
    formData.append("_method", "PUT");

    // Test
    console.log("edit", editFormData);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    // const visibleRows = useMemo(
    //   () =>
    //     (searchProds.length > 0 ? searchProds : rows)
    //       .sort(getComparator(order, orderBy))
    //       .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    //   [searchProds, rows, order, orderBy, page, rowsPerPage]
    // );

    // useEffect(() => {
    //   console.log("rows", rows);
    // }, [rows]);

    //Send PUT request, then edited data send to server.

    apiPost(`product/${editFormData.id}`, formData)
      .then((res) => {
        const newProducts = [...rows];
        console.log("newProducts", res.data);
        const index = rows.findIndex(
          (product) => product.id === editFormData.id
        );
        newProducts[index] = res.data;
        setRows(newProducts);
        console.log("newpro", newProducts);
        setEditProductId(null);

        handleSuccess("Edit Form Successfully!");
      })
      .catch((error) => {
        handleFail("Oh No");
      });
    setDisable(true);
  };

  const handleCancelClick = () => {
    setEditProductId(null);
    setDisable(true);
  };

  const handleDeleteClick = (id) => {
    apiDelete(`product/${productId}`)
      .then((res) => {
        const newProducts = [...rows];

        const index = rows.findIndex((product) => product.id === productId);
        console.log("index", index);
        newProducts.splice(index, 1);
        setRows(newProducts);
        console.log("newPro", newProducts);
        handleClose();
        handleSuccess("Delete successfully!");
      })
      .catch((error) => console.log("wrong!"));
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setProductId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: "1500px", margin: "0 auto" }}>
      <Box sx={{ display: "flex" }}>
        <Tooltip title="Add" placement="top">
          <Button variant="text">
            <AddCircleOutlineIcon onClick={() => addText()} />
          </Button>
        </Tooltip>
        <Tooltip title="Import Excel" placement="top">
          <Button variant="text">
            <ImportExcel rows={rows} setRows={setRows} />
          </Button>
        </Tooltip>
        <Tooltip title="Export Excel" placement="top">
          <Button variant="text">
            <ExportExcel
              rows={rows}
              handleSuccess={handleSuccess}
              handleFail={handleFail}
            />
          </Button>
        </Tooltip>
        <TableCategory />
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: "auto" }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              // numSelect={selected.length}
              order={order}
              orderBy={orderBy}
              rowCount={rows.length}
              onRequestSort={handleRequestSort}
              setEditProductId={setEditProductId}
            />
            <TableBody>
              {onAddRow && (
                <AddRow
                  setOnAddRow={setOnAddRow}
                  rows={rows}
                  setRows={setRows}
                  image={image}
                  setImage={setImage}
                  handleImageChange={(e) => handleImageChange(e)}
                  handleSuccess={handleSuccess}
                  handleFail={handleFail}
                />
              )}

              {(searchProds.length > 0 ? searchProds : rows)
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product, index) => {
                  return (
                    <TableRow key={product.id}>
                      {editProductId === product.id ? (
                        <EditRow
                          editFormData={editFormData}
                          rows={rows}
                          key={"edit" + index}
                          handleEditFormChange={handleEditFormChange}
                          handleEditFormSubmit={handleEditFormSubmit}
                          handleCancelClick={handleCancelClick}
                          handleImageChange={handleImageChange}
                          disable={disable}
                          image={image}
                          setDisable={setDisable}
                          setEditFormData={setEditFormData}
                        />
                      ) : (
                        <>
                          <TableCell
                            align="center"
                            component="th"
                            padding="none"
                            scope="row"
                          >
                            {product.title}
                          </TableCell>
                          <TableCell align="center">
                            {product.description}
                          </TableCell>
                          <TableCell align="center">{product.price}</TableCell>
                          <TableCell align="center">
                            {getCategoryTitleById(
                              parseInt(product.category_id)
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {product.product_image && (
                              <img
                                src={`${BaseStorageUrl}${product.product_image}`}
                                alt="product-img"
                                width="110"
                                height="90"
                              />
                            )}
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip title="Edit" placement="left">
                              <IconButton
                                style={avatarStyle}
                                onClick={(e) => handleEditClick(e, product)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" placement="right">
                              <IconButton
                                style={avatarStyle}
                                onClick={() => {
                                  handleClickOpen(product.id);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={(searchProds.length > 0 ? searchProds : rows).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {(searchProds.length > 0 ? searchProds : rows).length === 0 && (
          <div>
            <h2 style={{ color: "red" }}>No Matching result</h2>
          </div>
        )}
        <Notification
          open={open}
          handleClose={handleClose}
          handleDeleteClick={handleDeleteClick}
          productId={productId}
        />
        <Snackbar
          open={openSn}
          autoHideDuration={3000}
          onClose={handleCloseBar}
        >
          <SnackAlert onClose={handleCloseBar} severity={severity}>
            {snackContent}
          </SnackAlert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

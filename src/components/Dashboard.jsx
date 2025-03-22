import { useMemo, useEffect, useState } from "react";
import Popup from "./Popup";
import { toast } from "react-hot-toast";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons
} from "material-react-table";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    addCustomer,
    getCustomersByUser,
    addPurchase,
    addPayment,
    deleteCustomer,
} from "../redux/actions/customers";
import Loading from "./Loading";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  TextField
} from "@mui/material";
import {getUserID} from "../userInfo";


const Dashboard = () => {
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const id = getUserID();
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCustomersByUser(id));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "Id",
        size: 0,
        enableEditing: false,
      },
      {
        accessorKey: "userId",
        header: "userId",
        size: 0,
        enableEditing: false,
      },
      {
        accessorKey: "name",
        header: "name",
        size: 250,
        enableEditing: true,
      },
      {
        accessorKey: "phone",
        header: "phone",
        size: 250,
        enableEditing: true,
        enableClickToCopy: true,
      },
      {
        accessorKey: "total",
        header: "total",
        size: 250,
        enableEditing: true,
      },{
        accessorKey: "transactions",
        header: "Transactions",
        size: 350,
        enableEditing: false,
        Cell: ({ cell }) => {
          const transactions = cell.getValue();
          if (!transactions || transactions.length === 0) return "No transactions";
          
          return (
            <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  <strong>{transaction.type}:</strong> {transaction.amount} ({new Date(transaction.date).toLocaleDateString()}) - {transaction.for}
                </li>
              ))}
            </ul>
          );
        },
      },
    ],
    []
  );

//   const handleSaveUser = async ({ values, table }) => {
//     dispatch(
//       updateUser(
//         values._id,
//         token,
//         values.firstName,
//         values.lastName,
//         values.email,
//         values.role
//       )
//     );
//     toast.success("User updated successfully!")
//     table.setEditingRow(null); //exit editing mode
//   };

//   const handleDelete = async (id) => {
//     dispatch(deleteUser(id, token));
//     toast.success("User deleted successfully!")
//     setOpenDeleteConfirmModal(null);
//   };

  const handleAddingCustomer = async ({ values, table }) => {
    dispatch(addCustomer(name, phone))
    table.setCreatingRow(null);
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  };
  const table = useMaterialReactTable({
    initialState: { columnVisibility: { _id: false } },
    columns,
    data: customers.length !== 0 ? customers : [],
    createDisplayMode: "modal", //default ('row', and 'custom' are also available)
    editDisplayMode: "modal", //default ('row', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    //getRowId: (row) => row.id,
    // onEditingRowSave: handleSaveUser,
    onCreatingRowSave: handleAddingCustomer,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => setOpenDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row }) => (
      <>
        <DialogTitle variant="h3">Add new customer</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: "20px" }}
        >
         <TextField
            type="text"
            label="name"
            onChange={(event) => {
              setName(event.target.value);
            }}
            required
          />
          <TextField
            type="text"
            label="phone"
            onChange={(event) => {
              setPhone(event.target.value);
            }}
            required
          />
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); 
        }}
        style={{backgroundColor:"rgba(253,187,45,1)", padding:"10px", textTransform:"none", fontSize:"20px"}}
      >
        Add customer
      </Button>
    ),
  });
  if (openDeleteConfirmModal !== null) {
    return(
    <div>
      <MaterialReactTable table={table} />
      <Popup
        title="Are you sure you want to delete this customer?"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onReject={() => {
          setOpenDeleteConfirmModal(null);
        }}
        // onAccept={() => handleDelete(openDeleteConfirmModal.original._id)}
      />
    </div>
    );
  }
  if (customers.length === 0 || loading) {
    return (
      <>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      </>
    );
  }
  return <MaterialReactTable table={table} />;
};

export default Dashboard;
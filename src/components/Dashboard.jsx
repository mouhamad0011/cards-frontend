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
    editCustomer
} from "../redux/actions/customers";
import Loading from "./Loading";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentIcon from "@mui/icons-material/Payment";
import WalletIcon from "@mui/icons-material/Wallet";
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
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        accessorKey: "name",
        header: "name",
        size: 100,
        enableEditing: true,
      },
      {
        accessorKey: "phone",
        header: "phone",
        size: 100,
        enableEditing: true,
        enableClickToCopy: true,
      },
      {
        accessorKey: "total",
        header: "total",
        size: 100,
        enableEditing: false,
      },{
        accessorKey: "transactions",
        header: "Transactions",
        size: 300,
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

  const handleUpdateCustomer = async ({ values, table }) => {
    dispatch(
      editCustomer(
        values._id,
        values.name,
        values.phone
      )
    );
    toast.success("Customer updated successfully!")
    table.setEditingRow(null); 
  };

  const handleDelete = async (id) => {
    dispatch(deleteCustomer(id));
    setOpenDeleteConfirmModal(null);
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
    toast.success("Customer deleted successfully!")
  };

  const handleAddingCustomer = async ({ table }) => {
    dispatch(addCustomer(id, name, phone));
    table.setCreatingRow(null);
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000);
    toast.success("Customer added successfully!")
  };

  const handleAddPurchase = async () => {
    if (!selectedCustomer || !amount || !description) {
      toast.error("Please fill all fields!");
      return;
    }
    dispatch(addPurchase(selectedCustomer._id, amount, description));
    setOpenPurchaseModal(false);
    setAmount("");
    setDescription("");
    toast.success("Purchase added successfully!");
  };
  
  const handleAddPayment = async () => {
    if (!selectedCustomer || !amount || !description) {
      toast.error("Please fill all fields!");
      return;
    }
    dispatch(addPayment(selectedCustomer._id, amount, description));
    setOpenPaymentModal(false);
    setAmount("");
    setDescription("");
    toast.success("Payment added successfully!");
  };


  const table = useMaterialReactTable({
    initialState: { columnVisibility: { _id: false } },
    columns,
    data: customers.length !== 0 ? customers : [],
    createDisplayMode: "modal", 
    editDisplayMode: "modal", 
    enableEditing: true,
    getRowId: (row) => row.id,
    onEditingRowSave: handleUpdateCustomer,
    onCreatingRowSave: handleAddingCustomer,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
         <Tooltip title="Purchase">
  <IconButton onClick={() => {
    setSelectedCustomer(row.original);
    setOpenPurchaseModal(true);
  }}>
    <WalletIcon />
  </IconButton>
</Tooltip>

<Tooltip title="Payment">
  <IconButton onClick={() => {
    setSelectedCustomer(row.original);
    setOpenPaymentModal(true);
  }}>
    <PaymentIcon />
  </IconButton>
</Tooltip>

        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)} >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="default" onClick={() => setOpenDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row }) => (
      <>
        <DialogTitle variant="h4">Add customer</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: "30px" }}
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
        style={{backgroundColor:"rgba(253,187,45,1)", padding:"5px", textTransform:"none", fontSize:"20px",}}
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
        onAccept={() => handleDelete(openDeleteConfirmModal.original._id)}
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
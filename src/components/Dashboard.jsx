import { useMemo, useEffect, useState } from "react";
import Popup from "./Popup";
import { toast } from "react-hot-toast";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from "material-react-table";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addCustomer,
  getCustomersByUser,
  addPurchase,
  addPayment,
  deleteCustomer,
  editCustomer,
  clearTransactionsHistory,
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
  TextField,
  Modal,
} from "@mui/material";
import { getUserID } from "../userInfo";

const Dashboard = () => {
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [openPurchaseModal, setOpenPurchaseModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [forPeople, setForPeople] = useState("Main");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [custId, setCustId] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState(null);
  const [filterFor, setFilterFor] = useState("");
  const id = getUserID();
  const customers = useSelector((state) => state.customers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/");
    } else {
      dispatch(getCustomersByUser(id));
    }
  }, [dispatch]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "fit-content",
    height: "fit-content",
    maxWidth: "90%",
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
  };

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
        Cell: ({ row }) => (
          <span
            onClick={() => {
              {
                setSelectedTransactions(row.original.transactions);
              }
              setCustId(row.original._id);
            }}
            style={{ cursor: "pointer" }}
          >
            {row.original.name}
          </span>
        ),
        size: 100,
        enableEditing: true,
      },
      {
        accessorKey: "phone",
        header: "phone",
        Cell: ({ row }) => (
          <span
            onClick={() => {
              {
                setSelectedTransactions(row.original.transactions);
              }
              setCustId(row.original._id);
            }}
            style={{ cursor: "pointer" }}
          >
            {row.original.phone}
          </span>
        ),
        size: 100,
        enableEditing: true,
        enableClickToCopy: true,
      },
      {
        accessorKey: "total",
        header: "total",
        Cell: ({ row }) => (
          <span
            onClick={() => {
              {
                setSelectedTransactions(row.original.transactions);
              }
              setCustId(row.original._id);
            }}
            style={{ cursor: "pointer" }}
          >
            {row.original.total}
          </span>
        ),
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: "transactions",
        header: "Transactions",
        size: 300,
        enableEditing: false,
        Cell: ({ cell, row }) => {
          const transactions = cell.getValue();
          if (!transactions || transactions.length === 0)
            return "No transactions";
          const groupedTransactions = transactions.reduce(
            (acc, transaction) => {
              const key = transaction.for || "Main";
              const amount =
                transaction.type === "payment"
                  ? -transaction.amount
                  : transaction.amount;

              if (!acc[key]) {
                acc[key] = { totalAmount: 0 };
              }
              acc[key].totalAmount += amount;
              return acc;
            },
            {}
          );

          return (
            <ul
              style={{
                padding: 0,
                margin: 0,
                listStyleType: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                {
                  setSelectedTransactions(transactions);
                }
                setCustId(row.original._id);
              }}
            >
              {Object.entries(groupedTransactions).map(([key, data]) => (
                <li key={key}>
                  <strong>{key}:</strong> {data.totalAmount}
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
    dispatch(editCustomer(values._id, values.name, values.phone));
    toast.success("Customer updated successfully!");
    table.setEditingRow(null);
  };

  const handleDelete = async (id) => {
    dispatch(deleteCustomer(id));
    setOpenDeleteConfirmModal(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    toast.success("Customer deleted successfully!");
  };

  const handleClear = async (id) => {
    dispatch(clearTransactionsHistory(id));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    setSelectedTransactions(null);
    toast.success("Transactions history cleared successfully!");
  };

  const handleAddingCustomer = async ({ table }) => {
    dispatch(addCustomer(id, name, phone));
    table.setCreatingRow(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    toast.success("Customer added successfully!");
  };

  const handleAddPurchase = async () => {
    if (!selectedCustomer || !amount) {
      toast.error("Please fill all fields!");
      return;
    }
    dispatch(addPurchase(selectedCustomer, amount, forPeople, description, id));
    setOpenPurchaseModal(false);
    setAmount(0);
    setDescription("");
    toast.success("Purchase added successfully!");
  };

  const handleAddPayment = async () => {
    if (!selectedCustomer || !amount) {
      toast.error("Please fill all fields!");
      return;
    }
    dispatch(
      addPayment(selectedCustomer._id, amount, forPeople, description, id)
    );
    setOpenPaymentModal(false);
    setAmount(0);
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
          <IconButton
            onClick={() => {
              setSelectedCustomer(row.original._id);
              setOpenPurchaseModal(true);
            }}
          >
            <WalletIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Payment">
          <IconButton
            onClick={() => {
              setSelectedCustomer(row.original);
              setOpenPaymentModal(true);
            }}
          >
            <PaymentIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="default"
            onClick={() => setOpenDeleteConfirmModal(row)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row }) => (
      <>
        <DialogTitle variant="h4">Add customer</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "30px",
          }}
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
        sx={{
          backgroundColor: "rgba(253,187,45,1)",
          padding: "5px",
          textTransform: "none",
          fontSize: "20px",
          "@media (min-width: 350px) and (max-width: 500px)": {
            fontSize: "17px",
          }, 
          "@media (min-width: 250px) and (max-width: 350px)": {
            fontSize: "14px",
          },
        }}
      >
        Add customer
      </Button>
    ),
  });

  if (openDeleteConfirmModal !== null) {
    return (
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
  return (
    <>
      {" "}
      <Modal
        open={openPurchaseModal}
        onClose={() => setOpenPurchaseModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DialogTitle variant="h4">Purchase</DialogTitle>
          <TextField
            type="number"
            label="Amount"
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            required
          />
          <TextField
            type="text"
            label="For"
            onChange={(event) => {
              setForPeople(event.target.value);
            }}
          />
          <TextField
            type="text"
            label="Description"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
          <DialogActions>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(253,187,45,1)",
                padding: "5px",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={handleAddPurchase}
            >
              Add
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(253,187,45,1)",
                padding: "5px",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={() => setOpenPurchaseModal(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Modal>
      <Modal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DialogTitle variant="h4">Payment</DialogTitle>
          <TextField
            type="number"
            label="Amount"
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            required
          />
          <TextField
            type="text"
            label="For"
            onChange={(event) => {
              setForPeople(event.target.value);
            }}
          />
          <TextField
            type="text"
            label="Description"
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
          <DialogActions>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(253,187,45,1)",
                padding: "5px",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={handleAddPayment}
            >
              Add
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(253,187,45,1)",
                padding: "5px",
                textTransform: "none",
                fontSize: "15px",
              }}
              onClick={() => setOpenPaymentModal(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Modal>
      <Modal
        open={selectedTransactions !== null}
        onClose={() => {
          setSelectedTransactions(null);
          setFilterFor("");
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <DialogTitle variant="h4">History</DialogTitle>

          <TextField
            label="Filter by"
            variant="outlined"
            fullWidth
            value={filterFor}
            onChange={(e) => setFilterFor(e.target.value)}
            sx={{ mb: 2 }}
          />

          <ul style={{ padding: 0, margin: 0, listStyleType: "none" }}>
            {selectedTransactions &&
              selectedTransactions
                .filter((transaction) =>
                  filterFor
                    ? transaction.for
                        ?.toLowerCase()
                        .includes(filterFor.toLowerCase())
                    : true
                )
                .map((transaction, index) => (
                  <li key={index}>
                    <strong>{transaction.type}:</strong> {transaction.amount} (
                    {new Date(transaction.date).toLocaleDateString()})
                    {transaction.for ? ` - ${transaction.for}` : " - main"}
                    {transaction.description
                      ? ` - ${transaction.description}`
                      : ""}
                  </li>
                ))}
          </ul>
          <Button
            variant="contained"
            style={{
              backgroundColor: "rgba(253,187,45,1)",
              padding: "5px",
              textTransform: "none",
              fontSize: "17px",
              width: "100%",
            }}
            onClick={() => handleClear(custId)}
          >
            Clear history
          </Button>
        </Box>
      </Modal>
      <MaterialReactTable table={table} />
    </>
  );
};

export default Dashboard;

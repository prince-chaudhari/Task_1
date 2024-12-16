import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Cookies from "js-cookie";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableHead: {
    backgroundColor: '#f2f2f2',
  },
  tableCell: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
  },
  container: {
    marginTop: 20,
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
  },
});

const Home = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("")
  const [toastOpen, setToastOpen] = useState(false);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const toggleUsers = async () => {
    const token = Cookies.get("jwt");

    if(!token){
      setError("Please log in first.")
      setToastOpen(true)
      return
    }

    if (!show) {
      await axios
        .get('http://localhost:7777/users', { withCredentials: true })
        .then((data) => {
          setUsers(data.data);
          setShow(true);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setShow(false);
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" className={classes.title}>
        Users
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleUsers}
        className={classes.button}
      >
        {show ? 'Hide Users' : 'Show Users'}
      </Button>
      {show && (
        <TableContainer component={Paper} className={classes.container}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableCell}>Sr. No.</TableCell>
                <TableCell className={classes.tableCell}>Full Name</TableCell>
                <TableCell className={classes.tableCell}>Email</TableCell>
                <TableCell className={classes.tableCell}>Number</TableCell>
                <TableCell className={classes.tableCell}>City</TableCell>
                <TableCell className={classes.tableCell}>State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.number}</TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>{user.state}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleToastClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;

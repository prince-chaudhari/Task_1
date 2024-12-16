import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    TextField,
    Button,
    MenuItem,
    Grid,
    Typography,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import Captcha from "./Captcha";
import Cookies from "js-cookie";

const SignIn = () => {

    const [captchaInput, setCaptchaInput] = useState("");
    const [error, setError] = useState("")
    const [toastOpen, setToastOpen] = useState(false);
    const navigate = useNavigate();

    const handleCaptchaChange = (value) => {
        setCaptchaInput(value);
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const signIn = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const userData = Object.fromEntries(formData.entries());

        try {
            await axios.post("http://localhost:7777/verify-captcha", { captchaInput }, { withCredentials: true });

            const response = await axios.post("http://localhost:7777/signin", userData, { withCredentials: true });
            if (response.status === 200) {
                const { token } = response.data; // Assuming the backend sends { token: "JWT_TOKEN" }

                // Store the JWT in a cookie
                Cookies.set("jwt", token);
                console.log("Login successful, JWT stored in cookie");
            }
            navigate("/home");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Signin failed. Please try again.");
            setToastOpen(true);
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundImage: "url('/network-connection-background-gradient_23-2148879893.avif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Box
                px={3}
                py={4}
                sx={{
                    backgroundColor: "#fff",
                    maxWidth: 400,
                    borderRadius: "10px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    maxHeight: "80vh", // Set maximum height for the form container
                    overflow: "hidden", // Prevent content overflow
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>
                <Box
                    sx={{
                        maxHeight: "calc(80vh - 56px)", // Adjust height to include padding and typography
                        overflowY: "auto", // Enable vertical scrolling
                        paddingRight: "8px", // Add some space for the scrollbar
                        paddingTop: "8px", // Add some space for the scrollbar
                    }}
                >
                    <form onSubmit={signIn}>
                        <Grid container spacing={2}>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    id="email"
                                    variant="outlined"
                                    required
                                />

                            </Grid>


                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Password"
                                    id="password"
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Captcha onCaptchaInputChange={handleCaptchaChange} />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>

                {/* Snackbar */}
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
            </Box>
        </Box>
    )
}

export default SignIn
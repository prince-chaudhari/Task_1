import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

function SignUp() {
    const [emailError, setEmailError] = useState(""); // Email validation error
    const [numberError, setNumberError] = useState(""); // Phone validation error
    const [passwordError, setPasswordError] = useState(""); // Password validation error
    const [userError, setUserError] = useState(""); // Server error
    const [toastOpen, setToastOpen] = useState(false); // Toast visibility
    const navigate = useNavigate();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    const [captchaInput, setCaptchaInput] = useState("");

    const handleCaptchaChange = (value) => {
        setCaptchaInput(value);
    };

    const handleToastClose = () => {
        setToastOpen(false);
    };

    const signUp = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const userData = Object.fromEntries(formData.entries());
        const { email, number, password, confirmPassword } = userData;


        // Validate email
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        } else {
            setEmailError("");
        }


        // Validate phone number
        if (number.length !== 10) {
            setNumberError("Please enter a 10-digit phone number.");
            return;
        } else {
            setNumberError("");
        }

        // Validate passwords
        if (!passwordRegex.test(password)) {
            setPasswordError(
                "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
            );
            return;
        } else if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        } else {
            setPasswordError("");
        }

        try {
            await axios.post("http://localhost:7777/verify-captcha", { captchaInput }, { withCredentials: true });

            await axios.post("http://localhost:7777/signup", userData);
            navigate("/home");
        } catch (error) {
            console.error(error);
            setUserError(error.response?.data?.message || "Signup failed. Please try again.");
            setToastOpen(true);
        }
    };

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
                    Sign Up
                </Typography>
                <Box
                    sx={{
                        maxHeight: "calc(80vh - 56px)", // Adjust height to include padding and typography
                        overflowY: "auto", // Enable vertical scrolling
                        paddingRight: "8px", // Add some space for the scrollbar
                    }}
                >
                    <form onSubmit={signUp}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="fullname"
                                    id="fullname"
                                    variant="outlined"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    id="email"
                                    variant="outlined"
                                    error={!!emailError}
                                    helperText={emailError}
                                    onChange={(e) => {
                                        setEmailError(
                                            emailRegex.test(e.target.value)
                                                ? ""
                                                : "Please enter a valid email address."
                                        );
                                    }}
                                    required
                                />

                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="number"
                                    id="number"
                                    variant="outlined"
                                    error={!!numberError}
                                    helperText={numberError}
                                    inputProps={{ maxLength: 10 }}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                    onChange={(e) => {
                                        setNumberError(
                                            e.target.value.length === 10
                                                ? ""
                                                : "Please enter a 10-digit phone number."
                                        );
                                    }}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="City"
                                    name="city"
                                    id="city"
                                    variant="outlined"
                                    defaultValue="Mehsana"
                                    required
                                >
                                    <MenuItem value="Mehsana">Mehsana</MenuItem>
                                    <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
                                    <MenuItem value="Surat">Surat</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="State"
                                    name="state"
                                    id="state"
                                    variant="outlined"
                                    defaultValue="Gujarat"
                                    required
                                >
                                    <MenuItem value="Gujarat">Gujarat</MenuItem>
                                    <MenuItem value="Delhi">Delhi</MenuItem>
                                    <MenuItem value="Bihar">Bihar</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    type="password"
                                    label="Password"
                                    id="password"
                                    variant="outlined"
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    onChange={(e) => {
                                        setPasswordError(
                                            passwordRegex.test(e.target.value)
                                                ? ""
                                                : "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
                                        );
                                    }}

                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    type="password"
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    id="confirmPassword"
                                    variant="outlined"
                                    error={!!passwordError}
                                    helperText={passwordError}
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
                    autoHideDuration={4000}
                    onClose={handleToastClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert onClose={handleToastClose} severity="error" sx={{ width: "100%" }}>
                        {userError}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}

export default SignUp;

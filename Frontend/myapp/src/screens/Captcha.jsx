import React, { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Captcha = ({ onCaptchaInputChange }) => {
    const [captchaUrl, setCaptchaUrl] = useState("http://localhost:7777/captcha?_=" + Date.now());

    const [captchaInput, setCaptchaInput] = useState("");

    const refreshCaptcha = () => {
        setCaptchaUrl("http://localhost:7777/captcha?_=" + Date.now()); // Avoid caching
    };

    const handleChange = (e) => {
        setCaptchaInput(e.target.value);
        onCaptchaInputChange(e.target.value); // Pass input to parent
    };

    return (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img
                src={captchaUrl}
                alt="captcha"
                style={{ height: "50px", display: "block", margin: "0 auto" }}
            />
            <IconButton onClick={refreshCaptcha} aria-label="refresh captcha">
                <RefreshIcon style={{ color: "green" }} />
            </IconButton>
            <TextField
                fullWidth
                label="Enter Captcha"
                value={captchaInput}
                onChange={handleChange}
                variant="outlined"
                style={{ marginTop: "10px" }}
            />
        </div>
    );
};

export default Captcha;

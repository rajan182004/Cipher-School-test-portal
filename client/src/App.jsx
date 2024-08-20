import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import GoogleAuthSuccess from "./components/GoogleAuthSuccess";
import VerifyEmail from "./components/VerifyEmail";
import Test from "./pages/Test";
import AllTests from "./pages/AllTests";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Test Routes */}
        <Route path="/test/all" element={<AllTests />} />
        <Route path="/test/:id" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;

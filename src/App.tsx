import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthLayout } from './components/AuthLayout';

import { Register } from './pages/Register';
import { EnterPassword } from './pages/EnterPassword';
import { TwoFactor } from './pages/TwoFactor';
import { ForgotPassword } from './pages/ForgotPassword';
import { CheckEmail } from './pages/CheckEmail';
import { ResetPassword } from './pages/ResetPassword';
import { AccountLocked } from './pages/AccountLocked';
import { Success } from './pages/Success';

function App() {
  return (
    <Router>
      <Routes>

        {/* First page = Registration */}
        <Route
          path="/"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

        <Route element={<AuthLayout />}>

          {/* Registration */}
          <Route
            path="/register"
            element={<Register />}
          />

          {/* Login / Password */}
          <Route
            path="/login"
            element={<EnterPassword />}
          />

          {/* Two Factor */}
          <Route
            path="/2fa"
            element={<TwoFactor />}
          />

          {/* Forgot Password */}
          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* Check Email */}
          <Route
            path="/check-email"
            element={<CheckEmail />}
          />

          {/* Reset Password */}
          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          {/* Account Locked */}
          <Route
            path="/locked"
            element={<AccountLocked />}
          />

          {/* Success */}
          <Route
            path="/success"
            element={<Success />}
          />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
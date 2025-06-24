import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AcademicDashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/PrivateRoute';
import Admin_Panel from './pages/Admin_panel';
import AdminLogin from './pages/AdminLogin';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route
						index
						element={
							<PrivateRoute>
								<Home />
							</PrivateRoute>
						} />
					<Route
					  path="/Dashboard"
					  	   element={
							  <PrivateRoute>
									<AcademicDashboard />
								</PrivateRoute>
						    } />
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
				</Route>

				<Route path="/login" element={<Login />} />
				<Route path="/admin-login" element={<AdminLogin/>} />
				<Route path="/admin-panel" element={<Admin_Panel/>} />
				<Route path="/sign-up" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
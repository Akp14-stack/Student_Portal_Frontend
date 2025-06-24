import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { GoEye, GoEyeClosed } from "react-icons/go";
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Config from '../Config/Config';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();


	const handleLogin = async (e) => {
		e.preventDefault();
		let mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!email) return toast.warning('Email is required!');
		if (!mailRegex.test(email)) return toast.warning('Email is not valid!');
		if (!password) return toast.warning('Password is required!')


		try {

			let response = await fetch(`${Config.backendUrl}/auth/signin`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						email,
						password
					}
				),
			});
			response = await response.json();

			if (response.status) {
				toast.success('Login successful!')
				navigate('/');
				localStorage.setItem('token', response.token);
				localStorage.setItem('userId', response.data._id);

			} else {
				toast.error(response.message);
			}

		} catch (error) {
			console.error('Error:', error);
			return;
		}
	};

	return (
		<>
			<Header />
			<Container className="mt-5">
				<ToastContainer />
				<Row className="justify-content-md-center">
					<Col xs={12} md={6}>
						<h2 className="mb-4 text-center">Login</h2>
						<Form onSubmit={handleLogin}>
							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<div className="position-relative">
									<Form.Control
										type={showPassword ? 'text' : 'password'}
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
									<span
										onClick={() => setShowPassword(!showPassword)}
										className="position-absolute top-50 end-0 translate-middle-y me-3"
										style={{ cursor: 'pointer' }}
									>
										{showPassword ? <GoEyeClosed size={20} /> : <GoEye size={20} />}
									</span>
								</div>
							</Form.Group>

							<div className="d-grid">
								<Button variant="primary" type="submit">
									Login
								</Button>
							</div>
							<div className="d-grid mt-3">
								<Link to="/sign-up" style={{ textDecoration: 'none' }}>
									<Button className='btn btn-secondary'>
										Sign Up
									</Button>
								</Link>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default Login;

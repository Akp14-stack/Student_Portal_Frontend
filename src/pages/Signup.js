import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Config from '../Config/Config';


function SignUp() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();
		let mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!name) return toast.warning('Name is required!');
		if (!email) return toast.warning('Email is required!');
		if (!mailRegex.test(email)) return toast.warning('Email is not valid!');
		if (!password) return toast.warning('Password is required!');
		if (password.length < 6) return toast.warning('Password must be at least 6 characters long!');
		if (password !== confirmPassword) return toast.warning('Passwords do not match!');

		// Check if the email is already registered
		// Assuming you have an API endpoint to check if the email is already registered
		try {

			let response = await fetch(`${Config.backendUrl}/auth/signup`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						name,
						email,
						password
					}
				),
			});
			response = await response.json();

			// Check if the response is successful
			// Assuming the response contains a status field indicating success or failure
			if (response.status) {
				navigate('/');
				toast.success('Sign-Up successful!')
				localStorage.setItem('token', response.token);
				localStorage.setItem('userId', response.data._id);
			} else {
				toast.error(response.message);
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('An error occurred during sign up. Please try again.');
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
						<h2 className="mb-4 text-center">Sign Up</h2>
						<Form onSubmit={handleSignUp}>
							<Form.Group className="mb-3" controlId="formBasicName">
								<Form.Label>Name</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter name"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</Form.Group>

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
								<Form.Control
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicConfirmPassword">
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
							</Form.Group>

							<div className="d-grid">
								<Button variant="success" type="submit">
									Sign Up
								</Button>
							</div>
							<div className="d-grid mt-3">
								<Link to="/login" style={{ textDecoration: 'none' }}>
									<Button className='btn btn-secondary'>
										Login
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

export default SignUp;

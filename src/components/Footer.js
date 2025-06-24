import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Footer() {
	return (
		<footer className="bg-dark text-light py-4 mt-auto">
			<Container>
				<Row>
					<Col md={4}>
						<h5>About Us</h5>
						<p>
							This is a sample footer built with React Bootstrap.
							You can add your website's description here.
						</p>
					</Col>
					<Col md={4}>
						<h5>Quick Links</h5>
						<ul className="list-unstyled">
							<li><a href="/" className="text-light text-decoration-none">Home</a></li>
							<li><a href="/about" className="text-light text-decoration-none">About</a></li>
							<li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
						</ul>
					</Col>
					<Col md={4}>
						<h5>Contact Info</h5>
						<p>Email: info@example.com</p>
						<p>Phone: +123-456-7890</p>
					</Col>
				</Row>
				<hr className="border-light" />
				<div className="text-center">
					&copy; {new Date().getFullYear()} Your Company. All rights reserved.
				</div>
			</Container>
		</footer>
	);
}

export default Footer;

import React, { use, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
function Header() {
    const expand = 'md';
    const navigate = useNavigate();

    let token = localStorage.getItem('token');

    let [isLoggedIn, setIsLoggedIn] = React.useState(false);

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    }


    return (
        <Navbar expand={expand} className="bg-body-tertiary mb-3">
            <Container fluid>
                <Navbar.Brand href="#">Student portal</Navbar.Brand>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                            Offcanvas
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            <NavDropdown
                                title="Profile"
                                id={`offcanvasNavbarDropdown-expand-${expand}`}
                            >
                                {isLoggedIn && <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>}
                                {isLoggedIn && <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>}
                                {!isLoggedIn && <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>}
                                {!isLoggedIn && <NavDropdown.Item as={Link} to="/admin-login">Admin Login</NavDropdown.Item>}
                                {!isLoggedIn && <NavDropdown.Item as={Link} to="/sign-up">Sign-Up</NavDropdown.Item>}
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-success">Search</Button>
                        </Form>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}

export default Header;

import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Config from '../Config/Config';

function DashboardAcademic() {
  const [academicRecords, setAcademicRecords] = useState([]);
  const token = localStorage.getItem('token');
 let record_Id = localStorage.getItem('userId');
  const fetchAcademicRecords = async () => {
    try {
     
      let res = await fetch(`${Config.backendUrl}/records/student/${record_Id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        }
      });
      res= await res.json();
      if (res.status) {
        setAcademicRecords(res.data);
      } else {
        toast.error("Failed to fetch academic records");
      }
    } catch (error) {
      console.error("Error fetching academic records:", error);
      toast.error("Server error while fetching records");
    }
  };
  useEffect(() => {
    fetchAcademicRecords();
  }, []);

  const handleRecordChange = (index, field, value) => {
    const updated = [...academicRecords];
    updated[index][field] = value;
    setAcademicRecords(updated);
  };

  const handleGradeChange = (rIdx, gIdx, field, value) => {
    const updated = [...academicRecords];
    updated[rIdx].grades[gIdx][field] = value;
    setAcademicRecords(updated);
  };

  const addSubject = (rIdx) => {
    const updated = [...academicRecords];
    updated[rIdx].grades.push({ subjectName: '', grade: '' });
    setAcademicRecords(updated);
  };

  const removeSubject = (rIdx, gIdx) => {
    const updated = [...academicRecords];
    updated[rIdx].grades.splice(gIdx, 1);
    setAcademicRecords(updated);
  };

  const handleSave = async (record) => {
    try {
      const res = await fetch(`${Config.backendUrl}/records/${record._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify(record)
      });
      const data = await res.json();
      if (data.status) {
        toast.success("Record updated successfully");
      } else {
        toast.error("Failed to update record");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during update");
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
      <h3 className="text-center mb-4">My Academic Records</h3>
      {academicRecords.length === 0 ? (
        <p className="text-center">No academic records available.</p>
      ) : (
        academicRecords.map((record, rIdx) => (
          <Card key={record._id} className="mb-4 shadow-sm">
            <Card.Body>
              <Form>
                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>College Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={record.collegeName}
                        onChange={(e) => handleRecordChange(rIdx, 'collegeName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Course Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={record.courseName}
                        onChange={(e) => handleRecordChange(rIdx, 'courseName', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Semester</Form.Label>
                      <Form.Control
                        type="text"
                        value={record.semester}
                        onChange={(e) => handleRecordChange(rIdx, 'semester', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Year</Form.Label>
                      <Form.Control
                        type="number"
                        value={record.year}
                        onChange={(e) => handleRecordChange(rIdx, 'year', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Label className="mt-3">Subjects & Grades</Form.Label>
                {record.grades.map((grade, gIdx) => (
                  <Row key={gIdx} className="mb-2">
                    <Col>
                      <Form.Control
                        placeholder="Subject"
                        value={grade.subjectName}
                        onChange={(e) => handleGradeChange(rIdx, gIdx, 'subjectName', e.target.value)}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        placeholder="Grade"
                        value={grade.grade}
                        onChange={(e) => handleGradeChange(rIdx, gIdx, 'grade', e.target.value)}
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => removeSubject(rIdx, gIdx)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" className="mt-2 me-2" onClick={() => addSubject(rIdx)}>
                  Add Subject
                </Button>
                <Button variant="success" className="mt-2" onClick={() => handleSave(record)}>
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default DashboardAcademic;

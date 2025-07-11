import React, { useEffect, useState } from 'react';
import {Table,Container,Form,Spinner,Alert,Button,Collapse,Pagination,} from 'react-bootstrap';
import Config from '../Config/Config';

function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [studentRes, recordRes] = await Promise.all([
          fetch(`${Config.backendUrl}/admin/students`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }),
          fetch(`${Config.backendUrl}/admin/records`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            },
          }),
        ]);

        const studentData = await studentRes.json();
        const recordData = await recordRes.json();

        if (!studentRes.ok || !recordRes.ok) {
          throw new Error(studentData.message || recordData.message || 'Failed to fetch');
        }

        setStudents(Array.isArray(studentData.data) ? studentData.data : []);
        setRecords(Array.isArray(recordData.data) ? recordData.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Merge academic records into student data
  const mergedStudents = students.map(student => {
    const academicRecords = records.filter(
      record => record.studentId === student._id
    );
    return { ...student, academicRecords };
  });

  // Filtered students based on search
  const filteredStudents = mergedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIdx = (currentPage - 1) * studentsPerPage;
  const currentStudents = filteredStudents.slice(startIdx, startIdx + studentsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle record display
  const toggleRow = (id) => {
    const updated = new Set(expandedRows);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedRows(updated);
  };

  return (
    <Container className="mt-5">
      <h2>Admin Panel</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p>Loading data...</p>
        </div>
      ) : (
        <>
          <Form className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Form>

          <h4>Students</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Academic Records</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => toggleRow(student._id)}
                      >
                        {expandedRows.has(student._id) ? 'Hide Records' : 'Show Records'}
                      </Button>
                      <Collapse in={expandedRows.has(student._id)}>
                        <div>
                          {student.academicRecords.length > 0 ? (
                            student.academicRecords.map(record => (
                              <div key={record._id} className="mb-3">
                                <strong>
                                  • {record.collegeName}, {record.courseName}, {record.semester}, {record.year}
                                </strong>
                                <ul style={{ marginLeft: '20px' }}>
                                  {Array.isArray(record.grades) ? (
                                    record.grades.map((gradeObj, idx) => (
                                      <li key={gradeObj._id || idx}>
                                        {gradeObj.subjectName}: {gradeObj.grade}
                                      </li>
                                    ))
                                  ) : typeof record.grades === 'object' && record.grades !== null ? (
                                    Object.entries(record.grades).map(([key, value], idx) => (
                                      <li key={idx}>
                                        {key}: {value}
                                      </li>
                                    ))
                                  ) : (
                                    <li>No subjects available</li>
                                  )}
                                </ul>
                              </div>
                            ))
                          ) : (
                            <div>No Records</div>
                          )}
                        </div>
                      </Collapse>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>No students found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={currentPage === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}

export default AdminPanel;

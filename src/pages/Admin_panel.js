import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import Config from '../Config/Config';

function AdminPanel() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${Config.backendUrl}/admin/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(Array.isArray(data.students) ? data.students : []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch(`${Config.backendUrl}/admin/records`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setRecords(Array.isArray(data.records) ? data.records : []);
        }
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  // Merge academic records into student data
  const mergedStudents = students.map(student => {
    const academicRecords = records.filter(
      record => record.studentId === student._id
    );
    return { ...student, academicRecords };
  });

  return (
    <Container className="mt-5">
			  <h2>Admin Panel</h2>
			  	  <h3>Students</h3>
	  <Table striped bordered hover>
		<thead>
		  <tr>
			<th>Name</th>
			<th>Email</th>
			<th>Academic Records</th>
		  </tr>
		</thead>
		<tbody>
  {Array.isArray(mergedStudents) && mergedStudents.length > 0 ? (
    mergedStudents.map(student => (
      <tr key={student._id}>
        <td>{student.name}</td>
        <td>{student.email}</td>
        <td>
          {Array.isArray(student.academicRecords) && student.academicRecords.length > 0 ? (
            student.academicRecords.map(record => (
              <div key={record._id}>
                {record.collegeName}, {record.courseName} ({record.semester})
              </div>
            ))
          ) : (
            'No Records'
          )}
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
    </Container>
  );
}

export default AdminPanel;

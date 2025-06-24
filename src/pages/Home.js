import React, { useState } from 'react';
import Config from '../Config/Config';

function AcademicForm({ studentId }) {
  const [form, setForm] = useState({
    collegeName: '',
    courseName: '',
    semester: '',
    year: '',
    grades: [{ subjectName: '', grade: '' }]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGradeChange = (index, e) => {
    const updatedGrades = [...form.grades];
    updatedGrades[index][e.target.name] = e.target.value;
    setForm({ ...form, grades: updatedGrades });
  };

  const addSubject = () => {
    setForm({ ...form, grades: [...form.grades, { subjectName: '', grade: '' }] });
  };

  const removeSubject = (index) => {
    const updatedGrades = form.grades.filter((_, i) => i !== index);
    setForm({ ...form, grades: updatedGrades });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.collegeName || !form.courseName || !form.semester || !form.year || form.grades.some(grade => !grade.subjectName || !grade.grade)) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      let response = await fetch(`${Config.backendUrl}/records`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (data.status) {
        alert('Academic record added successfully!');
        setForm({
          collegeName: '',
          courseName: '',
          semester: '',
          year: '',
          grades: [{ subjectName: '', grade: '' }]
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add academic record.');
    }
  }

  return (
    <div className="container mt-4">
      <center><h1>Welcome to the Student Portal!</h1></center>
      <div className="container mt-4">
        <h3>Add Academic Record</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>College Name</label>
            <input type="text" className="form-control" name="collegeName" value={form.collegeName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Course Name</label>
            <input type="text" className="form-control" name="courseName" value={form.courseName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Semester</label>
            <input type="text" className="form-control" name="semester" value={form.semester} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Year</label>
            <input type="number" className="form-control" name="year" value={form.year} onChange={handleChange} required />
          </div>

          <div>
            <label>Subjects & Grades</label>
            {form.grades.map((grade, index) => (
              <div key={index} className="row mb-2">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    name="subjectName"
                    placeholder="Subject Name"
                    value={grade.subjectName}
                    onChange={(e) => handleGradeChange(index, e)}
                    required
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    name="grade"
                    placeholder="Grade"
                    value={grade.grade}
                    onChange={(e) => handleGradeChange(index, e)}
                    required
                  />
                </div>
                <div className="col-auto">
                  <button type="button" className="btn btn-danger" onClick={() => removeSubject(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mb-3" onClick={addSubject}>
              Add Subject
            </button>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AcademicForm;

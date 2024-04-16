import React, { useState, useEffect } from 'react';
import DashboardHeader from '/src/components/DashboardHeader';
import all_orders from '/src/constants/orders';
import students from '/src/constants/students';
import { calculateRange, sliceData } from '/src/utils/table-pagination';
import { useNavigate } from 'react-router-dom';
import '/src/styles.css';
import { getDecide } from '../constants/loggedin';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Orders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [stu, setStudents] = useState(students);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students from the API endpoint
        const response = await axios.get('http://localhost:5000/api/student/fetchallstudents');
        const fetchedStudents = response.data;

        // Log the fetched students to the console
        console.log(fetchedStudents);

        // Update state with fetched students
        setStudents(fetchedStudents);
        setPagination(calculateRange(fetchedStudents, 5));
        setStudents(sliceData(fetchedStudents, page, 5));

        const currentDecision = getDecide();
        console.log(currentDecision);
        setLoggedIn(currentDecision);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchData();
  }, [page]); // Include page as a dependency to refetch data when the page changes

  const handleDelete = async (id) => {
    console.log(`Delete student with ID: ${id}`);

    try {
      const response = await axios.delete(`http://localhost:5000/api/auth/${id}`);
      console.log(response.data);

      // After deletion, refetch the data to update the UI
      const updatedResponse = await axios.get('http://localhost:5000/api/student/fetchallstudents');
      const updatedStudents = updatedResponse.data;
      setStudents(updatedStudents);
      setPagination(calculateRange(updatedStudents, 5));
      setStudents(sliceData(updatedStudents, page, 5));
    } catch (error) {
      console.error('Error:', error);
    }
  };

 
  

  const handleUpdate = async (id) => {
    // Use window.prompt to gather input for name and dept
    const updatedName = window.prompt('Enter updated name:');
    const updatedDept = window.prompt('Enter updated department:');
  
    // Check if the user canceled the prompt
    if (updatedName === null || updatedDept === null) {
      return;
    }
  
    // Create an object with the updated data
    const updatedData = {
      name: updatedName,
      dept: updatedDept,
    };
  
    try {
      // Implement logic to send a PUT request to your update endpoint
      const response = await axios.put(`http://localhost:5000/api/auth/${id}`, updatedData);
      console.log(response.data);
  
      // Show an alert for successful update
      alert('Student updated successfully!');
  
      // Refetch the data to update the UI
      const updatedResponse = await axios.get('http://localhost:5000/api/student/fetchallstudents');
      const updatedStudents = updatedResponse.data;
      
      // Set the updated data to state
      setStudents(updatedStudents);
      setPagination(calculateRange(updatedStudents, 5));
      setStudents(sliceData(updatedStudents, page, 5));
  
    } catch (error) {
      console.error('Error:', error);
      alert('Error updating student.');
    }
  };
  

  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      let search_results = stu.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.dept.toLowerCase().includes(search.toLowerCase())
      );
      setStudents(search_results);
    } else {
      __handleChangePage(1);
    }
  };

  const __handleChangePage = (new_page) => {
    setPage(new_page);
    setStudents(sliceData(students, new_page, 5));
  };

  const handleLoginPrompt = () => {
    navigate('/login');
  };

  return (
    <div className='dashboard-content'>
      {loggedIn ? (
        <div className='dashboard-content-container'>
          <div className='dashboard-content-header'>
            <h2 className='text-blue-900 text-2xl -mt-5 underline underline-offset-2 font-mono'>
              Students List
            </h2>
            <div className='dashboard-content-search'>
              <input
                type='text'
                value={search}
                placeholder='Search..'
                className='dashboard-content-input'
                onChange={(e) => __handleSearch(e)}
              />
            </div>
          </div>
    
          <table>
            <thead>
              <th>ID</th>
              <th>NAME</th>
              <th>DEPARTMENT</th>
              <th>IMAGE</th>
              <th>ATTENDANCE</th>
              <th>LAST_ATTENDANCE</th>
              <th>ACTIONS</th>
            </thead>

            {stu.length !== 0 ? (
              <tbody>
                {stu.map((student, index) => (
                  <tr key={index}>
                    <td>
                      <span>{student.id}</span>
                    </td>
                    <td>
                      <span>{student.name}</span>
                    </td>
                    <td>
                      <div>
                        <span>{student.dept}</span>
                      </div>
                    </td>
                    <td>
                      <div>
                        <img src={student.image} className='dashboard-content-avatar' alt={student.name} />
                      </div>
                    </td>
                    <td>
                      <span>{student.attendance}</span>
                    </td>
                    <td>
                      <span>${student.last_attendance}</span>
                    </td>
                    <td>
                      <button className='btn btn-outline-danger mr-2' onClick={() => handleDelete(student.id)}>
                        Delete
                      </button>
                      <button className='btn btn-outline-primary' onClick={() => handleUpdate(student.id)}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>

          {stu.length !== 0 ? (
            <div className='dashboard-content-footer'>
              {pagination.map((item, index) => (
                <span
                  key={index}
                  className={item === page ? 'active-pagination' : 'pagination'}
                  onClick={() => __handleChangePage(item)}>
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <div className='dashboard-content-footer'>
              <span className='empty-table'>No data</span>
            </div>
          )}
        </div>
      ) : (
        <div className='text-white text-center'>
          <p>You need to log in to access the registration form.</p>
          <button
            onClick={handleLoginPrompt}
            className='bg-green-500 hover:bg-green-900 text-white text-sm py-2 px-4 rounded-md w-32 lg:mx-4 mb-8'
            style={{ marginLeft: '73px' }}>
            Log In
          </button>
        </div>
      )}
    </div>
  );
}

export default Orders;

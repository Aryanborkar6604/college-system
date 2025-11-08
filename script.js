// =======================================================
// 1. Sidebar Toggle Functionality
// =======================================================
function toggleSidebar(type) {
    const sidebar = document.getElementById(type + '-sidebar');
    const content = document.getElementById(type + '-content');

    sidebar.classList.toggle('collapsed');

    if (sidebar.classList.contains('collapsed')) {
        content.style.marginLeft = '60px'; 
    } else {
        content.style.marginLeft = '250px'; 
    }
}


// =======================================================
// 2. Admin Dashboard Logic (Load and Update Applications)
// =======================================================

// Function to handle the actual API call for approval/rejection
async function handleAdminAction(appId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3000/api/applications/${appId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
            alert(`Application ${newStatus} successfully. The record has been removed from the Pending list.`);
            loadApplications(); // Reload the table to remove the approved/rejected application
        } else {
            alert(`Failed to update application status.`);
        }
    } catch (error) {
        console.error('Network Error:', error);
        alert('Error communicating with the server. Is the backend (Node.js) running?');
    }
}

// Function to fetch applications and render the Admin table
async function loadApplications() {
    const tableBody = document.querySelector('.application-table tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:3000/api/applications');
        const applications = await response.json();
        
        tableBody.innerHTML = ''; // Clear existing content

        // Filter only the applications that are still 'Pending'
        const pendingApps = applications.filter(app => app.status === 'Pending');

        if (pendingApps.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No pending applications found.</td></tr>';
            return;
        }

        pendingApps.forEach(app => {
            const row = tableBody.insertRow();
            // Data attribute (data-id) is crucial for the Approve/Reject buttons
            row.innerHTML = `
                <td>${app.name}</td>
                <td>${app.course}</td>
                <td>${app.status}</td>
                <td id="action-${app._id}">
                    <button class="action-btn approve" data-id="${app._id}" data-status="Approved">Approve</button>
                    <button class="action-btn reject" data-id="${app._id}" data-status="Rejected">Reject</button>
                </td>
            `;
        });

    } catch (error) {
        console.error('Error loading applications:', error);
        tableBody.innerHTML = '<tr><td colspan="4">Could not load applications from server.</td></tr>';
    }
}

// =======================================================
// 3. Initialization and Event Listeners
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    // A. Student Form Submission Handler
    const applicationForm = document.getElementById('student-application-form');

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect form data 
            const formData = {
                name: document.getElementById('name').value,
                academics: document.getElementById('academics').value,
                course: document.getElementById('course-select').value, 
            };
            
            // Basic validation check
            if (!formData.name || !formData.academics || !formData.course) {
                 alert('Please fill out all required fields.');
                 return;
            }


            try {
                const response = await fetch('http://localhost:3000/api/applications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    alert('Application submitted successfully! Check the Admin portal for status.');
                    applicationForm.reset(); 
                } else {
                    alert('Submission failed. Server returned an error.');
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Could not connect to the server (http://localhost:3000). Ensure backend is running.');
            }
        });
    }
    
    // B. Admin Action (Approve/Reject) Listener
    const tableBody = document.querySelector('.application-table tbody');
    if (tableBody) {
        tableBody.addEventListener('click', (event) => {
            const clickedElement = event.target;

            if (clickedElement.classList.contains('action-btn')) {
                const appId = clickedElement.dataset.id;
                const newStatus = clickedElement.dataset.status;
                
                // Call the function to handle the API update
                handleAdminAction(appId, newStatus);
            }
        });
    }

    // C. Initial Data Load (Runs when page loads)
    loadApplications();
});
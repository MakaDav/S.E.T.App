
async function setConfigStatus(studentID) {
    try {
        const response = await fetch('/api/config/status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({student_id:studentID})
        });

        if (!response.ok) {
            throw new Error('Failed to fetch config status');
        }

        const configStatus = await response.json();
        console.log('Config Status:', configStatus);
        return configStatus;
    } catch (error) {
        console.error('Error fetching config status:', error);
        throw error; // Re-throw the error to handle it in the calling function if necessary
    }
}
async function getConfigStatus(username) {
    try {
        const response = await fetch('/api/config/status/'+username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch config status');
        }
        const configStatus = await response.json();
        console.log('Config Status:', configStatus);
        return configStatus;
    } catch (error) {
        console.error('Error fetching config status:', error);
        throw error; // Re-throw the error to handle it in the calling function if necessary
    }
}
export  {getConfigStatus, setConfigStatus}
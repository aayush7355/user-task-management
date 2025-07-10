async function fetchTasks(userId) {
    try {
        const response = await fetch(`/tasks/${userId}`);
        const tasks = await response.json();
        const tasksDiv = document.getElementById('tasks');
        
        if (tasks.length === 0) {
            tasksDiv.innerHTML = '<p>No tasks found for this user.</p>';
            return;
        }
        
        let html = '<h3>Tasks</h3><table><thead><tr><th>ID</th><th>Task Name</th><th>Type</th></tr></thead><tbody>';
        tasks.forEach(task => {
            html += `<tr><td>${task.id}</td><td>${task.task_name}</td><td>${task.task_type}</td></tr>`;
        });
        html += '</tbody></table>';
        tasksDiv.innerHTML = html;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        document.getElementById('tasks').innerHTML = '<p>Error loading tasks</p>';
    }
}
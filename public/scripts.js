document.addEventListener('DOMContentLoaded', function () {

    fetch('/students.json')
        .then(response => {
            if (response.ok) return response.json();
            throw new Error("Failed to fetch students' data.");
        })
        .then(students => {
            const tableBody = document.querySelector("#studentsTable tbody");

            students.forEach(student => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = student.id;
                row.insertCell().textContent = student.firstName;
                row.insertCell().textContent = student.lastName;
                row.insertCell().textContent = student.dateOfBirth;
                row.insertCell().textContent = student.currentGrade;
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to load students. Please try again.");
        });



    const form = document.getElementById('studentForm');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const student = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            dob: form.dob.value,
            grade: parseInt(form.grade.value)
        };
        console.log("Sending POST request with data:", student);
        fetch('/add-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        })
            .then(response => {
                console.log("Received response:", response);
                return response.json();
            })
            .then(data => {

                if (data.success) {
                    alert("Student added successfully!");

                    // Append new student data to the table
                    const tableBody = document.querySelector("#studentsTable tbody");
                    const newRow = document.createElement("tr");

                    newRow.innerHTML = `
                <td>${tableBody.children.length + 1}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.dob}</td>
                <td>${student.grade}</td>
            `;

                    tableBody.appendChild(newRow);

                } else {
                    alert("Error adding student. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Failed to add student. Please try again.");
            });
    });

});

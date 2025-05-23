const table = document.getElementById("grid-container");
table.style.opacity = "0";
async function fetchData() {
    const loader = document.querySelector(".loader");
    const tableBody = document.querySelector("#grid-container tbody");
    try {
        let response = await fetch("https://puzzling-fern-beryl.glitch.me/students");
        let students = await response.json();
        tableBody.innerHTML = '';
        students.forEach((student , index) => {
            let row = document.createElement("tr");
            row.innerHTML = `
                        <td>${index + 1}</td>
                        <td><img src="${student.img}" alt="${student.name}"></td>
                        <td>${student.name}</td>
                        <td>
                            <button onclick="editData(${student.id})">Edit</button>
                            <button onclick="deleteData(${student.id})">Delete</button>
                        </td>`;
            tableBody.appendChild(row);
        });
        if (students.length === 0) {
            loader.innerText = "Data Not Available";
        } else {
            loader.style.display = "none";
            table.style.opacity = "1";
        }
    } catch (error) {
        console.error(error);
        loader.textContent = "Failed to load content.";
    }
}

function validateInput() {
    let isValid = true;
    const name = document.getElementById("name").value.trim();
    const image = document.getElementById("image").value.trim();
    document.getElementById("nameError").innerText = name ? "" : "Name is required.";
    document.getElementById("imageError").innerText = image ? "" : "Image URL is required.";
    if (!name || !image) isValid = false;
    return isValid;
}


async function saveData() {
    let nameMessage = document.getElementById("name");
    let imageMessage = document.getElementById("image");
    if (!validateInput()) {
        nameMessage.style.outline = "3px solid #E16A54";
        imageMessage.style.outline = "3px solid #E16A54";
        return;
    }
    else {
        nameMessage.style.outline = "none"
        imageMessage.style.outline = "none"
        const studentId = document.getElementById("id").value;
        const name = document.getElementById("name").value;
        const image = document.getElementById("image").value;
        const obj = { name, img: image };
        const method = studentId ? "PUT" : "POST";
        const url = studentId ? `https://puzzling-fern-beryl.glitch.me/students/${studentId}` : `https://puzzling-fern-beryl.glitch.me/students/`;
        try {
            let response = await fetch(url, {
                method,
                "headers": { "Content-Type": "application/json" },
                "body": JSON.stringify(obj)
            });
            if (!response.ok) throw new Error(response.statusText);
            alert("Data saved successfully!");
            clearInputs();
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Error saving data.");
        }
    }
}

function clearInputs() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("image").value = "";
    let nameMessage = document.getElementById("name");
    let imageMessage = document.getElementById("image");
     nameMessage.style.outline = "none"
        imageMessage.style.outline = "none"
}

async function deleteData(id) {
    await fetch(`https://puzzling-fern-beryl.glitch.me/students/${id}`, { method: "DELETE" });
    clearInputs();
    alert("Data Delete Successfully");
    fetchData();
}

async function editData(id) {
    document.getElementById("nameError").innerText = "";
    document.getElementById("imageError").innerText = "";
    const response = await fetch(`https://puzzling-fern-beryl.glitch.me/students/${id}`);
    const student = await response.json();
    document.getElementById("id").value = student.id;
    let name = document.getElementById("name");
    name.value = student.name;
    let image = document.getElementById("image");
    image.value = student.img;
    name.style.outline = "3px solid #E16A54";
    image.style.outline = "3px solid #E16A54";
    image.classList.add("pushUp");
    name.classList.add("pushUp");
    setTimeout(() => {
        image.classList.remove("pushUp");
        name.classList.remove("pushUp");
    }, 500);
}

document.addEventListener("DOMContentLoaded", fetchData);

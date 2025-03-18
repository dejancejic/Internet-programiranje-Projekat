function login() {
    const username = document.getElementById("user").value.trim();
    const password = document.getElementById("pass").value.trim();
    const spinnerContainer = document.getElementById("spinnerContainer");

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    spinnerContainer.style.display = "flex";
    
    let body={
		username:username,
		password:password
	};

    fetch("https://localhost:8443/login/employee", {
        method: "POST",
        credentials: "include", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login failed. Please check your credentials.");
        }
        return response.json();
    })
    .then(data => {
        if (data.employee && data.employee.role === "manager") {
            window.location.href = "promotions.jsp";
            sessionStorage.setItem('jwt',data.token);
        } else {
            alert("Access denied. Only managers can access this page.");
        }
    })
    .catch(error => {
        alert(error.message);
    })
    .finally(() => {
        spinnerContainer.style.display = "none";
    });
}
function handleEnter(event, target) {
    if (event.key === "Enter") {
        if (target === "pass") {
            document.getElementById("pass").focus();
        } else if (target === "login") {
            login();
        }
    }
}

function init()
{
	sessionStorage.removeItem("jwt");
}

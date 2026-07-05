const pages = ["home", "upload", "result"];

function showPage(pageName) {

    pages.forEach(page => {

        document.getElementById(page).classList.remove("active");

        const nav = document.getElementById("nav-" + page);

        if (nav) nav.classList.remove("active");

    });

    document.getElementById(pageName).classList.add("active");

    const nav = document.getElementById("nav-" + pageName);

    if (nav) nav.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

const imageInput = document.getElementById("imageInput");
const dropArea = document.querySelector(".drop-area");

// =========================
// Upload Image
// =========================

imageInput.addEventListener("change", () => {

    if (imageInput.files.length > 0) {

        handleFile(imageInput.files[0]);

    }

});

// =========================
// Drag & Drop
// =========================

["dragenter", "dragover"].forEach(event => {

    dropArea.addEventListener(event, e => {

        e.preventDefault();

        dropArea.classList.add("drag-active");

    });

});

["dragleave", "drop"].forEach(event => {

    dropArea.addEventListener(event, e => {

        e.preventDefault();

        dropArea.classList.remove("drag-active");

    });

});

dropArea.addEventListener("drop", e => {

    const file = e.dataTransfer.files[0];

    if (file) {

        handleFile(file);

    }

});

// =========================
// Predict
// =========================

async function handleFile(file) {

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        alert("Please upload an image.");

        return;

    }

    document.getElementById("previewImage").src =
        URL.createObjectURL(file);

    document.getElementById("resultTitle").textContent =
        "Analyzing...";

    document.getElementById("resultCategory").textContent =
        "...";

    document.getElementById("binTitle").textContent =
        "Analyzing image...";

    document.getElementById("binText").textContent =
        "Please wait.";

    showPage("result");

    const formData = new FormData();

    formData.append("image", file);

    try {

        const response = await fetch("/predict", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (data.error) {

            alert(data.error);

            return;

        }

        document.getElementById("resultTitle").textContent =
            data.title;

        document.getElementById("resultCategory").textContent =
            data.category;

        document.getElementById("binTitle").textContent =
            data.binTitle;

        document.getElementById("binText").textContent =
            data.binText;

        const chip =
            document.getElementById("resultCategory");

        chip.className = "chip";

        switch (data.category.toLowerCase()) {

            case "paper":
                chip.classList.add("blue");
                break;

            case "trash":
                chip.classList.add("red");
                break;

            case "plastic":
                chip.classList.add("green");
                break;

            case "glass":
                chip.classList.add("glass");
                break;

            case "metal":
                chip.classList.add("gray");
                break;

        }

    }

    catch (error) {

        console.error(error);

        alert("Prediction failed. Check Flask server.");

    }

}
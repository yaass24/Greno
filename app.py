from flask import Flask, render_template, request, jsonify
from ultralytics import YOLO
import os
import uuid

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = YOLO("best.pt")

INFO = {
    "glass": {
        "title": "Glass Waste",
        "category": "Glass",
        "bin": "Glass Recycling Bin",
        "text": "Remove lids before recycling."
    },

    "metal": {
        "title": "Metal Waste",
        "category": "Metal",
        "bin": "Metal Recycling Bin",
        "text": "Recycle aluminum and steel cans."
    },

    "paper": {
        "title": "Paper Waste",
        "category": "Paper",
        "bin": "Paper Recycling Bin",
        "text": "Keep paper clean and dry."
    },

    "plastic": {
        "title": "Plastic Waste",
        "category": "Plastic",
        "bin": "Plastic Recycling Bin",
        "text": "Rinse before recycling."
    },

    "trash": {
        "title": "General Waste",
        "category": "Trash",
        "bin": "General Waste Bin",
        "text": "This item cannot be recycled."
    }
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    filename = f"{uuid.uuid4()}.jpg"
    path = os.path.join(UPLOAD_FOLDER, filename)

    file.save(path)

    results = model(path)

    probs = results[0].probs

    class_index = probs.top1

    class_name = results[0].names[class_index]

    data = INFO[class_name]

    # حذف الصورة بعد الانتهاء منها
    os.remove(path)

    return jsonify({

        "title": data["title"],

        "category": data["category"],

        "binTitle": data["bin"],

        "binText": data["text"]

    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
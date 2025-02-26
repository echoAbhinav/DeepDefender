from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import io

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Deepfake Detection Model from Hugging Face
# Using use_fast=True to enable fast image processing
processor = AutoImageProcessor.from_pretrained("prithivMLmods/Deep-Fake-Detector-Model", use_fast=True)
model = AutoModelForImageClassification.from_pretrained("prithivMLmods/Deep-Fake-Detector-Model")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read and process the uploaded image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')  # Explicitly convert to RGB
    
    # Make sure image is properly loaded before processing
    if image.mode != 'RGB':
        image = image.convert('RGB')
        
    inputs = processor(images=image, return_tensors="pt")  # Use explicit parameter name
    
    # Run the model for prediction
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        fake_probability = predictions[0][1].item()  # Assuming index 1 is deepfake probability
    
    return {"deepfake_probability": fake_probability}
   
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
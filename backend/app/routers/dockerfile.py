from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.dockerfile_generator import generate_dockerfile_content

router = APIRouter()

class DockerfileParams(BaseModel):
    framework: str
    baseImage: str
    version: str
    port: str

class GeneratedFile(BaseModel):
    name: str
    content: str

@router.post("/generate/dockerfile", response_model=list[GeneratedFile])
async def generate_dockerfile(params: DockerfileParams):
    try:
        dockerfile_content = generate_dockerfile_content(params.dict())
        return [{"name": "Dockerfile", "content": dockerfile_content}]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
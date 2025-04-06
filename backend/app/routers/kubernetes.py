from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utils.kubernetes_generator import generate_deployment_content, generate_service_content

router = APIRouter()

class DeploymentParams(BaseModel):
    name: str
    replicas: int
    image: str
    containerPort: int
    envVars: Optional[str] = None

class ServiceParams(BaseModel):
    name: str
    port: int
    targetPort: int
    protocol: str
    serviceType: str

class GeneratedFile(BaseModel):
    name: str
    content: str

@router.post("/generate/kubernetes/deployment", response_model=list[GeneratedFile])
async def generate_kubernetes_deployment(params: DeploymentParams):
    try:
        deployment_content = generate_deployment_content(params.dict())
        return [{"name": f"{params.name}-deployment.yaml", "content": deployment_content}]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/kubernetes/service", response_model=list[GeneratedFile])
async def generate_kubernetes_service(params: ServiceParams):
    try:
        service_content = generate_service_content(params.dict())
        return [{"name": f"{params.name}-service.yaml", "content": service_content}]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
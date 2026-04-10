from fastapi import FastAPI
from pydantic import BaseModel
from backend.chitti.orchestrator import ChittiOrchestrator

app = FastAPI()
orch = ChittiOrchestrator(agent_count=5)


class PromptRequest(BaseModel):
    problem: str
    iterations: int = 3


@app.get("/")
def root():
    return {"message": "Chitti AI backend running"}


@app.post("/start")
def start(req: PromptRequest):
    orch.initialize(req.problem)
    result = orch.run_real_swarm(num_iterations=req.iterations)
    return result


@app.get("/state")
def state():
    return orch.get_state()
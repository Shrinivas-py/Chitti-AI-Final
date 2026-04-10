from backend.chitti.orchestrator import ChittiOrchestrator

orch = ChittiOrchestrator()

orch.initialize("Create a 7-day web development plan")

res = orch.run_real_swarm()

print("\n🔥 FINAL OUTPUT:\n")
print(res["final_output"])
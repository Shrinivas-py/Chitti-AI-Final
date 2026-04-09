from backend.swarm_engine.api import execute_swarm_sync

result = execute_swarm_sync(
    problem="Create a 7-day web development plan",
    send_to_mcp=False
)

print("\n🔥 FINAL OUTPUT:\n")
print(result.final_output)
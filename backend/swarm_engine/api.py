from __future__ import annotations
import asyncio
import json
from dataclasses import dataclass, asdict

from .core.workflow import run_swarm
from ..config import settings


@dataclass
class SwarmResult:
    problem: str
    final_output: str
    total_ideas: int
    iterations_run: int
    agents_started: int
    agents_survived: int
    top_ideas: list
    all_ideas: list
    agent_summary: list

    def to_dict(self) -> dict:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)


async def execute_swarm(
    problem: str,
    num_agents: int = None,
    num_iterations: int = None,
    batch_size: int = None,
    send_to_mcp: bool = True,
) -> SwarmResult:
    print(f"\n[API] Starting swarm execution")
    print(f"[API] Problem: {problem[:80]}")

    final_state = await run_swarm(
        problem=problem,
        num_agents=num_agents or settings.SWARM_NUM_AGENTS,
        num_iterations=num_iterations or settings.SWARM_NUM_ITERATIONS,
        batch_size=batch_size or settings.SWARM_BATCH_SIZE,
    )

    memory = final_state["memory"]
    factory = final_state["factory"]

    result = SwarmResult(
        problem=memory.problem,
        final_output=final_state.get("final_output", "") or "",
        total_ideas=len(memory.get_all_ideas()),
        iterations_run=memory.iteration,
        agents_started=factory.num_agents,
        agents_survived=len(factory.get_active_agents()),
        top_ideas=[idea.to_dict() for idea in memory.get_top_ideas()],
        all_ideas=[idea.to_dict() for idea in memory.get_all_ideas()],
        agent_summary=factory.summary()["agents"],
    )

    print(f"\n[API] Run complete")
    print(f"[API] Total ideas  : {result.total_ideas}")
    print(f"[API] Agents left  : {result.agents_survived}/{result.agents_started}")
    print(f"[API] Output length: {len(result.final_output)} chars")

    if send_to_mcp:
        await _send_to_mcp_server(result)

    return result


def execute_swarm_sync(
    problem: str,
    num_agents: int = None,
    num_iterations: int = None,
    batch_size: int = None,
    send_to_mcp: bool = False,
) -> SwarmResult:
    return asyncio.run(
        execute_swarm(
            problem=problem,
            num_agents=num_agents,
            num_iterations=num_iterations,
            batch_size=batch_size,
            send_to_mcp=send_to_mcp,
        )
    )

async def _send_to_mcp_server(result: SwarmResult) -> None:
    print("\n[API → MCP] Payload ready to send to MCP server:")
    print(f"  problem        : {result.problem[:60]}")
    print(f"  total_ideas    : {result.total_ideas}")
    print(f"  top_ideas      : {len(result.top_ideas)}")
    print(f"  agents_survived: {result.agents_survived}/{result.agents_started}")
    print(f"  output preview : {result.final_output[:120]}...")
    print("\n[API → MCP] Stub mode: no direct orchestrator call yet")


if __name__ == "__main__":
    demo_problem = "Create a 7-day web development plan"
    result = execute_swarm_sync(problem=demo_problem, send_to_mcp=False)
    print("\n=== SWARM RESULT ===\n")
    print(result.to_json())
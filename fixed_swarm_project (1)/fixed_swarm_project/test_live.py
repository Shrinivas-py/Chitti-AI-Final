import sys
import traceback
from swarm_engine.api import initialize_session, run_iteration

def main():
    problem = "Test problem"
    print("Initializing...")
    state = initialize_session(problem)
    print("Running iteration...")
    try:
        run_iteration(state)
        print("Success!")
    except Exception as e:
        print("EXCEPTION RAISED:")
        traceback.print_exc()

if __name__ == "__main__":
    main()

from app import create_app
import threading
import time
import sys
import os

# Ensure project root is on sys.path for model imports
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

app = create_app()


def warmup_ml_models():
    """Warm up TensorFlow and ML models asynchronously in the background."""
    t0 = time.time()
    print("[System] Background ML model warmup started...", flush=True)

    # 1. Warm up the lightweight sklearn/joblib models first
    try:
        from model.src.predict_crop import _load_artifacts as load_crop
        load_crop()
        print(f"[System]   Crop model loaded ({time.time()-t0:.1f}s)", flush=True)
    except Exception as e:
        print(f"[System]   Warning: Crop model warmup failed - {e}", flush=True)

    try:
        from model.src.predict_yield import _load_artifacts as load_yield
        load_yield()
        print(f"[System]   Yield model loaded ({time.time()-t0:.1f}s)", flush=True)
    except Exception as e:
        print(f"[System]   Warning: Yield model warmup failed - {e}", flush=True)

    # 2. Warm up TensorFlow + disease CNN (the heavy one)
    try:
        from model.src.predict_disease import _load_artifacts as load_disease
        load_disease()
        print(f"[System]   Disease model (TensorFlow) loaded ({time.time()-t0:.1f}s)", flush=True)
    except Exception as e:
        print(f"[System]   Warning: Disease model warmup failed - {e}", flush=True)

    print(f"[System] Background ML model warmup finished in {time.time()-t0:.1f}s", flush=True)


if __name__ == "__main__":
    # Start the warmup process in a background daemon thread
    threading.Thread(target=warmup_ml_models, daemon=True).start()

    app.run(host="127.0.0.1", port=5000, debug=True)
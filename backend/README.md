# BenefitBridge AI backend

Install dependencies with `pip install -r requirements.txt`, then run from this directory:

```powershell
uvicorn main:app --host 127.0.0.1 --port 8000
```

Set `CORS_ALLOW_ORIGINS` to a comma-separated list of allowed frontend origins for deployment. Scheme data is stored beneath `data/`; builder endpoints reject file paths outside that directory.

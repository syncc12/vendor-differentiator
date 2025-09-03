
# Vendor Differentiator

This project is a full stack tool for sorting, grading, and recommending technology vendors based on customer criteria. It uses a React.js frontend and a Django backend with SQLite.

## Structure
- `frontend/`: React.js app (JavaScript, npm, axios, react-router, Material UI)
- `backend/`: Django backend (Python, Django, djangorestframework, django-cors-headers)

## Setup

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python populate_vendors.py  # Populate with sample vendors
   python manage.py runserver
   ```
2. The backend will be available at `http://127.0.0.1:8000/`

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm start
   ```
2. The frontend will be available at `http://localhost:3000/`

## Assumptions
- Vendor data is stored in SQLite and can be reset for development.
- All API requests are local (CORS is open for dev).
- Vendor schema matches the latest JSON structure in the codebase.

## Scoring Logic
- **Budget**: Vendors over budget are excluded.
- **Must-haves**: Vendors missing any required feature/certification are excluded or flagged.
- **Importance Weights**: User assigns weights (1-5) to price, performance, integrations, security, support, deployment.
- **Performance**: Combines latency and uptime.
- **Integrations**: Required integrations must be present; nice-to-haves add to score.
- **Security**: SOC2, ISO27001, HIPAA certifications are scored.
- **Support**: Tiered (email < chat < business_hours < 24x7).
- **Deployment/Data Residency**: Must match user requirements.
- **Explanations**: Each recommendation includes a list of reasons for inclusion/exclusion.

## Next Steps
- Add authentication and user accounts.
- Allow admin to add/edit vendors via UI.
- Add more advanced scoring/AI logic.
- Add tests and CI/CD.
- Improve UI/UX for large datasets.

---

For more details, see the copilot-instructions.md file in the `.github` directory.

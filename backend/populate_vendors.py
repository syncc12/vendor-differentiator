import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vendors.models import Vendor

sample_vendors = [
    {
        "id": "vendor_001",
        "name": "Acme",
        "price_monthly": 1800,
        "perf_latency_ms": 180,
        "perf_uptime_pct": 99.9,
        "integrations": ["Salesforce", "Slack"],
        "has_sso": True,
        "hipaa": False,
        "soc2": True,
        "iso27001": True,
        "data_residency": ["us", "eu"],
        "deployment_options": ["saas"],
        "support_tier": "24x7",
        "api": True
    },
    {
        "id": "vendor_002",
        "name": "BetaTech",
        "price_monthly": 2500,
        "perf_latency_ms": 150,
        "perf_uptime_pct": 99.5,
        "integrations": ["Salesforce", "Okta"],
        "has_sso": True,
        "hipaa": True,
        "soc2": True,
        "iso27001": False,
        "data_residency": ["us"],
        "deployment_options": ["saas", "self_hosted"],
        "support_tier": "business_hours",
        "api": True
    },
    {
        "id": "vendor_003",
        "name": "GammaCloud",
        "price_monthly": 1200,
        "perf_latency_ms": 200,
        "perf_uptime_pct": 99.0,
        "integrations": ["Slack", "HubSpot"],
        "has_sso": False,
        "hipaa": False,
        "soc2": False,
        "iso27001": False,
        "data_residency": ["eu"],
        "deployment_options": ["self_hosted"],
        "support_tier": "email",
        "api": False
    },
    {
        "id": "vendor_004",
        "name": "DeltaSec",
        "price_monthly": 2200,
        "perf_latency_ms": 170,
        "perf_uptime_pct": 99.7,
        "integrations": ["Okta", "HubSpot"],
        "has_sso": True,
        "hipaa": True,
        "soc2": True,
        "iso27001": True,
        "data_residency": ["us", "eu"],
        "deployment_options": ["saas", "self_hosted"],
        "support_tier": "chat",
        "api": True
    }
]

for v in sample_vendors:
    Vendor.objects.update_or_create(id=v["id"], defaults=v)

print("Sample vendors updated.")

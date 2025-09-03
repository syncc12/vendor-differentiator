import os
import django
import random
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from vendors.models import Vendor

fake = Faker()

INTEGRATIONS = ["Salesforce", "Okta", "Slack", "HubSpot", "Zendesk", "Google Workspace", "Zoom", "Dropbox", "Box", "ServiceNow"]
SUPPORT_TIERS = ["email", "chat", "business_hours", "24x7"]
DEPLOYMENT_OPTIONS = ["cloud", "on-prem", "hybrid"]
DATA_RESIDENCY = ["us", "eu", "apac"]

# Clear existing vendors
Vendor.objects.all().delete()

import uuid
for i in range(200):
    name = fake.company() + f" Tech {i+1}"
    price_monthly = random.randint(100, 5000)
    perf_latency_ms = random.randint(20, 500)
    perf_uptime_pct = round(random.uniform(99.0, 99.999), 3)
    integrations = random.sample(INTEGRATIONS, random.randint(2, 6))
    hipaa = bool(random.getrandbits(1))
    soc2 = bool(random.getrandbits(1))
    iso27001 = bool(random.getrandbits(1))
    api = bool(random.getrandbits(1))
    has_sso = bool(random.getrandbits(1))
    support_tier = random.choice(SUPPORT_TIERS)
    deployment_options = random.sample(DEPLOYMENT_OPTIONS, random.randint(1, 3))
    data_residency = random.sample(DATA_RESIDENCY, random.randint(1, 3))
    vendor_id = str(uuid.uuid4())

    Vendor.objects.create(
        id=vendor_id,
        name=name,
        price_monthly=price_monthly,
        perf_latency_ms=perf_latency_ms,
        perf_uptime_pct=perf_uptime_pct,
        integrations=integrations,
        hipaa=hipaa,
        soc2=soc2,
        iso27001=iso27001,
        api=api,
        has_sso=has_sso,
        support_tier=support_tier,
        deployment_options=deployment_options,
        data_residency=data_residency
    )

print("Populated 200 tech vendors.")

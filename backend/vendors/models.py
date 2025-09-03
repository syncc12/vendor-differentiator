from django.db import models

class Vendor(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    price_monthly = models.FloatField()
    perf_latency_ms = models.IntegerField()
    perf_uptime_pct = models.FloatField()
    integrations = models.JSONField(default=list)
    has_sso = models.BooleanField(default=False)
    hipaa = models.BooleanField(default=False)
    soc2 = models.BooleanField(default=False)
    iso27001 = models.BooleanField(default=False)
    data_residency = models.JSONField(default=list)
    deployment_options = models.JSONField(default=list)
    support_tier = models.CharField(max_length=20)
    api = models.BooleanField(default=False)

    def __str__(self):
        return self.name
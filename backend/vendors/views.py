

# Django REST API views for vendor listing and recommendations
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Vendor

@api_view(["GET"])
@permission_classes([AllowAny])
def vendor_list(request):
  """
  List all vendors in the database as JSON.
  """
  vendors = Vendor.objects.all().values()
  return Response(list(vendors))

@api_view(["POST"])
@permission_classes([AllowAny])
def recommend_vendors(request):
  """
  Recommend vendors based on customer criteria and explain the scoring.
  Receives a JSON payload with customer requirements and returns a sorted list of vendor recommendations.
  """
  criteria = request.data
  vendors = Vendor.objects.all()
  recommendations = []
  for v in vendors:
    score = 0
    explanation = []
    # Budget filter
    if v.price_monthly > criteria["budget"]:
      explanation.append(f"Price ({v.price_monthly}) exceeds budget ({criteria['budget']})")
      continue
    # Must-haves
    must_map = {
      "sso": "has_sso",
      "hipaa": "hipaa",
      "soc2": "soc2",
      "iso27001": "iso27001",
      "api": "api",
      "eu_residency": None  # handled in residency check
    }
    for k, val in criteria["must_haves"].items():
      if k == "eu_residency" and val:
        if "eu" not in v.data_residency:
          explanation.append("Missing must-have: EU residency")
          break
      elif must_map[k] and val and not getattr(v, must_map[k], False):
        explanation.append(f"Missing must-have: {k}")
        break
    else:
      # Importance scoring
      score += criteria["importance"].get("price", 0) * (1 - v.price_monthly / criteria["budget"])
      # Performance: combine latency and uptime
      perf_score = (1000 / max(v.perf_latency_ms, 1)) + v.perf_uptime_pct
      score += criteria["importance"].get("performance", 0) * perf_score
      # Integrations
      required = set(criteria["required_integrations"])
      vendor_integrations = set(v.integrations)
      missing = required - vendor_integrations
      if missing:
        explanation.append(f"Missing required integrations: {', '.join(missing)}")
      else:
        score += criteria["importance"].get("integrations", 0)
      # Security: certifications
      sec_score = int(v.soc2) + int(v.iso27001) + int(v.hipaa)
      score += criteria["importance"].get("security", 0) * sec_score
      # Support tier
      support_map = {"email": 1, "chat": 2, "business_hours": 3, "24x7": 4}
      score += criteria["importance"].get("support", 0) * support_map.get(v.support_tier, 0)
      # Deployment
      if criteria["deployment"] != "either" and criteria["deployment"] not in v.deployment_options:
        explanation.append(f"Deployment option mismatch: {v.deployment_options}")
      else:
        score += criteria["importance"].get("deployment", 0)
      # Data residency
      if criteria["data_residency"] != "any" and criteria["data_residency"] not in v.data_residency:
        explanation.append(f"Data residency mismatch: {v.data_residency}")
      # Nice integrations
      nice = set(criteria["nice_integrations"])
      score += len(nice & vendor_integrations)
      recommendations.append({
        "vendor": v.name,
        "score": score,
        "explanation": explanation or ["Meets all criteria"]
      })
  recommendations.sort(key=lambda x: x["score"], reverse=True)
  return Response(recommendations)
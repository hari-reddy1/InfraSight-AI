from typing import List, Dict, Any, Tuple

class DataValidator:
    """
    Strict validation service following SIH26103 Data Governance rules:
    - Never silently alter questionable official values.
    - Flag invalid records, duplicates, negatives, and out-of-bound ranges.
    """
    
    @staticmethod
    def validate_records(raw_records: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
        valid_records = []
        invalid_records = []
        warnings = []
        seen_codes = set()
        duplicate_count = 0
        missing_field_count = 0

        for idx, rec in enumerate(raw_records):
            issues = []
            code = rec.get("project_code")
            
            # Check 1: Missing project code
            if not code or not str(code).strip():
                issues.append("Missing mandatory project_code")
                missing_field_count += 1
                
            # Check 2: Duplicate project code
            if code in seen_codes:
                issues.append(f"Duplicate project_code: {code}")
                duplicate_count += 1
            else:
                seen_codes.add(code)
                
            # Check 3: Non-negative expenditure
            exp = rec.get("expenditure_cr", 0.0)
            if exp < 0:
                issues.append(f"Negative expenditure reported: ₹{exp} Cr")
                
            # Check 4: Approved & Revised cost logic
            appr = rec.get("approved_cost_cr", 0.0)
            rev = rec.get("revised_cost_cr", 0.0)
            if appr <= 0:
                issues.append(f"Invalid original approved cost: ₹{appr} Cr")
            if rev < appr:
                warnings.append({
                    "project_code": code,
                    "warning": f"Revised cost (₹{rev} Cr) is lower than original approved cost (₹{appr} Cr)"
                })
                
            # Check 5: Physical progress range 0 - 100%
            prog = rec.get("physical_progress_pct", 0.0)
            if prog < 0 or prog > 100:
                issues.append(f"Physical progress out of bounds (0-100%): {prog}%")
                
            # Check 6: Geolocation validity
            lat = rec.get("latitude")
            lon = rec.get("longitude")
            if lat is not None and lon is not None:
                if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                    issues.append(f"Invalid geographical coordinates: ({lat}, {lon})")
            elif rec.get("coordinate_source") != "UNAVAILABLE":
                warnings.append({
                    "project_code": code,
                    "warning": "Coordinates not provided; set coordinate_source to UNAVAILABLE"
                })

            if issues:
                invalid_records.append({
                    "record_index": idx,
                    "project_code": code,
                    "issues": issues,
                    "raw_data": rec
                })
            else:
                valid_records.append(rec)
                
        metrics = {
            "total_processed": len(raw_records),
            "valid_count": len(valid_records),
            "invalid_count": len(invalid_records),
            "duplicate_count": duplicate_count,
            "missing_field_count": missing_field_count,
            "warnings": warnings
        }
        
        return valid_records, invalid_records, metrics

def validate_raw_project_records(raw_records: List[Dict[str, Any]], source_name: str):
    valid, invalid, metrics = DataValidator.validate_records(raw_records)
    dq_entry = {
        "total_records": metrics["total_processed"],
        "valid_records": metrics["valid_count"],
        "invalid_records": metrics["invalid_count"],
        "duplicate_records": metrics["duplicate_count"],
        "missing_fields_count": metrics["missing_field_count"],
        "validation_warnings": metrics["warnings"]
    }
    return valid, dq_entry

import re
import os

FILE_16 = "/Users/apple/Coding-projects/Noteee/16_canvas_pdf_media_workflows.md"
FILE_17 = "/Users/apple/Coding-projects/Noteee/17_app_shipping_monetization_spec.md"

def audit_file_16():
    with open(FILE_16, 'r', encoding='utf-8') as f:
        content = f.read()

    checks = {
        "Skia Drawing Engine": "@shopify/react-native-skia" in content and "ISkiaCanvasEngine" in content,
        "Catmull-Rom Spline": "Catmull-Rom" in content or "catmull" in content.lower(),
        "Double Buffering": "double buffer" in content.lower() or "offscreen buffer" in content.lower(),
        "R-Tree Index": "IStrokeSpatialIndex" in content and "RTreeStrokeIndex" in content,
        "Scribble to Erase & Lasso": "scribble" in content.lower() and "lasso" in content.lower(),
        "Handwriting Search (FTS5 & SQLite Vec)": "sqlite-vec" in content and "FTS5" in content and "IHandwritingRecognizer" in content,
        "Deep PDF Annotation Engine": "IPdfAnnotationEngine" in content and "glyph" in content.lower() and "noteee://pdf/" in content,
        "FSRS Image Occlusion": "FSRS" in content and "occlusion" in content.lower(),
        "Mermaid Sequence Diagram": "sequenceDiagram" in content,
        "Mermaid Flowchart Diagram": "flowchart TD" in content,
        "Design Patterns & DIP": "Strategy Pattern" in content or "Composite Pattern" in content or "Clean Architecture" in content,
        "Production Pain-Point Analysis": "Production Pain-Point Analysis" in content or "Pain-Point" in content
    }
    return checks

def audit_file_17():
    with open(FILE_17, 'r', encoding='utf-8') as f:
        content = f.read()

    checks = {
        "App Store & Google Play Guidelines": "App Store Review Guidelines" in content and "Google Play" in content,
        "Info.plist Manifest": "<key>NSCameraUsageDescription</key>" in content or "Info.plist" in content,
        "AndroidManifest.xml": "<manifest" in content or "AndroidManifest.xml" in content,
        "PrivacyInfo.xcprivacy": "NSPrivacyAccessedAPITypes" in content or "PrivacyInfo.xcprivacy" in content,
        "expo-store-review Rules": "expo-store-review" in content or "StoreReview" in content,
        "RevenueCat Integration": "RevenueCat" in content and "Purchases" in content,
        "BYOK Vault Encryption": "expo-secure-store" in content and "Keychain" in content and "Keystore" in content,
        "AdMob Constraints": "AdMob" in content,
        "Analytics & Sentry PII Scrubbing": "Sentry" in content and "scrub" in content.lower(),
        "Mermaid Sequence Diagram": "sequenceDiagram" in content,
        "Mermaid State Diagram": "stateDiagram-v2" in content,
        "Design Patterns & DIP": "Adapter Pattern" in content or "Strategy Pattern" in content or "Clean Architecture" in content,
        "Production Pain-Point Analysis": "Production Pain-Point Analysis" in content or "Pain-Point" in content
    }
    return checks

def main():
    print("=== DEEP SPECIFICATION CONTENT AUDIT ===")
    
    print("\n--- File 16 Audit ---")
    c16 = audit_file_16()
    for item, passed in c16.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  [{status}] {item}")

    print("\n--- File 17 Audit ---")
    c17 = audit_file_17()
    for item, passed in c17.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  [{status}] {item}")

if __name__ == "__main__":
    main()

import math

def check_fsrs_math():
    F = 1.0 / 9.0
    print(f"Decay constant F = 1/9 = {F:.10f}")
    
    # Test R(S, S) for various stability values S
    stabilities = [0.5, 1.0, 5.0, 10.0, 30.0, 365.0]
    
    all_passed = True
    
    print("\n--- Verifying Retention Formula R(S, S) = 0.90 ---")
    for S in stabilities:
        t = S
        R = (1.0 + F * (t / S)) ** (-1)
        diff = abs(R - 0.90)
        status = "PASS" if diff < 1e-12 else "FAIL"
        print(f"S={S:>5.1f}, t={t:>5.1f} => R(S, S) = {R:.10f} (diff with 0.90: {diff:.2e}) [{status}]")
        if status == "FAIL":
            all_passed = False

    print("\n--- Verifying Interval Formula I(0.90, S) = S ---")
    R_target = 0.90
    for S in stabilities:
        I = (S / F) * ((1.0 / R_target) - 1.0)
        diff = abs(I - S)
        status = "PASS" if diff < 1e-12 else "FAIL"
        print(f"S={S:>5.1f}, R_target={R_target:.2f} => I(0.90, S) = {I:.10f} (diff with S: {diff:.2e}) [{status}]")
        if status == "FAIL":
            all_passed = False

    if all_passed:
        print("\n✅ FSRS Mathematical Verification PASSED completely!")
    else:
        print("\n❌ FSRS Mathematical Verification FAILED!")

if __name__ == "__main__":
    check_fsrs_math()

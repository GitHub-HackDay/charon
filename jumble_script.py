#!/usr/bin/env python3

# Jumbled order from the random shuffle
jumbled_order = [41, 94, 32, 2, 12, 97, 21, 64, 31, 19, 29, 79, 22, 53, 20, 68, 25, 55, 95, 92, 
                 34, 51, 6, 1, 54, 4, 24, 63, 59, 13, 56, 73, 78, 74, 80, 49, 42, 38, 5, 28, 
                 100, 62, 60, 86, 23, 17, 45, 3, 52, 18, 66, 76, 7, 98, 85, 83, 8, 96, 75, 77, 
                 70, 71, 30, 89, 48, 35, 87, 90, 57, 47, 11, 14, 43, 33, 50, 61, 40, 27, 9, 81, 
                 88, 15, 69, 99, 39, 72, 84, 91, 16, 36, 46, 10, 67, 82, 58, 26, 37, 65, 93, 44]

# Map original ID to JSD key
id_to_jsd = {}
for i in range(1, 101):
    id_to_jsd[i] = f"JSD-{100 + i}"

# Print the jumbled order with JSD keys
print("// Mock issues database - 100 issues with consistent themes (jumbled order)")
print("const mockIssues = [")

for idx, original_id in enumerate(jumbled_order):
    jsd_key = id_to_jsd[original_id]
    print(f"  // Position {idx + 1}: Original ID {original_id} -> {jsd_key}")

print("];")

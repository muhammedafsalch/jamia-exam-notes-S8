import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

raw_sample = "هِي َالرَّد ُّإلَى النِّكَاح ِمِن ْطَلَاق ٍغَيْر ِبَائِن ٍفِي الْعِدَّة ِكَمَا يُؤْخَذ ُمِمَّا سَيَأْتِي: )شَرْط ُالْمُرْتَجِـع ِأَهْلِيَّة ُالنِّكَاح ِبِنَفْسِهِ( بِأَن ْيَكُون َّبَالِغًا، عَاقِلًا"

# If a harakah is preceded by space, move the harakah to attach to the preceding character, and put the space after it!
# Pattern: ([^\s])\s+([\u064B-\u065F\u0670]+)
fixed = re.sub(r'([^\s])\s+([\u064B-\u065F\u0670]+)', r'\1\2 ', raw_sample)
# Collapse multiple spaces
fixed = re.sub(r'[ ]+', ' ', fixed)
# Fix reversed parentheses
fixed = re.sub(r'\)\s*([^\(\)]+?)\s*\(', r'(\1)', fixed)

print('Original:', raw_sample)
print('Fixed:   ', fixed)

#!/usr/bin/env python3
"""Apply VitaNova's canonical 1600x820 native PBIR page geometry."""
from pathlib import Path
import subprocess,sys
subprocess.run([sys.executable,str(Path(__file__).resolve().parents[2]/'scripts/redesign_powerbi_layout.py')],check=True)

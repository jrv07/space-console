# logger.py
import logging

logger = logging.getLogger("space-console")
logger.setLevel(logging.DEBUG)

# Avoid duplicate handlers if imported multiple times
if not logger.hasHandlers():
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)
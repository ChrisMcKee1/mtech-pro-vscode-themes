"""Domain models for the roastery demo."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class Bean:
    origin: str
    altitude_m: int
    price_per_kg: Decimal

    def is_high_grown(self) -> bool:
        return self.altitude_m >= 1_500


@dataclass(frozen=True)
class Customer:
    name: str
    email: str
    gold_member: bool = False

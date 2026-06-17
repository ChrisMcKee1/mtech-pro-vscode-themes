"""Espresso order pipeline — a syntax-highlighting showcase.

Dense on purpose so a color theme can show off every token type at once:
keywords, decorators, type hints, f-strings, numbers, regex, pattern
matching, async/await and more.
"""

from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
from typing import Final, Iterable, Optional, Protocol

TAX_RATE: Final[float] = 0.0825
LOYALTY_BONUS: Final[int] = 1_000          # points per gold member
SHOP_NAME: Final[str] = "M Tech Roastery"
SKU_PATTERN = re.compile(r"^(?P<roast>[A-Z]{3})-(?P<size>\d{2})$")
PRICE_TABLE: dict[str, float] = {
    "espresso": 2.50,
    "latte": 4.25,
    "cold brew": 5.00,
    "affogato": 6.75,
}


class Roast(Enum):
    """Roast intensity, brightest to darkest."""

    BLONDE = auto()
    MEDIUM = auto()
    DARK = auto()
    OBSIDIAN = auto()  # the house favorite


@dataclass(slots=True)
class Order:
    customer: str
    items: list[str] = field(default_factory=list)
    roast: Roast = Roast.MEDIUM
    gold_member: bool = False
    placed_at: datetime = field(default_factory=datetime.now)

    @property
    def subtotal(self) -> float:
        return sum(PRICE_TABLE.get(item, 0.0) for item in self.items)

    @property
    def total(self) -> float:
        return round(self.subtotal * (1 + TAX_RATE), 2)

    def __str__(self) -> str:
        badge = "*" if self.gold_member else "-"
        return f"{badge} {self.customer:<12} -> ${self.total:>6.2f} ({len(self.items)} items)"


class Brewer(Protocol):
    async def brew(self, order: Order) -> str: ...


async def brew(order: Order, *, machine: str = "La Marzocco") -> str:
    """Pretend to pull shots; yield control so the loop stays responsive."""
    await asyncio.sleep(0.01 * len(order.items))
    match order.roast:
        case Roast.BLONDE | Roast.MEDIUM:
            note = "bright, citrusy"
        case Roast.DARK:
            note = "bold, chocolatey"
        case Roast.OBSIDIAN:
            note = "intense - 0xC0FFEE"
        case _:
            note = "balanced"
    return f"[{machine}] {order.customer}: {note}"


def parse_sku(raw: str) -> Optional[tuple[str, int]]:
    if (m := SKU_PATTERN.match(raw.strip())) is None:
        return None
    return m["roast"], int(m["size"])


def reward_points(orders: Iterable[Order]) -> int:
    return sum(
        LOYALTY_BONUS if o.gold_member else int(o.total)
        for o in orders
    )


async def main() -> None:
    queue = [
        Order("Ada Lovelace", ["espresso", "affogato"], Roast.OBSIDIAN, gold_member=True),
        Order("Alan Turing", ["latte", "cold brew"], Roast.DARK),
        Order("Grace Hopper", ["espresso"], gold_member=True),
    ]

    print(f"{SHOP_NAME} - {len(queue)} orders queued\n")
    results = await asyncio.gather(*(brew(order) for order in queue))

    for order, line in zip(queue, results, strict=True):
        print(order)
        print(f"    {line}")

    points = reward_points(queue)
    print(f"\nLoyalty points earned today: {points:,}")
    assert points >= 0, "points can never be negative"


if __name__ == "__main__":
    asyncio.run(main())

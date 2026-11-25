from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


def calculate_tip(bill: Decimal, tip_percent: Decimal) -> Decimal:
	"""Return the tip amount, rounded to the nearest cent."""
	return (bill * tip_percent / Decimal("100")).quantize(
		Decimal("0.01"), rounding=ROUND_HALF_UP
	)


def main() -> None:
	try:
		bill = Decimal(input("Bill amount: ").strip())
		tip_percent = Decimal(input("Tip percentage: ").strip())
		people = int(input("Number of people splitting the bill [1]: ").strip() or "1")
		if not bill.is_finite() or not tip_percent.is_finite():
			raise ValueError
		if bill < 0 or tip_percent < 0 or people < 1:
			raise ValueError
	except (InvalidOperation, ValueError):
		print("Enter valid non-negative amounts and a split of at least 1 person.")
		return

	tip = calculate_tip(bill, tip_percent)
	total = bill + tip
	print(f"Tip:   ${tip:.2f}")
	print(f"Total: ${total:.2f}")
	print(f"Each:  ${(total / people).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP):.2f}")


if __name__ == "__main__":
	main()

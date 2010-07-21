function addCommas(nStr)
{
	nStr += '';
	if (nStr.match(/,/))
	{
		nStr = nStr.replace(/,/i, '');
	}
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

$(document).ready(function() {
	$('#pre-tax-income').keyup(function() {
		this.value = addCommas(this.value);
	});
	$('#monthly-expenses').keyup(function() {
		this.value = addCommas(this.value);
	});
	$('#monthly-mortgage').keyup(function() {
		this.value = addCommas(this.value);
	});
	$('#pre-tax-income').select();
});

function calculateIncomeTax()
{

	pre_tax_income = $('#pre-tax-income').val().replace(/,/, '');
	monthly_expenses = $('#monthly-expenses').val().replace(/,/, '');
	monthly_mortgage = $('#monthly-mortgage').val().replace(/,/, '');

	if (isNaN(parseInt(pre_tax_income)) || parseInt(pre_tax_income) <= 0)
	{
		alert('You must enter a valid Pre-Tax Income');
		return false;
	}
		
	var objIncomeTax = {
		"brackets": [
			{"income_low": 0, "income_high": 15650, "base_tax": 0, "added_rate": 10, "amount_over":	0},
			{"income_low": 15650, "income_high": 63700, "base_tax": 1565.00, "added_rate": 15, "amount_over":	15650},
			{"income_low": 63700, "income_high": 128500, "base_tax": 8772.50, "added_rate": 25, "amount_over":	63700},
			{"income_low": 128500, "income_high": 195850, "base_tax": 24972.50, "added_rate": 28, "amount_over":	128500},
			{"income_low": 195850, "income_high": 349700, "base_tax": 43830.5, "added_rate": 33, "amount_over":	195850},
			{"income_low": 349700, "income_high": null, "base_tax": 94601.00, "added_rate": 35, "amount_over":	349700}
		],
		"ss_tax_rate": .062,
		"ss_taxable_limit": 102000
	};

	for (i = 0; i < objIncomeTax.brackets.length; i++)
	{
		cur = objIncomeTax.brackets[i];
		if ((pre_tax_income > cur.income_low && pre_tax_income <= cur.income_high) || (pre_tax_income > cur.income_low && cur.income_high == null))
		{
			$('#base-tax').val(addCommas(cur.base_tax));
			$('#added-rate').val(cur.added_rate);
			$('#amount-over').val(addCommas(cur.amount_over));
			
			ss_taxable_amount = 0;
			$('#ss-taxable-amount').val(0);
      if ($('input[name=calculate_ss]:checked').val() == 'yes')
			{
				ss_taxable_income = pre_tax_income > objIncomeTax.ss_taxable_limit ? objIncomeTax.ss_taxable_limit : pre_tax_income;
				ss_taxable_amount = (ss_taxable_income * objIncomeTax.ss_tax_rate).toFixed(2);
				$('#ss-taxable-amount').val(addCommas(ss_taxable_amount));
			}
			
			taxable_amount = parseInt(cur.base_tax + parseInt(ss_taxable_amount) +  ((pre_tax_income - cur.amount_over) * (cur.added_rate/100))).toFixed(2);
			$('#taxable-amount').val(addCommas(taxable_amount));
			
			post_tax_income = (pre_tax_income - taxable_amount).toFixed(2);
			monthly_income = (post_tax_income/12).toFixed(2);
			bi_monthly_income = (post_tax_income/24).toFixed(2);
			surplus_dollars = monthly_income - monthly_expenses - monthly_mortgage;

			$('#post-tax-income').val(addCommas(post_tax_income));
			$('#monthly-income').val(addCommas(monthly_income));
			$('#bi-monthly-income').val(addCommas(bi_monthly_income));

			// if (surplus_dollars < 0)
			// {
			// 	$('#surplus-income').style.color = 'red';
			// }
			$('#surplus-income').val(addCommas(surplus_dollars));
			return true;
		}
	}
	
}

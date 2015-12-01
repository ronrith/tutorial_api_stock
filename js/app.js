
/*

Author: Sarorn Rith
Date: 12/01/2015

*/

$(document).ready(function() {
	
	/* jQuery Ready State */

	var fetchSymbols = function(symbols){
		
		/* Yahoo YQL endpoint for stock search (public) */

		var endpoint = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22none,"+symbols+"%22)&env=store://datatables.org/alltableswithkeys&format=json";
		
		/* jQuery AJax Request */

		$.ajax({
			url: endpoint,
			cache: true,
			success: function(data){
				
				/* Function when request succeeds */

				var dataQuotes, content, index=0;

				// Set Root for JSON data
				dataQuotes=data.query.results.quote;

				// Loop through Objects
				Object.keys(dataQuotes).forEach(function(key) {

					// If Symbol exists
					if (dataQuotes[key].symbol != null && dataQuotes[key].symbol != 'none'){

						// Counter for Index
						index++;

						// Loop and generate contents
						content = "<div class='panel panel-default snapshot'> \
						<div class='panel-heading'> \
							<button class='btn btn-default remove'>X</button> \
							<h4>"+dataQuotes[key].Name+" ("+dataQuotes[key].ChangeinPercent+")</h4>\
							Symbol: <b>"+(dataQuotes[key].symbol).toUpperCase()+"</b> \
							Price: <b>"+dataQuotes[key].LastTradePriceOnly+"</b> \
							Volume: <b>"+dataQuotes[key].Volume+"</b> \
						</div> \
						<div class='panel-body'><ul>";
						for (item in dataQuotes[key]){
							if (dataQuotes[key][item] != null){
								content += "<li>" + item + ": <span>" + dataQuotes[key][item] + "</span></li>";
							}
						}
						content += "</ul></div></div>";

						// Append contents to top container (id: #result)
						$(content).hide().prependTo("#result").fadeIn(index*250); 
					}
				});
			}
		})
	}	

	// Bind an event handler for "click" on Search button
	$('#btn-search').on('click', function(){	
		fetchSymbols($('#symbols').val()); 
	});

	// Bind an event handler when keypressed "Enter"
	$("#symbols").keypress(function(event) {
	  if ( event.which == 13 ) {
	     event.preventDefault();
	     fetchSymbols($('#symbols').val());
	     $('#symbols').val('');
	  }
	});

	// Bind an event handler for "click" on Remove button and delegate appending elements
	$('#result').on('click', '.snapshot div .remove', function(){

		// Search/Traverse for Parent element, fadeOut animation, and remove element
		$(this).closest('.snapshot').fadeOut(250, function(){
			$(this).remove();
		});
	});

	// Initial Fetch
	fetchSymbols("AAPL,MSFT,TSLA"); 
});
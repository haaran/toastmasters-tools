$(document).ready(function() {
	
		
	var filterDataTable = function(filter){
		var array = [];
		
		// Add in any of the elements that match
		for(var x=0;x<data.length;++x){
			var value=data[x];
		
			// Check if any of the columns have the value in it
			for(var y=0;y<value.length;++y){
				var val = value[y];
			
				if(val!=undefined&&val.toString().toLowerCase().indexOf(filter.toLowerCase())!=-1){
					array.push(value);
					break;
				}
			};
		};
		
		return array;
	};
	
	var sortData = function(data, sortOrder) {
		var sortLength = sortOrder.length;
		
		// Cycle backwards through the sort orders
		for(var x=sortLength-1;x>=0;--x) {
			var sortInfo = sortOrder[x];
			
			data.sort(function (a,b) {
				var valA = a[sortInfo.Name];
				var valB = b[sortInfo.Name];
				
				// Check if the object is empty
				if((valA==undefined && valB==undefined)||valA==undefined) {
				    // Both are undefined, so just return the first one
				    return -1;
				}
				else if(valB==undefined) {
                    return 1;
                }
			
				// Check which way we are sorting
				switch(sortInfo.Direction) {
				    case 'ASC':
    					return valA.toString().localeCompare(valB.toString());
    				case 'DESC':
    				    return valB.toString().localeCompare(valA.toString());
    				default:
    				    // No sort order, so return it in the order it came in
    				    return -1;
				}
			});
		}
	};
		
	var pageData = function(current) {
		// Grab the data table
		var filtered = $.data(current.Table[0],'rows');
		
		// Sort the filtered data
		sortData(filtered, current.SortOrder);
	
		// Calculate the starting position 
		var startItemNumber = (current.PageNumber-1) * current.RowsPerPage;
		
		// Check if we are exceeding our maximum
		if(startItemNumber>filtered.length){
			// Recalculate the page information
			current.PageNumber = Math.ceil(filtered.length/current.RowsPerPage);
			
			// Set the page starting location
			startItemNumber = (current.PageNumber-1) * current.RowsPerPage;
		}
		
		// Calculate the finishing position
		var endItemNumber = current.PageNumber * current.RowsPerPage;
		
		// Make sure we aren't exceeding the length of our data
		if(endItemNumber>filtered.length){
			// We are, so chop it off
			endItemNumber=filtered.length;
		}
		
		// Grab the corresponding set of rows
		var array = [];
		
		for(var x=startItemNumber;x<endItemNumber;++x) {
			array.push(filtered[x]);
		}
	
        return {
            RowCount: filtered.length
            , TableData: filtered
        };
    };
	
    $('#members').each(function () {
    	
        var $headerCells = $(this).find("tr th"),
        	$rows = $(this).find('tr');
    
	    var headers = [],
	        rows = [];
    
	    $headerCells.each(function(k,v) {
	       headers[headers.length] = $(this).text();
	    });
    	
    	$rows.each(function(row,v) {
    	    $(this).find("td").each(function(cell,v) {
    	      if (typeof rows[row-1] === 'undefined') rows[row-1] = [];
    	      rows[row-1][cell] = $(this).text();
    	    });
    	  });
    	
    	$(this).data('rows', rows);
    });
    
	$('#members').table({
		Callback: pageData
		, LoadingClass: 'loading' 
		, Sort: {
		    Style: {
		        Ascending: 'sortAsc'
		        , Descending: 'sortDesc'
		        , None: 'sortNone'
    		}
		}
        , Edit: {
            Url: '/tools/members'
            , Key: 0
            , Values: {
                id: {
                    type: 'integer'
                }
                , name: {
                    type: 'text'
                }
                , email: {
                    type: 'text'
                }
                , birth_month: {
                    type: 'select'
                    , options: ["January", "February"]
                }
                , join_date: {
                    type: 'date'
                }
                , last_attended: {
                    type: 'date'
                }
                , last_speech: {
                    type: 'date'
                }
                , speech_description: {
                    type: 'text'
                }
            }
        }
	});
});
(function($){
 $.fn.table = function(options) {
	/**
	 * @param options All of the configuration settings for the table object
	 */
	return this.each(function () {
	
		var $this = $(this);
		
	    /**
	     * An enumeration of all of the different states of the sort which are
	     * available.
	     */
	    var Sorting = {
	        ASC: 'ASC'
	        , DESC: 'DESC'
	        , NONE: 'NONE'
	    };
	
	    /**
	     * The names of each of the columns (if any)
	     */
	    var columnNames = options.ColumnNames || [];
	    
	    /**
	     * An object to hold all of the sorting information
	     */
	    var sorter = options.Sort || {};
	
	    /**
	     * An object to hold all of the filter information
	     */
	    var filter = options.Filter || {};
	    
	    /**
	     * The pagination configuration
	     */
	    var pagination = options.Pagination || {};

        /**
         * The editing options
         */
        var edit = options.Edit || {};
	    
	    /**
	     * The class used for the loading object
	     */
	    var loadingClass = options.LoadingClass || '';
	    
	    /**
	     * Any events that happen prior to the request.
	     */
	    var preEvents = [];
	    
	    /**
	     * Any events that happen after the request.
	     */
	    var postEvents = [];
	    
	    /**
	     * Used when the user requests the next page in the table.
	     * @param options An object containing various pieces of information 
	     *             { PageNumber int, SortOrder array }
	     * @returns object { MaxPages int, TableData array }
	     */
	    var callback = options.Callback || function (options) {
	        alert('Not Implemented');
	    };
	    
	    var onBegin = options.OnBegin || function (options) {
	    	
	    };
	    
	    var onComplete = options.OnComplete || function (options) {
	    	
	    };
	    
	    var addPreRequestHandler = function(e) {
	        preEvents.push(e);
	    };
	    
	    var addPostRequestHandler = function(e) {
	        postEvents.push(e);
	    };
	    
	    /**
	     * This function is called when the user chooses to go to the next page.
	     */
	    var buildPage = function() {
	        var eventCount = preEvents.length;
	    
	        // Run through any of the functions that should happen before the request
	        for(var x=0;x<eventCount;++x){
	            // Fire the event
	            preEvents[x]();
	        }
	        
	        // Check if there is a loading style
	        if(loadingClass!='') {
	            // The class exists, so we need to use it
	            $($this).find('tbody tr td').remove();
	            
	            // Count how many columns there are (for the colspan)
	            var columnCount = $($this).children('thead > tr').children().length;
	            
	            var loading = '<tr><td colspan="' + columnCount + '" class="' + loadingClass + '"></td></tr>';
	            
	            // Grab the footer
	            var tfoot = $($this).find('tfoot');
	            
	            // Remove the footer
	            $($this).find('tfoot').remove();
	            
	            // Add in the rows and then the footer
	            $($this).append(loading).append(tfoot);
	        }
	
	        // Build the table
	        var data = callback({
	            PageNumber: pagination.CurrentPage
	            , SortOrder: sorter.Order
	            , Filter: filter.Value
	            , RowsPerPage: pagination.RowsPerPage
	            , Table: $this
	        });
	        
	        // Update the max pages if it was set
	        pagination.MaximumPage = Math.ceil(data.RowCount/pagination.RowsPerPage)
	            || pagination.MaximumPage;
	        
	        buildTable(data.TableData);
	        
	        var eventCount = postEvents.length;
	        
	        // Run through any of the functions that should happen after the request
	        for(var x=0;x<eventCount;++x){
	            // Fire the event
	            call(postEvents[x],$this);
	        }
	    };
	    
	    var call = function(e,params){
	    	e(params);
	    };
	    
	    
	    var buildTable = function(data) {
	        var rows = '';
	        
	        $.each(data, function(index, value) {
	            rows += '<tr>';
	            
	            $.each(value, function(key, val) {
                    // Check if the value is visible
                    var visibility=$(key).is(':visible')?'':' style="display:none;"';

	                rows += '<td' + visibility + '>' + val + '</td>';
	            });
	            
	            rows += '</tr>';
	        });
	        
	        // Clear out the tbody
	        $.each($($this).find('tbody').children(), function(c,v){
	        	// Look for any th
	        	if($(v).find('th').length!=0){
	        		return;
	        	}
	        	
	        	$(v).remove();
	        });
	        
	        // Grab the footer
	        var tfoot = $($this).find('tfoot');
	        
	        // Remove the footer
	        $($this).find('tfoot').remove();
	        
	        // Add in the rows and then the footer
	        $($this).append(rows).append(tfoot);
	    };
	
	    /**
	     * Removes the array item in the given position.
	     * @param rows The array that we'll be removing from
	     * @param index The index of the item to remove.
	     * @return The removed item.
	     */
	    var removeAt = function (rows, index) {
	        var vItem = rows[index];
	        
	        // Make sure the item exists
	        if (vItem) {
	            // Remove it
	            rows.splice(index, 1);
	        }
	        
	        // Return the item
	        return vItem;
	    };
	    
	    var checkSortOrder = function(columnName){
	        var idx = null;
	        
	        // Cycle through all of the sorted elements
	        $.each(sorter.Order,function(index,value){
	            // Check if the field is already sorted on
	            if(value.Name==columnName){
	                idx=index;
	                return;
	            }
	        });
	        
	        return idx;        
	    };
	
	    var fillSorter = function() {
	        /**
	         * The order in which all of the columns are sorted
	         */
	        sorter.Order = sorter.Order || [];
	    
	        /**
	         * An array of all of the columns which aren't sortable (the indexes of the
	         * columns which aren't sortable)
	         */
	        sorter.NonSortable = sorter.NonSortable || [];
	    
	        /**
	         * Set the sorter style if it isn't set
	         */
	        sorter.Style = sorter.Style || {};
	    
	        /**
	         * Set the style added to the class of the ascending order sort.
	         */
	        sorter.Style.Ascending = sorter.Style.Ascending || 'sortAsc';
	        
	        /**
	         * Set the style added to the class of the ascending order sort.
	         */
	        sorter.Style.Descending = sorter.Style.Descending || 'sortDesc';
	        
	        /**
	         * Set the style added to the class of the ascending order sort.
	         */
	        sorter.Style.None = sorter.Style.None || 'sortNone';
	    };
	
	    var fillFilter = function() {        
	        /**
	         * The field that will be used for filtering
	         */
	        filter.Target = filter.Target;
	
	        /**
	         * The string that is being filtered on
	         */
	        filter.Value = filter.Value || '';
	
	        /**
	         * The minimum length that the field needs to be before the search kicks in
	         */
	        filter.MinimumLength = filter.MinimumLength || 3;
	
	        /**
	         * The event that is being triggered (defaulted to key up)
	         */
	        filter.Event = filter.Event || 'keyup';
	    };
	    
	    var fillPagination = function() {
	        /**
	         * The number of rows per page
	         */
	        pagination.RowsPerPage = pagination.RowsPerPage || 5;
	        
	        /**
	         * The maximum number of pages that the result set has
	         */
	        pagination.MaxPage = pagination.MaximumPage || 1;
	        
	        /**
	         * The current page that the result set is on
	         */
	        pagination.CurrentPage = pagination.CurrentPage || 1;
	    };

        var fillEdit = function() {

            /**
             * Default the URL to the current page
             */
            edit.Url = edit.Url || '#';

            /**
             * Default the key value to the first column
             */
            edit.Key = edit.Key || 0;

        }
	    
	    var initializeTable = function () {
	        // For any table row that has the sortable attribute, add a click event
	        $.each($($this).find('th'), function(index,value){
	            var skip = false;
	            // Check if this was one of the unsortable columns
	            $.each(sorter.NonSortable, function(idx,val){
	                // Check if it was in the list of unsortables
	                if(val==index){
	                    // It was, so skip it
	                    skip=true;
	                    return;
	                }
	            });
	            
	            // Check if we were told to skip it
	            if(skip){
	                // Don't bind an event
	                return;
	            }
	            
	            // Add the hand icon
	            $(this).css('cursor','pointer');
	        
	            // Bind the event
	            $(this).click(function(e){
	                // Grab the column name or the column's index if the column name isn't set
	                var columnName = columnNames[index] || index;
	                
	                // Find where the column exists (if it does)
	                var location = checkSortOrder(columnName);
	                
	                // Default the sort order to ascending
	                var direction = Sorting.ASC;
	                
	                // Check if the location exists
	                if(location!=null){
	                    // It was being sorted on, so we'll be sorting in the opposite
	                    // direction
	                    switch(sorter.Order[location].Direction) {
	                        case Sorting.ASC:
	                            // Ascending -> Descending
	                            direction=Sorting.DESC;
	                            cssClass=sorter.Style.Descending;
	                            break;
	                        case Sorting.DESC:
	                            // Descending -> None
	                            direction=Sorting.NONE;
	                            
	                            // No css class
	                            cssClass='';
	                            break;
	                        case Sorting.NONE:
	                            // None -> Ascending
	                            direction=Sorting.ASC;
	                            cssClass=sorter.Style.Ascending;
	                            break;
	                    }
	                }
	                
	                // Check if the shift key was held
	                if(e.shiftKey) {
	                    // It was held, so maintain the original order
	                    
	                    // Check if it previously existed
	                    if(location!=null) {
	                        // It was already selected, so update it (or remove it if NONE)
	                        if(direction==Sorting.NONE) {
	                            // If the sort has been set to NONE, then remove it
	                            removeAt(sorter.Order,location);
	                        }
	                        else {
	                            // Otherwise, sort it
	                            sorter.Order[location].Direction=direction;
	                        }
	                    }
	                    else {
	                        // It didn't exist, so push it to the end of the list
	                        sorter.Order.push({ Name: columnName, Direction: direction, Index: index });
	                    }
	                }
	                else {
	                    // Shift wasn't held, so only sort on this field
	                    sorter.Order = [{ Name: columnName, Direction: direction, Index: index }];
	                    
	                    // Clear all of the other CSS classes
	                    $(this).siblings().removeClass(sorter.Style.Descending).removeClass(sorter.Style.Ascending);
	                }
	                
	                // Update the CSS class
	                if(direction==Sorting.ASC) {
	                    $(this).removeClass(sorter.Style.Descending).addClass(sorter.Style.Ascending);
	                }
	                else if(direction==Sorting.DESC) {
	                    $(this).removeClass(sorter.Style.Ascending).addClass(sorter.Style.Descending);
	                }
	                else {
	                    // No sort order, so remove the class
	                    $(this).removeClass(sorter.Style.Descending).removeClass(sorter.Style.Ascending);
	                }
	                                
	                // Now that we have the new sort order, request updated data
	                buildPage();
	            });
	        });
	    };
	    
	    /**
	     * This function is used internally in order to set up the filter as required.
	     */
	    var initializeFilterBox = function() {
	        // Check if the filter field is empty
	        if(filter.Target==''||filter.Target=='undefined'){
	            // It is, so we don't need to do anything
	            return;        
	        }
	        
	        // Otherwise bind an onchange event
	        $(filter.Target).bind(filter.Event, function(e){
	            // Check if it meets the minimum length
	            if($($this).val().length<filter.MinimumLength&&$($this).val()!=''){
	                // Doesn't meet the minimum length, so ignore it
	                return;
	            }
	            
	            // Update the filter's value
	            filter.Value=$($this).val();
	            
	            // It did meet the minimum requirements, so request an updated page
	            buildPage();
	        });
	    };
	    
	    /**
	     * This function is used internally in order to set up the pagination as required.
	     */
	    var initializePagination = function() {
	        // Check if the first button is set
	        if(pagination.First!='' && pagination.First!='undefined'){
	            $(pagination.First).bind('click', function(e) {
	                // Prevent any default actions
	                e.preventDefault();
	            
	                // Click first, so move to the first page
	                pagination.CurrentPage = 1;
	                
	                // Build the table
	                buildPage();
	            });
	        }
	        
	        // Check if the previous button is set
	        if(pagination.Previous!='' && pagination.Previous!='undefined'){
	            $(pagination.Previous).bind('click', function(e) {
	                // Prevent any default actions
	                e.preventDefault();
	            
	                // Click previous, so move to the previous page
	                if(pagination.CurrentPage>1){
	                    --pagination.CurrentPage;
	                }
	                
	                // Build the table
	                buildPage();
	            });
	        }
	        
	        // Check if the next button is set
	        if(pagination.Next!='' && pagination.Next!='undefined'){
	            $(pagination.Next).bind('click', function(e) {
	                // Prevent any default actions
	                e.preventDefault();
	            
	                // Click next, so move to the next page
	                if(pagination.CurrentPage<pagination.MaximumPage){
	                    ++pagination.CurrentPage;
	                }
	                
	                // Build the table
	                buildPage();
	            });
	        }
	        
	        // Check if the last button is set
	        if(pagination.Last!='' && pagination.Last!='undefined'){
	            $(pagination.Last).bind('click', function(e) {
	                // Prevent any default actions
	                e.preventDefault();
	            
	                // Click last, so move to the last page
	                pagination.CurrentPage = pagination.MaximumPage;
	                
	                // Build the table
	                buildPage();
	            });
	        }
	        
	        // Check if the text section is set
	        if(pagination.PageDescription!='' && pagination.PageDescription!='undefined'){
	            // Add a post-processing event
	        	addPostRequestHandler(function (e){
	                // Check if the current page is greater than the maximum page
	                if(pagination.CurrentPage>pagination.MaximumPage){
	                    // It is, so we are on the last page
	                    pagination.CurrentPage=pagination.MaximumPage;
	                }
	                
	                // Update the field
	                $(pagination.PageDescription).val(pagination.CurrentPage + ' / ' + pagination.MaximumPage);
	            });
	        }
	        
	        // Check if the input field for how many rows per page is set
	        if(pagination.PerPage!='' && pagination.PerPage!='undefined') {
	            // Add the change event
	            $(pagination.PerPage).bind('change', function(e) {
	                // Prevent any default actions
	                e.preventDefault();
	                
	                // Set the maximum number of rows per page 
	                pagination.RowsPerPage = $($this).val();
	                
	                // Rebuild the table
	                buildPage();
	            });
	        }
	    };

        var initializeEdit = function() {
            // Bind to the double clicking of cells
            $(this).bind('dblclick', function(e){
                // Find the value that was targeted
                var key=$($(e.target).siblings()[edit.Key]).html();

                // Build the object based on the type

            });
        };
	    
	    /**
	     * @param obj The cell that we are looking for
	     */
	    var rowNumber = function ( obj ) {
	        return $(obj).parent().parent().children().index($(obj).parent());
	    };
	    
	    /**
	     * @param obj The cell that we are looking for
	     */
	    var columnNumber = function ( obj ) {
	        return $(obj).parent().children().index($(obj));
	    };
	    
	    /**
	     * Returns the number of rows that the table contains
	     * @param obj The cell that we are looking for
	     */
	    var maxRows = function ( obj ) {
	        return $(obj).parent().parent().length;
	    };
	    
	    /**
	     * Returns the number of columns that the table contains
	     * @param obj The cell that we are looking for
	     */
	    var maxColumns = function ( obj ) {
	        return $(obj).parent().length;
	    };
	    
	    /**
	     * This function to initialize everything required for the table.
	     */
	    var initialize = function () {
	    	onBegin({
		    	callback: callback
		        , refresh: buildPage
		        , addPreRequestHandler: addPreRequestHandler
		        , addPostRequestHandler: addPostRequestHandler
		    });
	    	
	        // Fill the sorter configuration object
	        fillSorter();
	    
	        // Fill the filter configuration object
	        fillFilter();
	        
	        // Fill the pagination configuration object
	        fillPagination();

            // Fill the edit configuration object
            fillEdit();
	    
	        // Initialize the table's events
	        initializeTable();
	        
	        // Initialize the filter criteria box
	        initializeFilterBox();
	        
	        // Initialize the pagination control
	        initializePagination();

            // Initialize the edit control
            initializeEdit();
	        
	        // Build the current page
	        buildPage();
	        
	        // We are done so fire the onComplete method
	        onComplete({
		    	callback: callback
		        , refresh: buildPage
		        , addPreRequestHandler: addPreRequestHandler
		        , addPostRequestHandler: addPostRequestHandler
		    });
	    };
	    
	    initialize();
	});
	
	var x;
 };
})(jQuery);

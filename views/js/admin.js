
$(document).ready(function(){
	$('#calc').click(function(){
		var val = $('#num').val();
		var tval = $('#mtype').val();
		val = val.replace(/\D/g,'');
		if(val != 0 && $.isNumeric(val) == true){
			calculateImages(val,tval);
		} else {
			alert('Please enter a number');
		}		
	});

	$('#Mincalc').click(function(){
		var val = $('#num').val();
		val = val.replace(/\D/g,'');
		
		if(val != 0 && $.isNumeric(val) == true && val >= 1){
			calculateVideos(val);
		} else {
			alert('Please enter a number');
		}		
	});



	$('#month').click(function(){
		$('input#billing_period').val('month');
	});

	$('#year').click(function(){
		$('input#billing_period').val('year');
	});

	$('#plugin').click(function(){
    	$('input#license_type').val('plugin');
		$('#order_form').submit();    	
	});

	$('#standard').click(function(){
    	$('input#license_type').val('standard');
		$('#order_form').submit(); 
	});

	$('#enterprise').click(function(){
    	$('input#license_type').val('enterprise');
		$('#order_form').submit(); 
	});	
	
	$('#savedomain').click(function(){
		$('#domain_form').submit(); 
	});	
	
	$("input.key").focus(function() { $(this).select(); } );
	$('input.key').mouseup(function(e) { return false; });
	
	
	$( "#addtoblack" ).submit(function( event ) {
		var ds = 0;
		var dshtml = '';
		if ($('#filter_ds').is(':checked')) {
			ds = 1;
		} 		
		$.post("/account/filter/addfilterword.php",
		{
			siteid: $('input#siteid').val(),
			word:$('input#addFilterWord').val(),
			ds: ds
		},
		function(data,status){
			if (data == 2) {
				data = $('input#addFilterWord').val() + ' is already in your blacklist.';
				$("#listmessage").html(data);
				showListMessage();
			} else {
				$("#listmessage").html('Word added to your blacklist.');
				showListMessage();
				// stick in the li item
				if (ds == 1) {
					dshtml = "class='deepsearch'";
				}
				
				$('#bl2').prepend('<li><a href="javascript:void(0);" onclick="selectWord(\'bl\', \'blacklist\', \''+data+'\');" id="bl'+data+'" '+dshtml+'>'+$('input#addFilterWord').val()+'</a></li>');	
				$('input#addFilterWord').val("");
								
			}
		});		
		return false;
	});	
	
	$( "#theblacklist" ).submit(function( event ) {
		$.post("/account/filter/removefilterword.php",
		{		
			siteid: $('input#siteid').val(),
			id:$('input#blacklist').val()
		},
		function(data,status){
			var li_item = "#bl"+data;
			$("#listmessage").html('Your list has been updated.');
			$( li_item ).remove();
			showListMessage();
		});		
		return false;
	});		
	
	
	$( "#deeptoggle" ).click(function( event ) {
	    var blockedid = $("#blacklist").val();
		$.post("/account/filter/toggledeep.php",
		{		
			wordid: blockedid,
			siteid: $('input#siteid').val()
		},
		function(data,status){
			var blw = '#bl'+blockedid;
			if (data == 'on') {
				$(blw).addClass('deepsearch');
			} else if (data == 'off') {
				$(blw).removeClass('deepsearch');
			}
		});		
		return false;
	});		


	$( "#deepwhitetoggle" ).click(function( event ) {
	    var blockedid = $("#whitelist").val();	
		$.post("/account/filter/togglewhitedeep.php",
		{		
			wordid: blockedid,
			siteid: $('input#siteid').val()
		},
		function(data,status){
			var blw = '#wl'+blockedid;
			if (data == 'on') {
				$(blw).addClass('deepsearch');
			} else if (data == 'off') {
				$(blw).removeClass('deepsearch');
			}
		});		
		return false;
	});	


	$( "#addtowhite" ).click(function( event ) {
		var ds = 0;
		var dshtml = '';
		
		if ($('#filter_wlds').is(':checked')) {
			ds = 1;
		} 	
		
		$.post("/account/filter/addnonfilterword.php", {
			siteid: $('input#siteid').val(),
			word:$('input#addNonFilterWord').val(),
			ds:ds
		},
		function(data,status){
			if (data == 2) {
				data = $('input#addNonFilterWord').val() + ' is already in your whitelist.';
				$("#listmessage").html(data);
				showListMessage();
			} else {
				$("#listmessage").html('Word added to your whitelist.');
				showListMessage();
				// stick in the li item
				if (ds == 1) {
					dshtml = "class='deepsearch'";
				}
				
				
				
				$('#wl2').prepend('<li><a href="javascript:void(0);" onclick="selectWord(\'wl\', \'whitelist\', \''+data+'\');" id="wl'+data+'" '+dshtml+'>'+$('input#addNonFilterWord').val()+'</a></li>');	
				$('input#addNonFilterWord').val("");
								
			}
		});		
		return false;
	});	

	$( "#thewhitelist" ).submit(function( event ) {	
		$.post("/account/filter/removenonfilterword.php",
		{		
			siteid: $('input#siteid').val(),
			id:$('input#whitelist').val(),
		},
		function(data,status){
			var li_item = "#wl"+data;
			$("#listmessage").html('Your list has been updated.');
			$( li_item ).remove();
			showListMessage();
		});		
		return false;
	});	
		
	// Account Menu Drop Down
	$('.account').click(function(){
		if($('#accountMenu').hasClass('open')){
			$('#accountMenu').removeClass('open');
			$('#accountOverlay').hide();
		} else {
			$('#accountMenu').addClass('open');
			$('#accountOverlay').show();
		}
	});

	$('#accountOverlay').click(function() {
		closeAccountMenu();
	});	


	// Image Moderation Drop Down
	$('#currentMonthStats').click(function(){
		if($('#selectMonth').hasClass('open')){
			$('#selectMonth').removeClass('open');
			$('#accountOverlay').hide();
		} else {
			$('#selectMonth').addClass('open');
			$('#accountOverlay').show();
		}
	});
	
	$('#selectMonth a').click(function(){
		var id = $(this).attr('id');
		updateImageStats(id);
	});
	
	
	$('#resetStats').click(function(){		
       $("#percrej").html($("#livepercrej").val());
       $("#imgtotal").html($("#liveimgtotal").val());   
       $("#imgrejected").html($("#liveimgrejected").val());         			
       var displayDate = $("#livemonth").val()+" "+$("#liveyear").val();
	   $("#livedate").html(displayDate);  
	});


	
	// image moderation settings
	$('#save_callback').click(function() {
	
		if (!URLTest($('input#callback').val())) {
			$("#listmessage").html('Please enter in a valid URL. ex: http://www.yoursite.com/callback');
			showListMessage();			
			return false;
		}
	
		$.post("/account/moderations/updateCallback.php",
		{		
			siteid: $('input#siteid').val(),
			callback:$('input#callback').val(),
		},
		function(data,status){
			$("#listmessage").html('Your callback url has been updated.');
			showListMessage();
			return false;
		});		

	});



	// image moderation settings
	$('#save_vidcallback').click(function() {
	
		if (!URLTest($('input#callback').val())) {
			$("#listmessage").html('Please enter in a valid URL. ex: http://www.yoursite.com/callback');
			showListMessage();			
			return false;
		}
	
		$.post("/account/videos/updateVIDCallback.php",
		{		
			siteid: $('input#siteid').val(),
			callback:$('input#callback').val(),
		},
		function(data,status){
			$("#listmessage").html('Your callback url has been updated.');
			showListMessage();
			return false;
		});		

	});

	
	
	$('#updateAuto').click(function() {
		
		thresh = $('#thresh').val();
		refill_amount = $('#refill_amount').val();		
		$.post("/account/moderations/togglerefill.php",
		{	
			siteid: $('input#siteid').val(),
			thresh: thresh,
			refill_amount: refill_amount
		},
		function(data,status){
			$("#listmessage").html('Your auto refill settings have been updated.');
			showListMessage();
			return false;			
		});		
		return false;	
	});
	

	$('#cancel').click(function(){
		if (confirm('Clicking OK will cancel your license subscription.')) {
			$("#cancelmessage").html('Your subscription has been canceled.');
			showCancelMessage();
			$.post("/account/filter/cancel.php",
			{	
				siteid: $('input#siteid').val()
			},
			function(data,status){
					$("#cancel").html('Reactivate');
					$("#cancel").attr("href", "/account/shop/"+$('input#siteid').val());
					return false;			
			});		
			
		}
	});

	$('#accountOverlay').click(function() {
		$('#accountMenu').removeClass('open');
		$(this).hide();
	});		
	
	
	$( "#intConsole" ).submit(function( event ) {
			var dsval;
			var semailval;
			var sphoneval;
			var slinkval;
			var cdataval;
		
			var request_url = "/account/filter/demorequest.php";
			var display_url = "http://api1.webpurify.com/services/rest/";
			
		// build the request url
		var meth = $("#choosemethod").val();
		var lang = $("#lang").val();
		var rf = $("#format").val();	
		var request_args = 'api_key='+ $("#api_key").val()+'&method='+meth;
		
		if ($("#text").val()) {
			request_args = request_args + '&text='+encodeURIComponent($("#text").val());
		}
		if ($("#word").val()) {
			request_args = request_args + '&word='+encodeURIComponent($("#word").val());
		}
		if ($("#replacesymbol").val()) {
			request_args = request_args + '&replacesymbol='+$("#replacesymbol").val();
		}	
		if (lang) {
			request_args = request_args + '&lang='+lang;
		}
		if ($('#ds').is(':checked')) {	
			request_args = request_args + '&ds=1';
			dsval = 1;
		}	
		if ($('#semail').is(':checked')) {	
			request_args = request_args + '&semail=1';
			semailval = 1;
		}			
		if ($('#sphone').is(':checked')) {	
			request_args = request_args + '&sphone=1';
			sphoneval = 1;
		}	
		if ($('#slink').is(':checked')) {	
			request_args = request_args + '&slink=1';
			slinkval = 1;
		}	
		if ($('#cdata').is(':checked')) {	
			request_args = request_args + '&cdata=1';
			cdataval = 1;
		}	
		if (rf == "json") {
			request_args = request_args + '&format=json';
		}

		var final_url = request_url + "?" + request_args;	
		var final_disp = display_url + "?" + request_args;
	
		$("#result_url").val(final_disp); 
	
		
			$.ajax({
  			type: "GET",
  			url: request_url,
  			data: request_args,
  			dataType: 'html',
  			success: function(msg){
  			
  				if (format == "json") {
         			var obj = JSON.parse(msg);
        			$("#results").val(JSON.stringify(obj, null, 4));
        		} else {
        			$("#results").val(formatXml(msg));
    
        		}
  			}
		});	
		return false;	
	});
	
	if ( $.browser.msie ) {	
		$('.plan:nth-child(3n+3)').addClass('last');
	}
	
	
});

function showListMessage(){	
	$("#listmessage").slideDown().delay( 1200 ).slideUp();
}

function showCancelMessage(){
	$("#cancelmessage").slideDown().delay( 1200 ).slideUp();
}

function calculateImages(val,mtype){
		
		if (mtype == "Live") {
			cents = 2;
		} else {
			cents = .15;
		}
		
		var result = ((val*cents)/100).toFixed( 2 );
	
		//var aimresult = ((val*aim)/100).toFixed( 2 );
		$('#results').html('<p><strong>'+commaSeparateNumber(val)+'</strong> '+mtype+' Image Moderations for <strong>$'+commaSeparateNumber(result)+'</strong></p><a href="cart/'+result+'" class="btn buy">Buy</a>');
}


function calculateVideos(val){
		cents = 9;
		var result = (val*cents);
		$('#results').html('<p><strong>'+commaSeparateNumber(val)+'</strong> Hours of Video Moderation for <strong>$'+commaSeparateNumber(result)+'</strong></p><a href="cart/'+val+'" class="btn buy">Buy</a>');
}


function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}


/*
$(function () {
	$('.actions a').click(function () {

		var selected = $(this).data('tab');
		var plan = selected.substring(1);
		var active = $('#'+selected);
		var tabContainers = $('.tab');

		tabContainers.fadeOut();	
		
		$('#stats-'+plan).animate({'height' : active.outerHeight()}, 500, function(){
			active.fadeIn();
		});			
		
        $('.actions a').removeClass('selected');
        $(this).addClass('selected');
        
        return false;
    });
    
    $('.ion-close-circled').click(function(){
    	$('.actions a').removeClass('selected');
    	$('.tab').fadeOut();
    });
});
*/



$(function () {
    var tabs = $('.tab');
    
    $('.tabs a').click(function () {
        tabs.hide().filter(this.hash).show();
        
        $('.tabs a').removeClass('active');
        $(this).addClass('active');
        $('.actions').fadeOut();
        
        return false;
    });
});




/* ------- Deep Search Toggle and Select Word JS // Pulled from Current Site -------------------- */
	
function selectWord(list, field, id){	
	$('#'+list+' a').removeClass('selected');
	$('#'+field).val(id);
	$('#'+list+id).addClass('selected');
	$('#'+list+'-actions').fadeIn();
}


function config_change(type,site,state) {
	console.log(state);

	 $.post("/account/filter/toggleconfig.php",
	{	
		type: 	type,
		siteid: site,
		state: state
	},
	function(data,status){
		return false;
	});		
	return false;
}


function set_refill(site,state) {
	var thresh = 0;
	var refill_amount = 0;
	if (state == "on") {
		thresh = $('#thresh').val();
		refill_amount = $('#refill_amount').val();
	}
	 $.post("/account/moderations/togglerefill.php",
	 {	
		siteid: site,
		state: state,
		thresh: thresh,
		refill_amount: refill_amount
	 },
	function(data,status){
		if (state == "on") {
			$('#logic').slideDown();
			$("#listmessage").html('Auto refill has been activated.');
		} else {
			$('#logic').slideUp();
			$("#listmessage").html('Auto refill has been de-activated.');
		}
		//showListMessage();
		return false;	
	});		
	return false;
}


function set_vidrefill(site,state) {
	var thresh = 0;
	var refill_amount = 0;
	if (state == "on") {
		thresh = $('#thresh').val();
		refill_amount = $('#refill_amount').val();
	}
	 $.post("/account/videos/togglerefill.php",
	 {	
		siteid: site,
		state: state,
		thresh: thresh,
		refill_amount: refill_amount
	 },
	function(data,status){
		if (state == "on") {
			$('#logic').slideDown();
			$("#listmessage").html('Auto refill has been activated.');
		} else {
			$('#logic').slideUp();
			$("#listmessage").html('Auto refill has been de-activated.');
		}
		//showListMessage();
		return false;	
	});		
	return false;
}


function URLTest(s) {    
      var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return regexp.test(s);    
 }

// Card Accordian Functionality
function opencard() {
	$('#ccinfoblock').slideDown();
	$('#currentCard').slideUp();
}

function closecard() {
	$('#ccinfoblock').slideUp();
	$('#ccinfoblock input').val('');
	$('#currentCard').slideDown();
}


//Show Domains Functionality
function showDomains(id){
	$('#domains'+id).fadeIn();
}

function closeDomains(id){
	$('#domains'+id).fadeOut();
}


function formatXml(xml) {

	//alert(xml);

    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\n$2$3');
    
    
	var reg2 = /\n\s+/g;
	xml = xml.replace(reg2,'\n');
    
    
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });


    return formatted;
}


// Update Image Moderation Stats
function updateImageStats(id){
		var items = id.split("-");
		var request_args = "siteid="+items[0]+"&month="+items[1]+"&year="+items[2];
		$.ajax({
  			type: "GET",
  			url: '/scripts/statbydate.php',
  			data: request_args,
  			dataType: 'json',
  			success: function(msg){
         			var arr = $.map(msg, function(el) { return el; });         			
        			$("#percrej").html(arr[3]);
        			$("#imgtotal").html(arr[2]);   
        			$("#imgrejected").html(arr[1]);  
        			var displayDate = arr[4]+" "+arr[5];
        			$("#livedate").html(displayDate);   		
  			}
		});	
		closeAccountMenu();
}
	

function closeAccountMenu(){
	$('#accountMenu, #selectMonth').removeClass('open');
	$('#accountOverlay').hide();	
}


function set_pdna(siteid,state) {
	if (state == 'on') {
		$("#pdnalogic").fadeIn();
	} else if (state == 'off') {
		$("#pdnalogic").fadeOut();
		var request_args = "siteid="+siteid+"&state="+state;
		$.ajax({
			type: "GET",
			url: '/account/moderations/togglepdna.php',
			data: request_args,
			dataType: 'json',
			success: function(msg){ }
		});
	} 		
}


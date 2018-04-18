
$(document).ready(function(){
	// Infield Labels
	$(".infield label").inFieldLabels();

	// Masking
	//$("#phone").mask("(999) 999-9999");	
	$("#date").mask("99/9999");
	//$("#card").mask("9999 9999 9999 999");

	// Validate Trial Forms
	$("#signinForm").validate({
	    showErrors: function(errorMap, errorList) {
	        $("#signinForm").find("input").each(function() {
	            $(this).removeClass("error");
	        });
	        $("span.error").remove();
	        if(errorList.length) {
	            $(errorList[0]['element']).addClass("error").after('<span class="error">'+errorList[0]['message']+'</span>');
	        }
	    }
	});
			
	
	// Profanity Filter Check
	$( "#profanityCheck" ).submit(function() {
		$('#profanityResults').removeClass().html('').hide();
		checkProfanity();
		return false;			
	});
	
    // Image Moderation Check
	$( "#imageCheck" ).submit(function( event ) {
	
		var imgurl = $('#imgurl').val().trim();
		var results = $('#profanityResults');
		var justaim = $('#justaim').val();

		results.removeClass().html('').hide();

		if ( imgurl == ''){
			results.addClass('error').html('Please enter a valid image URL.').slideDown();
			return false;	
		} else {
			$( "#imageCheck .btn" ).addClass('disabled').prop('disabled', true);
			
			if (justaim == 1) {
				checkImageAIM(imgurl);	
			} else {
		    	checkImage(imgurl);
		    }
		}
		return false;			
	});
	
	$('#tryAgain').click(function(){
		$('#imageResults, #profanityPercentage').fadeOut();
		$('#imgurl').val("");
		$( "#imageCheck .btn" ).removeClass('disabled').prop('disabled', false)
		$('.checkProfanity').animate({height: '46px'}, 500, function() {
			$('#imageCheck').fadeIn();
			$('.checkProfanity').height('auto');
	 	});
	});	

	// Profanity Submissions Count
	if ($('#pcount').length) {	
		var i = 0;
		sumRequests = setInterval(function(){
			i++;	
			if (i > 14) { 
				clearInterval(sumRequests); 
			};
			$.ajax({
				type: "GET",
				url: "/scripts/get_pcount.php",
				contentType: "application/json",
				data: 'type=js',
				dataType: "json",
				success: function(data) {
					$('#pcount').html(data.count);
				},
				error: function(data) {
					//console.log(data);
				}
			});
		}, 2000);
	}
	
	// Monthly and Annual Billing
	$('.monthly').click(function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			$('.annual').removeClass('active');
			monthlyBilling();
		}
	});

	$('.annual').click(function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active');
			$('.monthly').removeClass('active');
			annualBilling();
		}
	});
	
	//Overlay Functionality
	$('.overlayBtn').click(function(e){
		e.preventDefault();
		var overlay = $(this).data('overlay');
		openOverlay(overlay);
	});


	$('#overlayBG, .close').click(function(){
		closeOverlay();
	});
	
	
	// Placeholder fix for IE	
	if ( $.browser.msie ) {
		$('[placeholder]').focus(function() {
		  var input = $(this);
		  if (input.val() == input.attr('placeholder')) {
		    input.val('');
		    input.removeClass('placeholder');
		  }
		}).blur(function() {
		  var input = $(this);
		  if (input.val() == '' || input.val() == input.attr('placeholder')) {
		    input.addClass('placeholder');
		    input.val(input.attr('placeholder'));
		  }
		}).blur();
	}
	
	// Mobile Touch Handler
	var ua = navigator.userAgent, 
	event = (ua.match(/iPad/i)) ? "touchstart" : "click",
	eventEnd = (ua.match(/iPad/i)) ? "touchend" : "click";

	// Menu
	$("#menu").bind(eventEnd, function() {
        $('html,body').animate({
          scrollTop: $('#footerNav').offset().top
        }, 1000);
		return false;
	});	
	
	
});

// Trim in IE
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

// Profanity Filter Check
// -------------------------------------------------------------------- //
function checkProfanity(){
	var textText = $('#profanitytext').val().trim();
	var results = $('#profanityResults');

	if( textText == ''){
		results.addClass('error').html('Please enter a string of text.').slideDown();
		return false;
	}
	
	$.ajax({
		type: "GET",
		url: "/scripts/wpcheck.php",
		contentType: "application/json",
		data: 'text='+textText,
		dataType: "json",
		success: function(data) {
			if (data.rsp.found == 1) {
				
				results.addClass('dirty').html('<strong>Profanity Detected</strong><a href="/trial/">Start my free 14-day trial!</a>').slideDown();
			} else {
				results.addClass('clean').html('<strong>Profanity Not Detected</strong><a href="/trial/">Start my free 14-day trial!</a>').slideDown();
			}
			$('#profanitytext').val("");
		},
		error: function(data) {
			//console.log(data);
		}
	});
}


// Image Moderation Check
// -------------------------------------------------------------------- //
function checkImage(imgurl){

	$.ajax({
		type: "GET",
		url: "/scripts/imgdemo.php",
		contentType: "application/json",
		data: 'imgurl='+encodeURIComponent(imgurl),
		dataType: "json",
		success: function(data) {
			if (data.failed) {
				var results = $('#profanityResults');
				results.addClass('error').html('Please enter a valid image URL.').slideDown();				
			} else if (data.done >= 5) { 
				var results = $('#profanityResults');
				results.addClass('error').html('Please sign up for a free trial to perform more tests.').slideDown();				
			} else if (data.rsp.imgid) {
				$('#imageAIMCheck').html(data.rsp.nudity);
				$('#imageCheck').fadeOut();
				var h = $('#imageProcessing').outerHeight() + $('#profanityPercentage').outerHeight() + 20;
				console.log(h);
				$('.checkProfanity').animate({height: h}, 500, function() {
	    			$('#imageProcessing, #profanityPercentage').fadeIn();
				});			
				getStatus(data.rsp.imgid);
			} else {
				//alert('problem with your image');
			}
		},
		error: function(data) {
			console.log(data);
		}
	});
	return true;
}	



// Image Moderation Check
// -------------------------------------------------------------------- //
function checkImageAIM(imgurl){

	$.ajax({
		type: "GET",
		url: "/scripts/imgdemo.php",
		contentType: "application/json",
		data: 'imgurl='+encodeURIComponent(imgurl)+'&justaim=1',
		dataType: "json",
		success: function(data) {
			if (data.failed) {
				var results = $('#profanityResults');
				results.addClass('error').html('Please enter a valid image URL.').slideDown();				
			} else if (data.done >= 5) { 
				var results = $('#profanityResults');
				results.addClass('error').html('Please sign up for a free trial to perform more tests.').slideDown();				
			} else if (data.rsp.nudity) {
				$('#imageAIMCheck').html(data.rsp.nudity);
				$('#imageCheck').hide();
				$('#profanityPercentage').fadeIn() 
				var h = $('#imageResults').innerHeight() + $('#profanityPercentage').outerHeight() + 20;
				$('.checkProfanity').animate({height: h}, 500, function() {
					$('#imageResults').fadeIn();
				});	
			} else {
				//alert('problem with your image');
			}
		},
		error: function(data) {
			console.log(data);
		}
	});
	return true;
}

	

function getStatus(imgid) {
	var getImageStatus = setInterval(function(){
		$.ajax({
	    	type: "GET",
			url: "/scripts/imgstatus.php",
			contentType: "application/json",
			data: 'imgid='+imgid,
			dataType: "json",
			success: function(data) {
				if (data.rsp.status) {
					if (data.rsp.status != "pending") {
						clearInterval(getImageStatus);
						//alert(data.rsp.status);
						imageResults(data.rsp.status);
					} 
				} else {
					//alert('problem with the status');
				}
			},
			error: function(data) {
	        	//console.log(data);
			}
		}) 
	},1000);		
}

function imageResults(status){
	var results = $('#imageStatus');

	if(status == 'approved'){
		results.removeClass('dirty');
		results.addClass('clean').html('This image was approved by our moderators!');
	} else {
		results.removeClass('clean');
		results.addClass('dirty').html('This image was rejected by our moderators!');
	}

	$('#imageProcessing').fadeOut();
	var h = $('#imageResults').innerHeight() + $('#profanityPercentage').outerHeight() + 20;
	$('.checkProfanity').animate({height: h}, 500, function() {
		$('#imageResults').fadeIn();
	});

}

function annualBilling(){
    $('html,body').animate({
      scrollTop: $('#pricingPlans').offset().top
    }, 600, function() {
		$('#pricingPlans h4 em').html('annually');
		$('h4.plugins strong').html('$50');
		$('h4.standard strong').html('$100');
		$('h4.enterprise strong').html('$500');
    });
}


function monthlyBilling(){
    $('html,body').animate({
      scrollTop: $('#pricingPlans').offset().top
    }, 600, function() {
		$('#pricingPlans h4 em').html('monthly');
		$('h4.plugins strong').html('$5');
		$('h4.standard strong').html('$15');
		$('h4.enterprise strong').html('$50');
    });
}


function openOverlay(overlay){
	$('#overlayBG, #'+overlay).fadeIn();
}

function closeOverlay(){
	$('#overlayBG, .overlay').fadeOut();
}




// Window Load
// -------------------------------------------------------------------- //

$(window).load(function(){
	$('body').removeClass('preload');
});
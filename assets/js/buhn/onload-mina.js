/* global console, alert, news_alert_count, resources_alert_count */
/* jshint unused: false */

function popupwindow(url, title, w, h) {
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);
	return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}



jQuery(function($) {

	//Equal height panels for each row on the our-network search grid
	//Equal height panels using .equal-height class (Note: .panel must have a .panel-body)
	function equalHeight(windowWidth) {

		//Do everything for the panels in each row
		$(".equal-height").each(function() {

			var $panels = $(this).find(".panel"), //Get just this row's panels
				rowData = [],
				rowHeight = [];

			//Reset all panels height to auto, before performing any calculations
			$panels.height("auto");

			//first loop, calculate heights of each item and assign items to rows
			$panels.each(function(i) {
				var row = (windowWidth <= 991) ? Math.floor(i/2) : Math.floor(i/3);
				rowData[i] = {
					'itemHeight': $(this).height(),
					'row': row
				};
			});

			//Loop 2, loop rowData and build rowHeight[]
			for(var i = 0;i<rowData.length;i++) {
				if( typeof rowHeight[rowData[i].row] === 'undefined' ) {
					rowHeight[rowData[i].row] = rowData[i].itemHeight;
				} else {
					if( rowData[i].itemHeight > rowHeight[rowData[i].row] ) {
						rowHeight[rowData[i].row] = rowData[i].itemHeight;
					}
				}
			}

			//Loop 3, loop $panels again setting height for each item based on our step 2 rowHeight
			$panels.each(function(i) {
				var panelHeight = rowHeight[ rowData[i].row ];
				$(this).height(panelHeight);
			});
		});


	}

	//Tooltips
	$('[data-toggle="tooltip"]').tooltip();

	//Responsive main menu
	$('#main-menu').smartmenus();

	//Admin menu in a sliding in panel
	$(".d7-tab-container").on("click", ".tab-toggle", function (e) {
		e.preventDefault();
		var d7 = $(this).closest(".d7-tab-container");
		if(d7.hasClass("open")) {
			d7.removeClass("open");
		} else {
			d7.addClass("open");
		}
	});

	//Twitter - share this article
	$(".share-this-article").on("click", function (e) {
		e.preventDefault();
		// Build twitter intent link
		var l = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent($(this).data('title')) + '. @ncdalliance&url=' + encodeURIComponent(window.location);
		// Load Twitter intent link in a central popup
		//window.open(l, "Share on Twitter", "width=600,height=460,resizable=no,toolbar=no,menubar=no,location=no,status=no");
		popupwindow(l, "Share on Twitter", 600, 443);
	});

	//Twitter - inject share intent buttons to blockquote.twitter
	$(".main-content .twitter").each(function () {
		var elem = $(this);
		var quote = elem.text().trim();
		console.log(quote);
		// Append @ncdalliance if it is not already included
		var append = (quote.indexOf("@ncdalliance") > -1) ? "" : " @ncdalliance";
		var l = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quote + append) + '&url=' + encodeURIComponent(window.location);
		var html = '<a class="btn btn-default btn-twitter" target="_blank" href="'+l+'"><i class="fa fa-twitter"></i> <span>Share</span></a>';
		elem.append(html);
	}).on("click", ".btn.twitter", function (e) {
		e.preventDefault();
		popupwindow($(this).attr("href"), "Share on Twitter", 600, 443);
	});

	//Auto submit news search filter form
	$(".views-exposed-form").on("change", ".form-select", function () {
		$(this).closest("form").submit();
	});


	//Newsletter modal subscribe button triggered from modal buttons
	$("#newsletterModal .btn-subscribe").on("click", function (e) {
		//Check if form is valid before closing modal
		if ($('#mc-embedded-subscribe-form').valid()) {
			$("#newsletterModal").modal("hide");
		}
	});

	//Update hidden actual form value and submit form
	$("select#sortorder").on("change", function () {
		var selected_option = $(this).val();
		if($(".page-resources").length>0) {
			// var form = $("#views-exposed-form-resources-resources-listing");
			var form = $(".page-resources #sidebar .view-filters>form");
			var sortField = form.find("#sort_order");
			//create sort field if not set
			if(sortField.length === 0) {
				form.prepend('<input name="sort-order" id="sort_order" value="date_d" style="display:none;" />');
				sortField = $("#sort_order");
			}
			sortField.val( $(this).val() ).closest("form").submit();
		}

		if($(".page-news-events").length>0) {
			var filter_form = $("#filter_news_events_form");
			var hidden_sort_by = filter_form.find("#hidden_sort_by");
			var hidden_sort_order = filter_form.find("#hidden_sort_order");

			if(typeof selected_option !== "undefined" && selected_option !== "") {
				if(selected_option === "title") {
					hidden_sort_by.val("title");
					hidden_sort_order.val("ASC");
				} else if(selected_option === "title_d") {
					hidden_sort_by.val("title");
					hidden_sort_order.val("DESC");
				} else if(selected_option === "date") {
					hidden_sort_by.val("created");
					hidden_sort_order.val("ASC");
				} else if(selected_option === "date_d") {
					hidden_sort_by.val("created");
					hidden_sort_order.val("DESC");
				}
				filter_form.submit();
			}
		}
	});

	//Filter by Tag: Update hidden actual form value and submit form
	$("select.filter-by-tag").on("change", function () {
		var selected_option = $(this).val();
		// if($(".page-resources").length>0) {
			// var form = $("#views-exposed-form-resources-resources-listing");
			var form = $("#sidebar .view-filters>form");
			var fieldTags = form.find("#field_site_tags");
			//create sort field if not set
		 	if(fieldTags.length === 0) {
				form.prepend('<input type="hidden" name="field_site_tags_tid" id="field_site_tags" value="'+selected_option+'"/>');
				fieldTags = $("#field_site_tags");
			 	}
			fieldTags.val( $(this).val() ).closest("form").submit();
			 // }
	});

	//Filter by Author: Update hidden actual form value and submit form
	$("select.filter-by-author").on("change", function () {
		var selected_option = $(this).val();
		// if($(".page-resources").length>0) {
			// var form = $("#views-exposed-form-resources-resources-listing");
			var form = $("#sidebar .view-filters>form");
			var authorTags = form.find("#field_resources_author");
			//create sort field if not set
			if(authorTags.length === 0) {
				form.prepend('<input type="hidden" name="field_resources_author_tid" id="field_resources_author" value="'+selected_option+'"/>');
				authorTags = $("#field_resources_author");
			}
			authorTags.val( $(this).val() ).closest("form").submit();
		// }
	});

	//Filter by Year: Update hidden actual form value and submit form
	$("select.filter-by-year").on("change", function () {
		var selected_option = $(this).val();
		// if($(".page-resources").length>0) {
			// var form = $("#views-exposed-form-resources-resources-listing");
			var form = $("#sidebar .view-filters>form");
			var fieldYear = form.find("#date_filter");
			//create sort field if not set
			if(fieldYear.length === 0) {
				form.prepend('<input type="hidden" name="date_filter[value][year]" id="date_filter" value="'+selected_option+'"/>');
				fieldYear = $("#date_filter");
			}
			fieldYear.val( $(this).val() ).closest("form").submit();
		// }
	});



	//Slide up blue panel title into view for feature images
	if($(".node-type-section, .node-type-page, .node-type-event, .node-type-news, .node-type-blog, .node-type-resources, .node-type-custom-section-listing").find(".slab").length > 0) {
		var originalSlabOffset = $(".slab").offset().top;
		//move slab into view if it is off the bottom of small screens
		$(window).on("scroll", function () {
			if($(".navbar-collapse").not(".collapsing, .in")) {
				var desiredOffset = 185; //the amount of the slab we want to appear in view
				var winHeight = $(window).height();
				var scrollTop = $(window).scrollTop();
				var slab = $(".slab");
				var caption = $(".image-credits");

				if(originalSlabOffset+desiredOffset>winHeight-scrollTop) {
					var calcOffset = (originalSlabOffset-winHeight+desiredOffset-scrollTop ) * -1;
					var calcCaptionOffset = (originalSlabOffset-winHeight+desiredOffset-scrollTop ) + 35;
					if(calcOffset<0) {
						slab.css("top", calcOffset).css("opacity", 0.95);
						caption.css("bottom", calcCaptionOffset);
					} else { 
						slab.css("top", 0).css("opacity", 1);
						caption.css("bottom", "35px");
					}
					//calcOffset = calcOffset<=0 ? calcOffset : 0;
					//console.log("Calculated offset: "+calcOffset);
					//slab.css("top", calcOffset).css("opacity", 0.5);
				}
			}
		}).scroll();
		//reset slab offset on resize
		$(window).on("resize", function () {
			if($(".navbar-collapse").not(".collapsing, .in")) {
				var slab = $(".slab");
				var caption = $(".image-credits");
				slab.addClass("notransition");
				slab.css("top", 0).css("opacity", 1);
				originalSlabOffset = slab.offset().top;
				slab.removeClass("notransition");
				caption.addClass("notransition");
				caption.css("bottom", "35px").css("opacity", 1);
				caption.removeClass("notransition");
				$(window).scroll();
			}
		}).resize();
	}

	//Equal height network panels (onload and 768+ only)
	$(window).on("resize", function() {
		var winWidth = $(window).width();
		if(winWidth < 768) {
			$(".equal-height .panel").height("auto");
		} else {
			equalHeight(winWidth);
		}
	}).resize();

	//Inject pocket and bookmark save buttons under tools
	$(function() {
        $("#bookmarkme").click(function(e) {
        	e.preventDefault();
            // Mozilla Firefox Bookmark
            if ('sidebar' in window && 'addPanel' in window.sidebar) { 
                window.sidebar.addPanel(location.href,document.title,"");
            } else if( /*@cc_on!@*/false) { // IE Favorite
                window.external.AddFavorite(location.href,document.title); 
            } else { // webkit - safari/chrome
                alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') !== - 1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
            }
        });
    });
	var save_html = '<span class="print_bookmark"><a href="#" title="Save bookmark." id="bookmarkme" class="print-bookmark" rel="nofollow"></a></span><span class="print_pocket"><a href="https://getpocket.com/save" data-save-url="'+window.location.href+'" title="Save to Google Pocket." class="print-pocket pocket-btn" rel="nofollow"></a></span>';
	$("#block-print-ui-print-links .content").append(save_html);


	$(window).on("resize", function () {
		//Homepage - equal height panels
		var maxHeight = 0;
		var panels = $("#block-views-news-events-latest-news-events .panel .inset");
		var winWidth = $(window).width();

		//reset
		panels.css("height", "auto");

		//only do over 768
		if(winWidth>=768) {
			//calc
			panels.each(function () {
				if($(this).height()>maxHeight) {
					maxHeight = $(this).height();
				}
			});
			//set
			panels.height(maxHeight);
		}

	}).resize();

	$(".selectpicker, .views-exposed-form .form-select").selectpicker();

	$(".main-content").fitVids();

	//Load youtube vids in modal
	$(".youtube-modal").on("click", function (e) {
		e.preventDefault();
		var ytid = $(this).data("ytid");
		var youtubeModal = $("#youtubeModal");
		var html = '<div class="video-responsive"><iframe width="560" height="315" src="https://www.youtube.com/embed/'+ytid+'" frameborder="0" allowfullscreen></iframe></div>';
		youtubeModal.find(".modal-body").html(html);
		youtubeModal.modal();
	});

	//Append filter criteria to news and events links
	$(".page-news-events-news, .page-news-events-blog").on("click", ".panel-navigation li a", function (e) {
		e.preventDefault();
		// Get href of clicked
		var href = $(this).attr("href");
		var txt = $(this).text();

		// append values from hidden sort fields
		var sort_by = $("#hidden_sort_by").val();
		var sort_order = $("#hidden_sort_order").val();
		var append = "";

		if(sort_by !== "undefined" && sort_order !== "undefined" && txt !== "Events" && txt !== "Global Forum") {
			append = "?sort_by="+sort_by+"&sort_order="+sort_order;
		}

		// Perform redirection with new link
		window.location.href = href+append;
	});

	$(".well-newsletter form").on("focus", ".form-control.email", function() {
		var collapse = $(this).closest("form").find(".collapse-fields");
		var container = $(this).closest(".well-newsletter");
		if(!collapse.isShown) {
			//collapse.slideDown(300);
			container.addClass("expanded");
		}
	})
		.on("click", ".close", function (e) {
			//e.preventDefault();
			$(this).closest(".well-newsletter").removeClass("expanded");
		})
		.on("click", ".btn-submit", function () {
			$(this).closest(".well-newsletter").removeClass("expanded");
			return true;
		});

	//Content colorbox galleries
	$(".content-gallery a").colorbox({rel:"gallery", maxWidth:"95%", maxHeight:"95%"});

	//Display content alert numbers in nav for news/events and resources
	/**
	 * TODO:
	 */
	var news_count = (typeof news_alert_count !== "undefined" && news_alert_count !== "") ? news_alert_count : 0;
	var resources_count = (typeof resources_alert_count !== "undefined" && resources_alert_count !== "") ? resources_alert_count : 0;
	var $news_li = $(".menu-mlid-6975>a:first-child");
	var $resources_li = $(".menu-mlid-6669>a:first-child");
	var html;
	if(news_count>0) {
		//Generate HTML for an overlay icon and append it to the news_li
		html = '<span class="new-count">'+news_count+' new</span>';
		$news_li.append(html);
	}
	if(resources_count>0) {
		//Generate HTML for an overlay icon and append it to the news_li
		html = '<span class="new-count">'+resources_count+' new</span>'; 
		$resources_li.append(html);
	}

	//Add popover to main content alerts pink tab
	var contentAlerts = $(".new-content-alert");
	contentAlerts.popover({
		html : true,
		placement: "bottom",
		container: "#banner",
		viewport: "#banner>.container",
		content: function() {
			var html = "";
			//DO AJAX
			$.ajax({
				method: "GET",
				url: "/json/new_content_alerts_list",
				async: false
			})
			.done(function( data ) {
				// console.log(data);
				if(typeof data !== "undefined" && data.length > 0) {
					var json = JSON.parse(data);
					if(typeof json !== "undefined" && json.length > 0) {
						html += '<div class="scroller">';
						for(var i = 0; i < json.length; i++) {
							html += '<div class="content-alert-row">';
							if(json[i].type === "resources") {
								//resource link
								html += '<a href="/resources">'+json[i].title+'</a>';
							} else {
								//news link
								html += '<a href="/node/'+json[i].nid+'">'+json[i].title+'</a>';
							}
							html += '<span class="content-type">'+json[i].type_name+'</span>';
							html += '<span class="created">'+json[i].created+'</span>';
							html += '</div>';
						}
						html += '</div>';
					}
				}
				return true;
			});

			return html;
		},
		title: "New Content"
	});
	contentAlerts.on("shown.bs.popover", function() {
		var topOffset = parseInt($("#banner .popover").css("top").replace("px", ""));
		$("#banner .popover .popover-content").css("max-height", ($(window).height()-65-topOffset)+"px");
	});

	$("body").on("submit", "form#search-block-form", function(e) {
		e.preventDefault();
		var language = '';
		if($('#lang-dropdown-select-language_content').length > 0){
			language = '/' + $('#lang-dropdown-select-language_content :selected').val();
			if (language== '/en') {
				language = '';
			}
		}
		else
		{
			language = '';
		}
		var $form = $(this);
		var keywords = $form.find("#search_q").val();
		if(keywords !== "") {
			keywords = keywords.replace(" ", "%20");
			window.location.href = language + "/search/node/"+keywords;
		}
	});

	//Cookie banner



	if ( Cookies.get('cookies_allow') != '1' ) {
		var language = '';
		language = $('#lang-dropdown-select-language_content :selected').val();

		if (language == 'fr') {
			var message = '<div id=\"cookie_accept\"><p><strong>Notification de cookie:</strong>  Ce site utilise des cookies pour améliorer votre expérience. En utilisant le site, vous consentez à notre utilisation des cookies.</p><div id="ca_buttons"><a href=\"/privacy-policy"\ class="ca_privacy" target=\"_blank"\>Lisez notre politique de confidentialité</a><a href="".$link."\" class=\"ca_btn\">Continuer</a></div>';
		} else if (language == 'es') {
			var message = '<div id=\"cookie_accept\"><p><strong>Aviso de cookies:</strong>  Este sitio web utiliza cookies para mejorar sus experiencia de usuario/a. Visitando el website usted da su consentimiento a nuestro uso de cookies.</p><div id="ca_buttons"><a href=\"/privacy-policy"\ class="ca_privacy" target=\"_blank"\>Lea nuestra política de privacidad</a><a href="".$link."\" class=\"ca_btn\">Continuar</a></div>';
		} else {
			var message = '<div id=\"cookie_accept\"><p><strong>Cookie Policy:</strong>  This website uses cookies to enhance your experience. By using the website, you consent to our use of cookies.</p><div id="ca_buttons"><a href=\"/privacy-policy"\ class="ca_privacy" target=\"_blank"\>Privacy Policy</a><a href="".$link."\" class=\"ca_btn\">Continue</a></div>';
		}

		$('body').append('' + message + '<a href=\"#\" class="ca_close"></a></div>');
		$('.ca_close, .ca_btn').click(function(e){
			$('#cookie_accept').remove();
			e.preventDefault();
		});
		$('#cookie_accept').css({'bottom':'-'+$(this).height()}).animate({
			bottom: '0'
		}, 2000);
		Cookies.set('cookies_allow', '1', { expires: 365 });
	}

});
// @codekit-append "networkmap.js"
// @codekit-append "conversationsmap.js"

/* global google */
/*jshint latedef: nofunc, loopfunc: true */

var networkMap;
function initNetworkMap(context) {
	/* jshint unused: false */
	var mapStyles = [
	{featureType: 'landscape.natural', elementType: 'all', stylers: [{color: "#ffffff"}]},
	{featureType: 'administrative', stylers: [{visibility: "off"}]},
	{featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ visibility: "on", color: "#1bafba" }]},
	{featureType: 'water', elementType: "labels", stylers: [{ "visibility": "off" }]},
	{featureType: 'water',  stylers: [{ "color": "#1bafba" }]},
	{featureType: 'road', stylers: [{ visibility: "off"}]},
	{featureType: 'poi', stylers: [{ visibility: "off"}]}
	];

	var mapConfig = {
		center: {lat: 25, lng: 0},
		styles: mapStyles,
		backgroundColor: "#1bafba",
		//draggable: false,
		scrollwheel: false,
		//panControl: false,
		//maxZoom: 4,
		minZoom: 2,
		zoom: 2,
		disableDefaultUI: false,
		//mapTypeId: google.maps.MapTypeId.ROADMAP,
		//zoomControl: true,
		mapTypeControl: false,
		//scaleControl: true,
		streetViewControl: false
		//rotateControl: true,
	};

	networkMap = new google.maps.Map(document.getElementById('network_map'), mapConfig);

	//findLocations(networkMap); //old method from data attribs
	jsonLocations(networkMap, context); //new method - view JSON
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};


function jsonLocations(map, context)
{
	//Get the continent (if set from section)
	var url = window.location.pathname;
	var segments = url.split("/");
	var continent = (typeof segments[4] !== "undefined" && segments[4] !== "") ? segments[4] : "";
	var json_url = "";

	if(typeof context !== "undefined" && context === "regional") {
		json_url = "/json/regional_network_markers";
	} else if(typeof context !== "undefined" && context === "cig") {
		json_url = "/json/cig_network_markers";
	}  else {
		json_url = "/json/our_network_markers/"+continent;
	}

	// Get the JSON via AJAX
	jQuery.ajax({
		method: "GET",
		//url: "/json/our-network", //OLD view
		url: json_url , //new custom db query output as JSON
		data: { //TODO: Remove this legacy param
			field_continent_value: getUrlParameter('field_continent_value')
		}
	}).done(function( data ) {
		data = JSON.parse(data);
		if(typeof data.nodes !== "undefined" && data.nodes.length>0) {
			setMarkers(map, data.nodes, context, continent);
		}
	});
}

function setMarkers(map, locations, context, continent) {
	//console.log("setMarkers(map, locations, "+context+", "+continent+")");
	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	// var image = {
	//   url: '/assets/images/templates/icon.png',
	//   // This marker is 20 pixels wide by 32 pixels tall.
	//   size: new google.maps.Size(30, 40),
	//   // The origin for this image is 0,0.
	//   origin: new google.maps.Point(0,0),
	//   // The anchor for this image is the base of the flagpole at 0,32.
	//   anchor: new google.maps.Point(0, 40)
	// };
	// Shapes define the clickable region of the icon.
	// The type defines an HTML &lt;area&gt; element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	// var shape = {
	//     coord: [1, 1, 1, 20, 18, 20, 18 , 1],
	//     type: 'poly'
	// };

	//var infowindow = new google.maps.InfoWindow({
	//	content: "loading..."
	//});
	var markers = [];
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow({
	    content: "<span>any html goes here</span>"
	});

	for (var i = 0; i < locations.length; i++) {

		var icon = "/sites/all/modules/optima_network_map/images/marker.png";

		if(locations[i].body === "National NCD alliance" || locations[i].body === "national") {
			icon = "/sites/all/modules/optima_network_map/images/marker-national.png";
		}
		if(locations[i].body === "Regional NCD alliance" || locations[i].body === "regional") {
			icon = "/sites/all/modules/optima_network_map/images/marker-regional.png";
		}

		markers[i] = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
			map: map,
			title: locations[i].title,
			icon: icon
		});

		bounds.extend(markers[i].getPosition());

		markers[i].addListener('click', function() {
			infowindow.setContent(this.title);
			infowindow.open(map, this);
		});
	}
	if(continent !== "" && context !== "regional" && context !== "cig") {
		map.fitBounds( bounds );
		map.setCenter( bounds.getCenter() );
		var listener = google.maps.event.addListener(map, "idle", function() {
			if (map.getZoom() < 3) {
				map.setZoom(3);
			}
			google.maps.event.removeListener(listener);
		});
	}
}



jQuery(function($) {
	$("#network_map").each(function() {

		initNetworkMap($(this).data("context"));

		$("#continent").on("change", function () {
			var continent = $(this).val();
			window.location.href = "/who-we-are/the-ncd-alliance-network/federation-member-associations/"+continent;
		});
	});


	$(".jump-to-country").on("change", "select", function () {
		var selected_country = $(this).val();
		$('html, body').animate({
			scrollTop: $("#"+selected_country).offset().top
		}, 800);
	});

	$(".back-to-top").on("click", function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $("#top").offset().top
		}, 800);
	});

});



/* global google */
/*jshint latedef: nofunc, loopfunc: true */

var networkMap;
function initConversationsMap(context) {
	/* jshint unused: false */
	var mapStyles = [
	{featureType: 'landscape.natural', elementType: 'all', stylers: [{color: "#ffffff"}]},
	{featureType: 'administrative', stylers: [{visibility: "off"}]},
	{featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ visibility: "on", color: "#1bafba" }]},
	{featureType: 'water', elementType: "labels", stylers: [{ "visibility": "off" }]},
	{featureType: 'water',  stylers: [{ "color": "#1bafba" }]},
	{featureType: 'road', stylers: [{ visibility: "off"}]},
	{featureType: 'poi', stylers: [{ visibility: "off"}]}
	];

	var mapConfig = {
		center: {lat: 25, lng: 0},
		styles: mapStyles,
		backgroundColor: "#1bafba",
		//draggable: false,
		scrollwheel: false,
		//panControl: false,
		//maxZoom: 4,
		minZoom: 1,
		zoom: 2,
		disableDefaultUI: false,
		//mapTypeId: google.maps.MapTypeId.ROADMAP,
		//zoomControl: true,
		mapTypeControl: false,
		//scaleControl: true,
		streetViewControl: false
		//rotateControl: true,
	};

	networkMap = new google.maps.Map(document.getElementById('conversations_map'), mapConfig);

	//findLocations(networkMap); //old method from data attribs
	jsonConversationLocations(networkMap, context); //new method - view JSON
}

function jsonConversationLocations(map)
{
	var json_url = "/json/community_conversations_markers";

	// Get the JSON via AJAX
	jQuery.ajax({
		method: "GET",
		//url: "/json/our-network", //OLD view
		url: json_url //new custom db query output as JSON
	}).done(function( data ) {
		data = JSON.parse(data);
		if(typeof data.nodes !== "undefined" && data.nodes.length>0) {
			setConversationMarkers(map, data.nodes);
		}
	});
}

function setConversationMarkers(map, locations) {
	//console.log("setMarkers(map, locations)");
	// Add markers to the map

	// Marker sizes are expressed as a Size of X,Y
	// where the origin of the image (0,0) is located
	// in the top left of the image.

	// Origins, anchor positions and coordinates of the marker
	// increase in the X direction to the right and in
	// the Y direction down.
	// var image = {
	//   url: '/assets/images/templates/icon.png',
	//   // This marker is 20 pixels wide by 32 pixels tall.
	//   size: new google.maps.Size(30, 40),
	//   // The origin for this image is 0,0.
	//   origin: new google.maps.Point(0,0),
	//   // The anchor for this image is the base of the flagpole at 0,32.
	//   anchor: new google.maps.Point(0, 40)
	// };
	// Shapes define the clickable region of the icon.
	// The type defines an HTML &lt;area&gt; element 'poly' which
	// traces out a polygon as a series of X,Y points. The final
	// coordinate closes the poly by connecting to the first
	// coordinate.
	// var shape = {
	//     coord: [1, 1, 1, 20, 18, 20, 18 , 1],
	//     type: 'poly'
	// };

	//var infowindow = new google.maps.InfoWindow({
	//	content: "loading..."
	//});
	var markers = [];
	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow({
	    content: "<span>any html goes here</span>"
	});

	for (var i = 0; i < locations.length; i++) {

		var icon = "/sites/all/modules/optima_conversations_map/images/marker.png";

		markers[i] = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
			map: map,
			title: locations[i].title,
			date: locations[i].cdate,
			organiser: locations[i].organiser,
			summary: locations[i].summary,
			body: locations[i].body,
			image: locations[i].image,
			alias: locations[i].alias,
			icon: icon
		});

		bounds.extend(markers[i].getPosition());

		markers[i].addListener('click', function() {
			var html = ''
			if(this.image) {
				var img = this.image;
				var img_thumb = img.replace("sites/default/files", "sites/default/files/imagefield_thumbs");
				html += '<img src="/'+img_thumb+'" alt="">';
			}
			html += '<h3>'+this.title+'</h3>';
			html += '<p><strong>Date:</strong> '+this.date+'</p>';
			if(this.organiser) html += '<p><strong>Organiser:</strong> '+this.organiser+'</p>';
			if(this.summary) html += this.summary;
			if(this.body) {
				html += '<p><a href="/'+this.alias+'">Read more</a> &nbsp;|&nbsp; <a href="https://twitter.com/intent/tweet?text=Join%20the%20conversation%20on%20%23NCDs%20%23NCDvoices%20%40ncdalliance&url=https%3A%2F%2Fncdalliance.org%2Fwhat-we-do%2Fcapacity-development%2Four-views-our-voices%2Fadvocacy-agenda%2Fcommunity-conversations" target="_blank"><i class="fa fa-twitter"></i> Tweet this</a></p>';
			} else {
				html += '<p><a href="https://twitter.com/intent/tweet?text=Join%20the%20conversation%20on%20%23NCDs%20%23NCDvoices%20%40ncdalliance&url=https%3A%2F%2Fncdalliance.org%2Fwhat-we-do%2Fcapacity-development%2Four-views-our-voices%2Fadvocacy-agenda%2Fcommunity-conversations" target="_blank"><i class="fa fa-twitter"></i> Tweet this</a></p>';
			}
			infowindow.setContent(html);
			infowindow.open(map, this);
		});
	}
	// map.fitBounds( bounds );
	// map.setCenter( bounds.getCenter() );
	// var listener = google.maps.event.addListener(map, "idle", function() {
	// 	if (map.getZoom() < 3) {
	// 		map.setZoom(3);
	// 	}
	// 	google.maps.event.removeListener(listener);
	// });
}



jQuery(function($) {
	$("#conversations_map").each(function() {
		initConversationsMap();
	});
});


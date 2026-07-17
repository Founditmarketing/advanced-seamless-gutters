jQuery(document).ready(function ($) {
	$(".entry-title").each(function () {
		$(this).parent('article').find(".post-meta").after(this);

	});

});

(function ($) {
	$(document).ready(function () {
		$(document).bind('ready ajaxComplete', function () {
			$(".pa-hover-gallery .et_pb_gallery_item").each(function () {
				$(this).find(".et_pb_gallery_title, .et_pb_gallery_caption").wrapAll('<div class="pa-gallery-text"></div>');
			});
		});
	});
})(jQuery);

jQuery(function ($) {
	$('.et_pb_toggle_title').click(function () {
		var $toggle = $(this).closest('.et_pb_toggle');
		if (!$toggle.hasClass('et_pb_accordion_toggling')) {
			var $accordion = $toggle.closest('.et_pb_accordion');
			if ($toggle.hasClass('et_pb_toggle_open')) {
				$accordion.addClass('et_pb_accordion_toggling');
				$toggle.find('.et_pb_toggle_content').slideToggle(700, function () {
					$toggle.removeClass('et_pb_toggle_open').addClass('et_pb_toggle_close');

				});
			}
			setTimeout(function () {
				$accordion.removeClass('et_pb_accordion_toggling');
			}, 750);
		}
	});
});

jQuery(function ($) {
	$('.et_pb_accordion .et_pb_toggle_open').addClass('et_pb_toggle_close').removeClass('et_pb_toggle_open');

	$('.et_pb_accordion .et_pb_toggle').click(function () {
		$this = $(this);
		setTimeout(function () {
			$this.closest('.et_pb_accordion').removeClass('et_pb_accordion_toggling');
		}, 700);
	});
});

(function ($) {
	function setup_collapsible_submenus() {
		// mobile menu
		$('.et_mobile_nav_menu .menu-item-has-children > a').after('<span class="menu-closed"></span>');
		$('.et_mobile_nav_menu .menu-item-has-children > a').each(function () {
			$(this).next().next('.sub-menu').toggleClass('hide', 1000);
		});
		$('.et_mobile_nav_menu .menu-item-has-children > a + span').on('click', function (event) {
			event.preventDefault();
			$(this).toggleClass('menu-open');
			$(this).next('.sub-menu').toggleClass('hide', 1000);
		});
	}
	$(window).load(function () {
		setTimeout(function () {
			setup_collapsible_submenus();
		}, 700);
	});
})(jQuery);
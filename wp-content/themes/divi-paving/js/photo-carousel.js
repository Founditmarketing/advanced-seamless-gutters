/* Custom lightweight photo carousel — replaces the broken migrated Divi gallery slider.
   Only two <img> elements ever exist in the DOM per instance, so it stays fast even
   with a few hundred photos in one gallery. */
(function () {
	"use strict";

	function initCarousel(root) {
		var images;
		try {
			images = JSON.parse(root.getAttribute("data-images"));
		} catch (e) {
			return;
		}
		if (!images || !images.length) return;

		var track = root.querySelector(".aci-track");
		var counter = root.querySelector(".aci-counter");
		var dotsWrap = root.querySelector(".aci-dots");
		var prevBtn = root.querySelector(".aci-prev");
		var nextBtn = root.querySelector(".aci-next");
		var loading = root.querySelector(".aci-loading");

		var total = images.length;
		var index = 0;
		var animating = false;
		var autoplayMs = 4500;
		var autoplayTimer = null;
		var maxDots = 12;

		var slideA = document.createElement("img");
		var slideB = document.createElement("img");
		[slideA, slideB].forEach(function (img) {
			img.className = "aci-slide";
			img.loading = "eager";
			img.decoding = "async";
			img.alt = "Project photo";
		});
		track.appendChild(slideA);
		track.appendChild(slideB);
		var current = slideA;

		function preload(src, cb) {
			var im = new Image();
			im.onload = im.onerror = function () {
				cb();
			};
			im.src = src;
		}

		function showLoading(v) {
			if (loading) loading.style.display = v ? "flex" : "none";
		}

		showLoading(true);
		preload(images[0], function () {
			current.src = images[0];
			showLoading(false);
			updateUI();
		});

		function updateUI() {
			if (counter) counter.textContent = (index + 1) + " / " + total;
			if (dotsWrap) {
				var dots = dotsWrap.querySelectorAll(".aci-dot");
				dots.forEach(function (d, i) {
					d.classList.toggle("aci-dot-active", i === (index % maxDots));
				});
			}
		}

		function goTo(newIndex, dir) {
			if (animating || total < 2) return;
			newIndex = ((newIndex % total) + total) % total;
			if (newIndex === index) return;
			animating = true;

			var incoming = current === slideA ? slideB : slideA;
			var outgoing = current;

			showLoading(true);
			preload(images[newIndex], function () {
				showLoading(false);
				incoming.src = images[newIndex];
				incoming.style.transition = "none";
				incoming.style.transform = "translateX(" + (dir > 0 ? "100%" : "-100%") + ")";
				incoming.classList.remove("aci-anim");
				// force reflow so the browser registers the start position
				void incoming.offsetWidth;

				incoming.classList.add("aci-anim");
				outgoing.classList.add("aci-anim");
				incoming.style.transform = "translateX(0)";
				outgoing.style.transform = "translateX(" + (dir > 0 ? "-100%" : "100%") + ")";

				var done = false;
				function finish() {
					if (done) return;
					done = true;
					outgoing.classList.remove("aci-anim");
					outgoing.style.transition = "none";
					outgoing.style.transform = "translateX(100%)";
					current = incoming;
					index = newIndex;
					animating = false;
					updateUI();
				}
				incoming.addEventListener("transitionend", finish, { once: true });
				setTimeout(finish, 600); // safety net in case transitionend doesn't fire
			});
		}

		function next() {
			goTo(index + 1, 1);
		}
		function prev() {
			goTo(index - 1, -1);
		}

		function stopAutoplay() {
			if (autoplayTimer) {
				clearInterval(autoplayTimer);
				autoplayTimer = null;
			}
		}
		function startAutoplay() {
			if (total < 2) return;
			stopAutoplay();
			autoplayTimer = setInterval(next, autoplayMs);
		}

		if (prevBtn) prevBtn.addEventListener("click", function () { stopAutoplay(); prev(); });
		if (nextBtn) nextBtn.addEventListener("click", function () { stopAutoplay(); next(); });

		if (dotsWrap) {
			var dotCount = Math.min(total, maxDots);
			for (var i = 0; i < dotCount; i++) {
				var dot = document.createElement("button");
				dot.type = "button";
				dot.className = "aci-dot";
				dot.setAttribute("aria-label", "Go to photo " + (i + 1));
				(function (target) {
					dot.addEventListener("click", function () {
						stopAutoplay();
						goTo(target, target > index ? 1 : -1);
					});
				})(i);
				dotsWrap.appendChild(dot);
			}
		}

		root.setAttribute("tabindex", "0");
		root.addEventListener("keydown", function (e) {
			if (e.key === "ArrowRight") { stopAutoplay(); next(); }
			if (e.key === "ArrowLeft") { stopAutoplay(); prev(); }
		});

		var touchStartX = null;
		root.addEventListener("touchstart", function (e) {
			touchStartX = e.touches[0].clientX;
		}, { passive: true });
		root.addEventListener("touchend", function (e) {
			if (touchStartX === null) return;
			var dx = e.changedTouches[0].clientX - touchStartX;
			touchStartX = null;
			if (Math.abs(dx) < 30) return;
			stopAutoplay();
			if (dx < 0) next();
			else prev();
		});

		root.addEventListener("mouseenter", stopAutoplay);
		root.addEventListener("mouseleave", startAutoplay);

		startAutoplay();
	}

	function init() {
		var carousels = document.querySelectorAll(".aci-carousel[data-images]");
		carousels.forEach(initCarousel);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

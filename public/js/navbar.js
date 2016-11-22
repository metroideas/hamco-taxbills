(function() {
  var siteMenuToggle = document.getElementById('site-menu-toggle');

  siteMenuToggle.addEventListener('click', function(e) {
    var body = document.querySelector('body');
    var siteMenu = document.getElementById('site-menu');

    if (siteMenuToggle.getAttribute('aria-expanded') == 'false') {
      body.setAttribute('data-scroll-disabled', 'true');
      siteMenuToggle.setAttribute('aria-expanded', 'true');
      siteMenu.setAttribute('aria-hidden', 'false');
    } else {
      body.setAttribute('data-scroll-disabled', 'false');
      siteMenuToggle.setAttribute('aria-expanded', 'false');
      siteMenu.setAttribute('aria-hidden', 'true');
    }
  });
})();
/**
 * ClientRenderer
 */
(function () {
    'use strict';

    var ClientRenderer = {
        renderLogos: function(containerId) {
            var c = document.getElementById(containerId);
            if (!c || !window.ClientRepository) return;
            
            var clients = window.ClientRepository.getAll();
            if (!clients || clients.length === 0) return;
            
            var html = '';
            
            if (containerId === 'marqueeWrap') {
                // Render as marquee track with duplicated logos for seamless loop
                html += '<div class="marquee-track flex items-center gap-12 py-4">';
                
                for (var s = 0; s < 2; s++) {
                    for (var i = 0; i < clients.length; i++) {
                        var client = clients[i];
                        html += '<div class="logo-item flex-shrink-0 px-6">';
                        html += '<img src="' + client.logo + '" alt="' + client.name + '" class="h-8 md:h-10 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition duration-300" loading="lazy">';
                        html += '</div>';
                    }
                }
                
                html += '</div>';
                c.innerHTML = html;
                
                var track = c.querySelector('.marquee-track');
                if (track) {
                    var duration = Math.max(clients.length * 4, 15);
                    track.style.animationDuration = duration + 's';
                    requestAnimationFrame(function() {
                        track.classList.add('is-ready');
                    });
                }
            } else {
                for (var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    html += '<img src="' + client.logo + '" alt="' + client.name + '" class="h-8 md:h-10 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition duration-300" loading="lazy">';
                }
                c.innerHTML = html;
            }
        },

        init: function() {
            var containers = document.querySelectorAll('[data-renderer="client-logos"]');
            for(var i=0; i<containers.length; i++) {
                if(containers[i].id) {
                    this.renderLogos(containers[i].id);
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { ClientRenderer.init(); });
    } else {
        ClientRenderer.init();
    }
    
    window.ClientRenderer = ClientRenderer;
})();

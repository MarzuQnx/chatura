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
            var html = '';
            
            for (var i = 0; i < clients.length; i++) {
                var client = clients[i];
                html += '<img src="' + client.logo + '" alt="' + client.name + '" class="h-8 md:h-10 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition duration-300">';
            }
            
            c.innerHTML = html;
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

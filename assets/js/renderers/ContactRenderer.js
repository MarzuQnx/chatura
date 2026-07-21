/**
 * ContactRenderer - Renders contact forms and binds interactivity
 */
(function () {
    'use strict';

    var ContactRenderer = {
        bindEvents: function() {
            // WhatsApp Business API Dynamic Router
            var waForm = document.getElementById('contact-form');
            if (waForm && !waForm.dataset.listenerBound) {
                waForm.dataset.listenerBound = 'true';
                waForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                    var name = document.getElementById('form-name').value;
                    var email = document.getElementById('form-email').value;
                    var title = document.getElementById('form-title').value || 'Not Specified';
                    var company = document.getElementById('form-company').value || 'Not Specified';
                    var service = document.getElementById('form-service').value;
                    var location = document.getElementById('form-location').value;
                    var referral = document.getElementById('form-referral').value || 'Not Specified';
                    var message = document.getElementById('form-message').value;

                    // Structured text block blueprint formatting
                    var textBlock = "*CHAtURA BUSINESS ADVISORY INQUIRY FORM*" + "\n" +
                                    "----------------------------------------" + "\n" +
                                    "• *Client Name:* " + name + "\n" +
                                    "• *Business Email:* " + email + "\n" +
                                    "• *Job Position:* " + title + "\n" +
                                    "• *Enterprise Entity:* " + company + "\n" +
                                    "• *Practice Track:* " + service + "\n" +
                                    "• *Target Desk:* " + location + "\n" +
                                    "• *Referral Source:* " + referral + "\n" +
                                    "----------------------------------------" + "\n" +
                                    "*Core Strategic Challenge Dossier:*" + "\n" + message;

                    var encodedText = encodeURIComponent(textBlock);
                    
                    // Redirect directly to the targeted secure corporate WhatsApp endpoint API
                    var targetWAEndpoint = "https://wa.me/622112345678?text=" + encodedText;
                    window.open(targetWAEndpoint, '_blank');
                });
            }

            // FAQ Interactive Accordion Control Loop (for contact page)
            document.querySelectorAll('.faq-accordion-item').forEach(function(item) {
                if (!item.dataset.listenerBound) {
                    item.dataset.listenerBound = 'true';
                    item.addEventListener('click', function() {
                        var isCurrentActive = item.classList.contains('active');
                        document.querySelectorAll('.faq-accordion-item').forEach(function(el) { el.classList.remove('active'); });
                        if (!isCurrentActive) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        },

        init: function() {
            this.bindEvents();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { ContactRenderer.init(); });
    } else {
        ContactRenderer.init();
    }

    window.ContactRenderer = ContactRenderer;
})();

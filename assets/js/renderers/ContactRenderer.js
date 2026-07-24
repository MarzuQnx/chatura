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
                    var t = function (key) {
                        var d = window.TranslationRepository ? window.TranslationRepository.getAllTranslations() : {};
                        return d[key] || key;
                    };
                    var notSpecified = t('contact.not_specified');
                    var title = document.getElementById('form-title').value || notSpecified;
                    var company = document.getElementById('form-company').value || notSpecified;
                    var service = document.getElementById('form-service').value;
                    var location = document.getElementById('form-location').value;
                    var referral = document.getElementById('form-referral').value || notSpecified;
                    var message = document.getElementById('form-message').value;

                    // Structured text block blueprint formatting
                    var textBlock = "*" + t('contact.wa_header') + "*" + "\n" +
                                    "----------------------------------------" + "\n" +
                                    "• *" + t('contact.wa_client_name') + ":* " + name + "\n" +
                                    "• *" + t('contact.wa_email') + ":* " + email + "\n" +
                                    "• *" + t('contact.wa_position') + ":* " + title + "\n" +
                                    "• *" + t('contact.wa_company') + ":* " + company + "\n" +
                                    "• *" + t('contact.wa_track') + ":* " + service + "\n" +
                                    "• *" + t('contact.wa_desk') + ":* " + location + "\n" +
                                    "• *" + t('contact.wa_referral') + ":* " + referral + "\n" +
                                    "----------------------------------------" + "\n" +
                                    "*" + t('contact.wa_challenge') + ":*" + "\n" + message;

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

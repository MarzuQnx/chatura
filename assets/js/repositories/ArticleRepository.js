/**
 * ArticleRepository — Article/Insight business data
 * Wraps window.CHATURA.ARTICLES with Repository pattern
 */
(function () {
  'use strict';

  var repo = new Repository('articles');

  function init() {
    if (window.CHATURA && window.CHATURA.ARTICLES) {
      repo._data = window.CHATURA.ARTICLES;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  repo.getBySlug = function (slug) {
    return this.findOne(function (a) { return a.slug === slug; });
  };

  repo.getFeatured = function () {
    return this.findOne(function (a) { return a.featured; }) || (this._data && this._data[0]) || null;
  };

  repo.getByCategory = function (category) {
    return this.find(function (a) { return a.category === category; });
  };

  repo.getRelated = function (article, limit) {
    limit = limit || 4;
    if (!this._data || !article) return [];
    var currentSlug = article.slug;
    var candidates = [];
    for (var i = 0; i < this._data.length; i++) {
      var a = this._data[i];
      if (a.slug === currentSlug) continue;
      var score = 0;
      if (a.category === article.category) score += 3;
      if (article.relatedServices && a.relatedServices) {
        for (var s = 0; s < article.relatedServices.length; s++) {
          if (a.relatedServices.indexOf(article.relatedServices[s]) > -1) score += 2;
        }
      }
      if (score > 0) candidates.push({ article: a, score: score });
    }
    candidates.sort(function (a, b) { return b.score - a.score; });
    return candidates.slice(0, limit).map(function (c) { return c.article; });
  };

  repo.search = function (query) {
    var q = query.toLowerCase();
    return this.find(function (a) {
      var title = ((a.title && a.title.en) || '').toLowerCase();
      var desc = ((a.description && a.description.en) || '').toLowerCase();
      var tags = (a.tags || []).join(' ').toLowerCase();
      return title.indexOf(q) > -1 || desc.indexOf(q) > -1 || tags.indexOf(q) > -1;
    });
  };

  window.ArticleRepository = repo;
})();

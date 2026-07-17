/* ============================================================
   Aryan Bhavsar — portfolio scripts (multi-page, config-driven)
   Single source of truth: config.json (links, identity, about)
   Data: education.json, experience.json, blog.json,
         publications.json, projects.json
   ============================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "ab-theme";

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function isSafeUrl(u) {
    return (
      typeof u === "string" &&
      /^(https?:|mailto:|\.?\/|#|[\w./-]+\.(html|pdf))/i.test(u.trim())
    );
  }
  function extIcon() {
    return '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function loadJSON(url) {
    return fetch(url, { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        return r.json();
      })
      .catch(function () {
        return null;
      });
  }

  /* ---------- apply config (links, identity, about) ---------- */
  function applyConfig(config) {
    config = config || {};
    var links = config.links || {};
    var about = config.about || {};

    // remove optional wrappers whose link is missing (e.g. secondary email)
    document.querySelectorAll("[data-optional]").forEach(function (el) {
      var k = el.getAttribute("data-optional");
      if (!links[k]) el.remove();
    });

    // resolve link targets; drop elements whose link is empty
    document.querySelectorAll("[data-link]").forEach(function (el) {
      var k = el.getAttribute("data-link");
      var v = links[k];
      if (!v) {
        el.remove();
        return;
      }
      if (k === "email" || k === "emailSecondary") {
        el.setAttribute("href", "mailto:" + v);
      } else {
        el.setAttribute("href", v);
        if (!el.hasAttribute("target")) {
          el.setAttribute("target", "_blank");
          el.setAttribute("rel", "noopener");
        }
      }
    });

    // top-level text fields (name, role, affiliation) + email text
    document.querySelectorAll("[data-text]").forEach(function (el) {
      var k = el.getAttribute("data-text");
      var v = k === "email" || k === "emailSecondary" ? links[k] : config[k];
      if (v) el.textContent = v;
    });

    // hero kicker = role · institute
    var kicker = document.getElementById("hero-kicker");
    if (kicker) {
      var s = config.role || "";
      if (config.institute) s += (s ? " · " : "") + config.institute;
      if (s) kicker.textContent = s;
    }

    // about tagline (inline HTML allowed — it's your own config)
    var tagline = document.getElementById("about-tagline");
    if (tagline && about.tagline) tagline.innerHTML = about.tagline;

    // about description: string or array of paragraphs (inline HTML allowed)
    var desc = document.getElementById("about-description");
    if (desc && about.description) {
      var d = about.description;
      desc.innerHTML = Array.isArray(d)
        ? d
            .map(function (p) {
              return "<p>" + p + "</p>";
            })
            .join("")
        : "<p>" + d + "</p>";
    }

    // about tags
    var tags = document.getElementById("about-tags");
    if (tags && Array.isArray(about.tags)) {
      tags.innerHTML = about.tags
        .map(function (t) {
          return "<li>" + esc(t) + "</li>";
        })
        .join("");
    }
  }

  /* ---------- theme ---------- */
  function initTheme() {
    var toggle = document.getElementById("themeToggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
      });
    }
    if (window.matchMedia) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", function (e) {
          var stored = null;
          try {
            stored = localStorage.getItem(STORAGE_KEY);
          } catch (err) {}
          if (!stored)
            root.setAttribute("data-theme", e.matches ? "dark" : "light");
        });
    }
  }

  /* ---------- nav (mobile + active state) ---------- */
  function initNav() {
    var menuBtn = document.getElementById("menuBtn");
    var nav = document.getElementById("nav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
    var page = (
      location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();
    if (page === "") page = "index.html";
    document.querySelectorAll(".nav a[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page").toLowerCase() === page) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  function setYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- education / experience ---------- */
  function timelineItem(e) {
    return (
      "<li>" +
      '<span class="tl-date">' +
      esc(e.period) +
      "</span>" +
      '<span class="tl-title">' +
      esc(e.title) +
      "</span>" +
      (e.org ? '<span class="tl-org">' + esc(e.org) + "</span>" : "") +
      (e.note ? '<span class="tl-note">' + esc(e.note) + "</span>" : "") +
      "</li>"
    );
  }
  function renderTimeline(hostId, url) {
    var host = document.getElementById(hostId);
    if (!host) return;
    loadJSON(url).then(function (list) {
      if (!Array.isArray(list) || list.length === 0) {
        host.innerHTML = "";
        return;
      }
      host.innerHTML = list.map(timelineItem).join("");
    });
  }

  /* ---------- blog (about page) ---------- */
  function renderBlog() {
    var section = document.getElementById("blog-section");
    var host = document.getElementById("blog-list");
    if (!section || !host) return;
    loadJSON("blog.json").then(function (posts) {
      if (!Array.isArray(posts) || posts.length === 0) return; // stay hidden
      var html = posts
        .map(function (p) {
          if (!p || !p.title || !isSafeUrl(p.url)) return "";
          return (
            '<article class="post">' +
            (p.date
              ? '<span class="post-date">' + esc(p.date) + "</span>"
              : "") +
            '<a class="post-title" href="' +
            esc(p.url) +
            '" target="_blank" rel="noopener">' +
            esc(p.title) +
            " " +
            extIcon() +
            "</a>" +
            (p.excerpt
              ? '<p class="post-excerpt">' + esc(p.excerpt) + "</p>"
              : "") +
            "</article>"
          );
        })
        .join("");
      if (!html) return;
      host.innerHTML = html;
      section.hidden = false;
    });
  }

  /* ---------- publications ---------- */
  var PUB_LINKS = [
    ["pdf", "PDF"],
    ["doi", "DOI"],
    ["arxiv", "arXiv"],
    ["code", "Code"],
    ["slides", "Slides"],
    ["video", "Video"],
    ["url", "Link"],
  ];
  var TYPE_LABEL = {
    journal: "Journal",
    conference: "Conference",
    workshop: "Workshop",
    preprint: "Preprint",
    thesis: "Thesis",
    poster: "Poster",
  };
  function highlightMe(authors) {
    return esc(authors).replace(
      /(A(?:ryan)?\.?\s*(?:A\.?\s*)?Bhavsar)/gi,
      '<span class="me">$1</span>',
    );
  }
  function renderPublications() {
    var host = document.getElementById("pub-list");
    if (!host) return;
    loadJSON("publications.json").then(function (list) {
      if (!Array.isArray(list) || list.length === 0) {
        host.innerHTML =
          '<p class="empty">No publications listed yet. Add entries to <code>publications.json</code> and they will appear here, newest first.</p>';
        return;
      }
      var byYear = {};
      list.forEach(function (p) {
        var yr = p.year || "—";
        (byYear[yr] = byYear[yr] || []).push(p);
      });
      var years = Object.keys(byYear).sort(function (a, b) {
        return (b === "—" ? -1 : b) - (a === "—" ? -1 : a);
      });
      var html = "";
      years.forEach(function (yr) {
        html += '<div class="pub-year">' + esc(yr) + "</div>";
        byYear[yr].forEach(function (p) {
          var links = "";
          var pl = p.links || {};
          PUB_LINKS.forEach(function (pair) {
            var href = pl[pair[0]];
            if (isSafeUrl(href))
              links +=
                '<a class="pub-link" href="' +
                esc(href) +
                '" target="_blank" rel="noopener">' +
                esc(pair[1]) +
                " " +
                extIcon() +
                "</a>";
          });
          var typeLabel = TYPE_LABEL[p.type] || (p.type ? esc(p.type) : "");
          html +=
            '<article class="pub-item">' +
            (typeLabel
              ? '<span class="pub-type">' + typeLabel + "</span>"
              : "<span></span>") +
            '<div class="pub-body">' +
            '<h3 class="pub-title">' +
            esc(p.title) +
            "</h3>" +
            (p.authors
              ? '<p class="pub-authors">' + highlightMe(p.authors) + "</p>"
              : "") +
            (p.venue ? '<p class="pub-venue">' + esc(p.venue) + "</p>" : "") +
            (links ? '<div class="pub-links">' + links + "</div>" : "") +
            "</div>" +
            "</article>";
        });
      });
      host.innerHTML = html;
    });
  }

  /* ---------- projects ---------- */
  var PROJ_LINKS = [
    ["paper", "Paper"],
    ["repo", "Code"],
    ["demo", "Live"],
    ["slides", "Slides"],
    ["url", "Link"],
  ];

  function projTags(tags) {
    if (!Array.isArray(tags) || !tags.length) return "";
    return (
      '<div class="card-tags">' +
      tags
        .map(function (t) {
          return '<span class="card-tag">' + esc(t) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }
  function projLinks(pl) {
    pl = pl || {};
    var out = "";
    PROJ_LINKS.forEach(function (pair) {
      var h = pl[pair[0]];
      if (isSafeUrl(h))
        out +=
          '<a class="card-link" href="' +
          esc(h) +
          '" target="_blank" rel="noopener">' +
          esc(pair[1]) +
          " " +
          extIcon() +
          "</a>";
    });
    return out ? '<div class="card-links">' + out + "</div>" : "";
  }
  function projDesc(d) {
    if (Array.isArray(d))
      return (
        '<ul class="feature-points">' +
        d
          .map(function (x) {
            return "<li>" + esc(x) + "</li>";
          })
          .join("") +
        "</ul>"
      );
    if (d) return '<p class="card-desc">' + esc(d) + "</p>";
    return "";
  }

  // FEATURED: full width, image left (only if present — no placeholder)
  function featuredCard(p) {
    var media = "";
    if (p.image && isSafeUrl(p.image)) {
      media =
        '<div class="feature-media"><img src="' +
        esc(p.image) +
        '" alt="" loading="lazy" onerror="var m=this.closest(\'.feature-media\'); if(m) m.remove();" /></div>';
    }
    return (
      '<article class="card card-feature">' +
      media +
      '<div class="card-body">' +
      (p.status
        ? '<span class="card-status">' + esc(p.status) + "</span>"
        : "") +
      "<h3>" +
      esc(p.title) +
      "</h3>" +
      projDesc(p.description) +
      projTags(p.tags) +
      projLinks(p.links) +
      "</div>" +
      "</article>"
    );
  }

  // OTHER: grid card, image on top (placeholder if missing), short description
  function otherCard(p) {
    var img;
    if (p.image && isSafeUrl(p.image)) {
      img =
        '<img class="card-media" src="' +
        esc(p.image) +
        '" alt="" loading="lazy" onerror="this.classList.add(\'img-missing\');this.removeAttribute(\'src\');" />';
    } else {
      img = '<div class="card-media img-missing" aria-hidden="true"></div>';
    }
    return (
      '<article class="card">' +
      img +
      '<div class="card-body">' +
      (p.status
        ? '<span class="card-status">' + esc(p.status) + "</span>"
        : "") +
      "<h3>" +
      esc(p.title) +
      "</h3>" +
      (p.description
        ? '<p class="card-desc">' + esc(p.description) + "</p>"
        : "") +
      projTags(p.tags) +
      projLinks(p.links) +
      "</div>" +
      "</article>"
    );
  }

  function renderProjects() {
    var featured = document.getElementById("featured-grid");
    var other = document.getElementById("other-grid");
    if (!featured && !other) return;
    loadJSON("projects.json").then(function (data) {
      data = data || {};
      if (featured) {
        featured.innerHTML =
          Array.isArray(data.featured) && data.featured.length
            ? data.featured.map(featuredCard).join("")
            : '<p class="empty">Add featured work to <code>projects.json</code> under "featured".</p>';
      }
      if (other) {
        other.innerHTML =
          Array.isArray(data.other) && data.other.length
            ? data.other.map(otherCard).join("")
            : '<p class="empty">Add more projects to <code>projects.json</code> under "other".</p>';
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  function revealSections() {
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    var targets = document.querySelectorAll(
      ".section, .section-plain, .page-hero",
    );
    targets.forEach(function (t) {
      t.classList.add("reveal");
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    targets.forEach(function (t) {
      io.observe(t);
    });
  }

  /* ---------- boot ---------- */
  // Immediate UI — never blocked by network
  initTheme();
  initNav();
  setYear();
  revealSections();

  // Data-driven — each fetch is independent
  loadJSON("config.json").then(applyConfig);
  renderTimeline("education-list", "education.json");
  renderTimeline("experience-list", "experience.json");
  renderBlog();
  renderPublications();
  renderProjects();
})();

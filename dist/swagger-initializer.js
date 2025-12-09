window.onload = function () {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    url: "swagger.yaml",
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset.slice(1)],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: "StandaloneLayout",
  });
  // Format displayed date strings from `yyyy-mm-dd` (or `yyyy-mm-ddT...`) to `dd/mm/yyyy`.
  // This is a non-invasive DOM post-processor: it replaces text nodes visible in the UI.
  (function setupDateFormatter() {
    function replaceDatesInText(s) {
      if (!s || typeof s !== "string") return s;
      // Convert date portion YYYY-MM-DD to DD/MM/YYYY (applies to plain dates and date part of datetimes)
      return s.replace(/(\d{4})-(\d{2})-(\d{2})/g, function (match, y, m, d) {
        return d + "/" + m + "/" + y;
      });
    }

    function walk(node) {
      var child, next;
      switch (node.nodeType) {
        case 1: // Element
        case 9: // Document
        case 11: // Document fragment
          child = node.firstChild;
          while (child) {
            next = child.nextSibling;
            walk(child);
            child = next;
          }
          break;
        case 3: // Text node
          // Skip script/style contents
          if (
            node.parentElement &&
            (node.parentElement.nodeName === "SCRIPT" ||
              node.parentElement.nodeName === "STYLE")
          )
            break;
          var newText = replaceDatesInText(node.nodeValue);
          if (newText !== node.nodeValue) node.nodeValue = newText;
          break;
      }
    }

    var container = document.getElementById("swagger-ui");
    if (!container) return;

    // Run once after initial render
    setTimeout(function () {
      walk(container);
    }, 500);

    // Observe dynamic changes and reformat new content
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(function (n) {
            walk(n);
          });
        }
        if (m.type === "characterData" && m.target) walk(m.target);
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  })();

  //</editor-fold>
};

// ========== Register execution functions ==========
function loadCSS(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    link.onload = () => resolve(url);
    link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));

    document.head.appendChild(link);
  });
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = () => resolve(url);
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    document.body.appendChild(script);
  });
}

// ========== Register scripts ==========
const cssFiles = [
  "assets/bootstrap/css/bootstrap.min.css", // load bootstrap classes
  "assets/bootstrap/icon/font/bootstrap-icons.min.css", // load bootstrap icons
  "assets/css/custom.css", // define new classes
  "assets/css/fonts.css", // define fonts
  "assets/css/colors.css", // define colors
  "assets/css/grid.css", // define grid system
  "assets/css/line-clamp.css", // define line-clamp system
  "assets/css/reset.css", // re-define some bootstrap classes
  "assets/css/style.css", // style pages, components
  "assets/css/responsive.css", // responsive pages, components
  "assets/css/darkmode.css", // enable darkmode
  "assets/library/flatpickr/flatpickr.min.css", // style datetime picker
  "assets/library/select2/select2.min.css", // style select2
  "assets/library/select2/select2-bootstrap-5-theme.min.css", // style select2
  "assets/library/bootstrap-table/bootstrap-table.min.css",
  "assets/library/bootstrap-table/bootstrap-table-fixed-columns.min.css",
];

const jsFiles = [
  "assets/library/embla-carousel/embla-carousel.umd.js",
  "assets/library/embla-carousel/embla-carousel-autoplay.umd.js",
  "assets/library/flatpickr/flatpickr.min.js",
  "assets/library/chartjs/chart.js",
  "assets/library/fullcalendar/index.global.min.js",
  "assets/library/jquery-3.5.0.slim.min.js",
  "assets/library/select2/select2.full.min.js",
  "assets/bootstrap/js/bootstrap.bundle.min.js",
  "assets/js/embla-carousel.js",
  "assets/js/dragdrop.js",
  "assets/js/chart.js",
  "assets/js/fullcalendar.js",
  "assets/js/script.js",
  "assets/library/bootstrap-table/bootstrap-table.min.js",
  "assets/library/bootstrap-table/bootstrap-table-fixed-columns.min.js",
  "assets/js/bootstrap-table-fixed-columns.js",
];

const promises = [...cssFiles.map(loadCSS), ...jsFiles.map(loadScript)];

// ========== Execute scripts ==========
Promise.all(promises)
  .then(() => {
    console.log(
      "%c All CSS and JS files have been loaded",
      "background-color:green"
    );
    createEmblaCarousel();
    createDragDrop();
    toggleEyePassword();
    attachToList();
    createDatePicker();
    checkAllBoxes();
    selectMultipleOptions();
    createChart();
    initToggleBootstrapDropdown();
    initOverflowSidebar();
    initDarkMode();
    initDualRangeSlider();
    initCollapseSidebarAddWidget();
    createCalendar();
    createCalendarMini();
    initHandleRadioToggle();
    initWelcomePopup();
    initSelect2Multiple();
  })
  .catch((error) => {
    console.error("Error loading files:", error);
  });

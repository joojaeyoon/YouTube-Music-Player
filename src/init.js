function Initialize(Webcontents) {
  Webcontents.executeJavaScript(`
    var navBar = document.querySelector(
        "#layout > ytmusic-nav-bar > div.center-content.style-scope.ytmusic-nav-bar"
    );
    navBar.style.webkitAppRegion = "drag";
    for (var i = 0; i < navBar.children.length; i++) {
        navBar.children[i].style.webkitAppRegion = "no-drag";
    }
  `);
}

module.exports = { Initialize };

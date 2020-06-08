window.onload = function(){
    let
      d = document,
      ionIcon = d.querySelector('header ion-icon'),
      mobileMenu = d.querySelector('header .mobileMenu'),
      mobileLangMenu = d.querySelector('header ul.menuLang'),
      menuShow = function() {
        if(!Number(mobileMenu.style.width.replace(/\D/g,'')))
          mobileMenu.style.width = '270px';
        else
          mobileMenu.style.width = '0px';
      };
    ionIcon.onclick = menuShow;
    mobileMenu.onclick = function(click){
      if(click.target.className !== 'menuLang')
        menuShow();
      else {
        if(!Number(mobileLangMenu.style.height.replace(/\D/g,'')))
          mobileLangMenu.style.height = '300px';
        else
          mobileLangMenu.style.height = '0px';
      }
    }
    /* languages */
    let menuLang = {
      font:d.querySelector('font.menuLang'),
      ul:d.querySelectorAll('ul.menuLang li')
    }
    menuLang.font.innerText = localStorage.getItem('language') ? localStorage.getItem('language').toUpperCase() : 'EN';
    menuLang.ul.forEach(function(li){
      li.onclick = function() {
        //menuLang.font.innerText = this.dataset.langnameShort;
        localStorage.setItem('language',this.dataset.langnameShort.toLowerCase());
        window.location.reload(false);
      }
    });
}
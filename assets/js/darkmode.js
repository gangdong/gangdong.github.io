function toggleDarkMode() {
    const DARK_CLASS = 'dark';

    var body = document.querySelector("body");
    if (body.classList.contains(DARK_CLASS)) {
        setCookie('theme', 'light');
        body.classList.remove(DARK_CLASS);
    } else {
        setCookie('theme', 'dark');
        body.classList.add(DARK_CLASS);
    }
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;SameSite=strict;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
var theme = getCookie('theme');
if ( (theme === null && userPrefersDark) || theme === 'dark') {
    var checkDarkDone = false;
    function checkDark() {
        if (!checkDarkDone) {
            toggleDarkMode();
			$('.dark-mode').toggleClass('light-mode');
        }
        checkDarkDone = true;
    };
	/* switcher has been removed, so comment out this code temporarily
    function toggleSwitch() {
		//document.querySelectorAll('.dark-mode-toggle').forEach(ti => ti.checked = true);
		var toggleInput = document.querySelector('#dark-mode-toggle');
        toggleInput.checked = true;
        
    };
	*/
    // Attempt both requestAnimationFrame and DOMContentLoaded, whichever comes first.
    if (window.requestAnimationFrame) window.requestAnimationFrame(checkDark);
    window.addEventListener('DOMContentLoaded', checkDark);
	// Remove toggleSwitch but reserve for future use. 
    //if (window.requestAnimationFrame) window.requestAnimationFrame(toggleSwitch);
    //window.addEventListener('DOMContentLoaded', toggleSwitch);
	
	if (document.getElementById("mode").innerHTML=="Light mode")
		document.getElementById("mode").innerHTML="Dark mode";
	else 
		document.getElementById("mode").innerHTML="Light mode";
}
